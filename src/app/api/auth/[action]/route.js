import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const USERS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'users.json');

async function readUsers() {
  const contents = await readFile(USERS_FILE_PATH, 'utf8');
  const users = JSON.parse(contents);

  if (!Array.isArray(users)) {
    throw new Error('User database must contain a JSON array.');
  }

  return users;
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function jsonError(message, status) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(_request, { params }) {
  const { action } = await params;

  if (action !== 'users') {
    return jsonError('Not found.', 404);
  }

  try {
    const users = await readUsers();
    return NextResponse.json({ users: users.map(publicUser) });
  } catch (error) {
    console.error('Unable to read user database:', error);
    return jsonError('Unable to retrieve users.', 500);
  }
}

export async function POST(request, { params }) {
  const { action } = await params;

  if (!['customer', 'merchant', 'login', 'register'].includes(action)) {
    return jsonError('Not found.', 404);
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

  if (action === 'register') {
    return registerUser(payload);
  }

  const identifier = String(payload.identifier || payload.username || payload.email || '')
    .trim()
    .toLowerCase();
  const password = String(payload.password || '').trim();

  if (!identifier || !password) {
    return jsonError('Email/username and password are required.', 400);
  }

  try {
    const users = await readUsers();
    const user = users.find(
      (candidate) =>
        candidate.email?.toLowerCase() === identifier ||
        candidate.username?.toLowerCase() === identifier
    );

    if (!user) {
      return jsonError('This email does not exist. Please create an account.', 404);
    }

    if (user.password !== password) {
      return jsonError('Incorrect password.', 401);
    }

    if (action === 'merchant' && user.role === 'customer') {
      return jsonError(
        'This account is registered as a customer. Please use Customer Login or register as a merchant partner.',
        403
      );
    }

    const safeUser = publicUser(user);
    return NextResponse.json({
      success: true,
      role: safeUser.role,
      user: safeUser,
      token: `auth-token-${safeUser.role}-${Date.now()}`,
      message: `${safeUser.role === 'merchant' ? 'Merchant' : 'Customer'} login successful.`,
    });
  } catch (error) {
    console.error('Unable to authenticate user:', error);
    return jsonError('Server error processing credentials.', 500);
  }
}

async function registerUser(payload) {
  const email = String(payload.email || '').trim().toLowerCase();
  const password = String(payload.password || '').trim();
  const role = payload.role === 'merchant' ? 'merchant' : 'customer';

  if (!email || !password) {
    return jsonError('Email and password are required.', 400);
  }

  try {
    const users = await readUsers();
    if (users.some((user) => user.email?.toLowerCase() === email)) {
      return jsonError('An account with this email address already exists.', 409);
    }

    const newUser = {
      id: Date.now(),
      username: String(payload.username || email.split('@')[0]).trim(),
      email,
      password,
      firstName: String(payload.firstName || (role === 'merchant' ? 'Partner' : 'Member')).trim(),
      lastName: String(payload.lastName || 'Store').trim(),
      role,
      ...(role === 'merchant'
        ? {
            storeName: payload.storeName,
            storeCategory: payload.storeCategory || 'General',
            gstin: payload.gstin,
            pan: payload.pan,
            bankAccount: payload.bankAccount,
            pickupAddress: payload.pickupAddress,
          }
        : {}),
      image: '/src/assets/images/avatar_collector_portrait_1791282676033.jpg',
      createdAt: new Date().toISOString(),
    };

    await writeFile(USERS_FILE_PATH, JSON.stringify([...users, newUser], null, 2), 'utf8');

    const safeUser = publicUser(newUser);
    return NextResponse.json(
      {
        success: true,
        role,
        user: safeUser,
        token: `auth-token-${role}-${Date.now()}`,
        message: 'Account created successfully.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unable to register user:', error);
    return jsonError('Server error registering account.', 500);
  }
}
