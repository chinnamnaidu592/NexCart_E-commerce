import { NextResponse } from 'next/server';
import {
  clearSessionCookie,
  createRegisteredDemoUser,
  getDemoUsers,
  hasValidSessionSecret,
  readSession,
  setSessionCookie,
  toPublicUser,
  verifyPassword,
} from '@/utils/serverAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ROLES = ['customer', 'merchant', 'admin'];
const noStore = { 'Cache-Control': 'no-store' };

function jsonError(message, status) {
  return NextResponse.json({ success: false, message }, { status, headers: noStore });
}

function jsonSuccess(body, status = 200) {
  return NextResponse.json(body, { status, headers: noStore });
}

export async function GET(request, { params }) {
  const { action } = await params;

  if (action === 'session') {
    return jsonSuccess({ user: readSession(request) });
  }

  if (action !== 'users') {
    return jsonError('Not found.', 404);
  }

  const sessionUser = readSession(request);
  if (!sessionUser) return jsonError('Authentication required.', 401);
  if (sessionUser.role !== 'admin') return jsonError('Admin access required.', 403);

  return jsonSuccess({
    users: getDemoUsers().map(toPublicUser),
  });
}

export async function POST(request, { params }) {
  const { action } = await params;

  if (action === 'logout') {
    const response = jsonSuccess({ success: true });
    clearSessionCookie(response);
    return response;
  }

  if (!['customer', 'merchant', 'admin', 'login', 'register'].includes(action)) {
    return jsonError('Not found.', 404);
  }

  if (!hasValidSessionSecret()) {
    console.error('Authentication is unavailable because AUTH_SECRET is missing or too short.');
    return jsonError(
      'Authentication is temporarily unavailable. Please contact the site administrator.',
      503
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonError('Request body must be valid JSON.', 400);
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return jsonError('Request body must be a JSON object.', 400);
  }

  if (action === 'register') return registerDemoUser(payload);

  const requestedRole = action === 'login' ? payload.role : action;
  if (!ROLES.includes(requestedRole)) {
    return jsonError('A valid login role is required.', 400);
  }

  const identifier = String(payload.identifier || payload.username || payload.email || '')
    .trim()
    .toLowerCase();
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!identifier || !password || identifier.length > 254 || password.length > 128) {
    return jsonError('Invalid email/username or password.', 400);
  }

  const user = getDemoUsers().find(
    (candidate) =>
      candidate.email?.toLowerCase() === identifier ||
      candidate.username?.toLowerCase() === identifier
  );
  if (!user || !(await verifyPassword(password, user.password))) {
    return jsonError('Invalid email/username or password.', 401);
  }
  if (user.role !== requestedRole) {
    return jsonError(`This account is not registered for ${requestedRole} login.`, 403);
  }

  const response = jsonSuccess({
    success: true,
    role: user.role,
    user: toPublicUser(user),
    message: `${requestedRole[0].toUpperCase()}${requestedRole.slice(1)} login successful.`,
  });
  setSessionCookie(response, user);
  return response;
}

async function registerDemoUser(payload) {
  const email = String(payload.email || '').trim().toLowerCase();
  const password = typeof payload.password === 'string' ? payload.password : '';
  const role = payload.role || 'customer';

  if (!['customer', 'merchant'].includes(role)) {
    return jsonError('Only Customer and Merchant registration is available.', 400);
  }
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    password.length < 8 ||
    password.length > 128
  ) {
    return jsonError('Enter a valid email address and a password of 8 to 128 characters.', 400);
  }
  if (getDemoUsers().some((user) => user.email?.toLowerCase() === email)) {
    return jsonError('An account with this email address already exists.', 409);
  }

  const user = createRegisteredDemoUser({ ...payload, email }, role);
  const response = jsonSuccess({
    success: true,
    role,
    user,
    message: 'A temporary demo account was created for this browser session.',
  }, 201);
  setSessionCookie(response, user);
  return response;
}
