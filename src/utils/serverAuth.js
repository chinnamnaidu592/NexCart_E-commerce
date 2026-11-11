import { createHmac, pbkdf2, randomUUID, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import demoUsers from '@/data/users.json';

export const SESSION_COOKIE_NAME = 'nexcart_demo_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24;
const PASSWORD_ITERATIONS = 210000;
const DEVELOPMENT_SECRET = 'nexcart-development-session-secret-only';
const deriveKey = promisify(pbkdf2);

const builtInDemoUsers = [
  {
    id: 'demo-admin',
    username: 'emilys',
    email: 'emilys@example.com',
    password: 'pbkdf2$210000$uInwKyi9G7DZZiYPwdYpzg==$zlw5qnwODqLYYlFATcPHdlPBtjvLB+BtVHPZIAlg4rA=',
    firstName: 'Emily',
    lastName: 'Johnson',
    role: 'admin',
    image: '/images/avatar_collector_portrait_1791282676033.jpg',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-customer',
    username: 'michaelw',
    email: 'michaelw@example.com',
    password: 'pbkdf2$210000$9KiuRWhEX6VWFgdE22j38A==$oT34G5h/lvu1yCAQ/Bqjzv2TBgqX1fEfad/oNBhWvI0=',
    firstName: 'Michael',
    lastName: 'Williams',
    role: 'customer',
    image: '/images/avatar_collector_portrait_1791282676033.jpg',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
];

const publicFields = [
  'id',
  'username',
  'email',
  'firstName',
  'lastName',
  'role',
  'image',
  'createdAt',
  'storeName',
  'storeCategory',
];

export function toPublicUser(user) {
  return Object.fromEntries(
    publicFields
      .filter((field) => user[field] !== undefined)
      .map((field) => [field, user[field]])
  );
}

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === 'production' && (!secret || secret.length < 32)) {
    throw new Error('AUTH_SECRET must contain at least 32 characters in production.');
  }
  return secret || DEVELOPMENT_SECRET;
}

function sign(value) {
  return createHmac('sha256', getSessionSecret()).update(value).digest();
}

export function createSessionToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      user: toPublicUser(user),
      expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
    })
  ).toString('base64url');
  const signature = sign(payload).toString('base64url');
  return `${payload}.${signature}`;
}

export function readSession(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;

  try {
    const suppliedSignature = Buffer.from(signature, 'base64url');
    const expectedSignature = sign(payload);
    if (
      suppliedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(suppliedSignature, expectedSignature)
    ) return null;

    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (
      !session.user ||
      !['customer', 'merchant', 'admin'].includes(session.user.role) ||
      !Number.isFinite(session.expiresAt) ||
      session.expiresAt <= Date.now()
    ) return null;

    return toPublicUser(session.user);
  } catch {
    return null;
  }
}

export function setSessionCookie(response, user) {
  response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function clearSessionCookie(response) {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function verifyPassword(password, storedHash) {
  const [algorithm, iterations, salt, hash, extra] = String(storedHash).split('$');
  if (
    algorithm !== 'pbkdf2' ||
    Number(iterations) !== PASSWORD_ITERATIONS ||
    !salt ||
    !hash ||
    extra
  ) return false;

  const expected = Buffer.from(hash, 'base64');
  const saltBytes = Buffer.from(salt, 'base64');
  if (expected.length !== 32 || saltBytes.length !== 16) return false;

  const actual = await deriveKey(password, saltBytes, PASSWORD_ITERATIONS, expected.length, 'sha256');
  return timingSafeEqual(actual, expected);
}

export { demoUsers, builtInDemoUsers };

export function getDemoUsers() {
  return [...builtInDemoUsers, ...demoUsers];
}

export function createRegisteredDemoUser(payload, role) {
  return toPublicUser({
    id: `demo-${randomUUID()}`,
    username: String(payload.username || payload.email.split('@')[0]).trim().slice(0, 40),
    email: payload.email,
    firstName: String(payload.firstName || 'Member').trim().slice(0, 80),
    lastName: String(payload.lastName || '').trim().slice(0, 80),
    role,
    ...(role === 'merchant'
      ? {
          storeName: String(payload.storeName || '').trim().slice(0, 100),
          storeCategory: String(payload.storeCategory || 'General').trim().slice(0, 80),
        }
      : {}),
    image: '/images/avatar_collector_portrait_1791282676033.jpg',
    createdAt: new Date().toISOString(),
  });
}
