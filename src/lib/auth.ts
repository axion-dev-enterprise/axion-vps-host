import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const AUTH_COOKIE_NAME = "axion_vps_host_auth";
const JWT_SECRET = process.env.AUTH_JWT_SECRET || process.env.APP_SECRET || "axion-vps-host-change-me";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
const USERS_FILE = path.join(process.cwd(), "data", "users.json");

type UserRole = "client" | "admin";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
};

type UserStore = {
  users: StoredUser[];
};

export type PublicUser = Omit<StoredUser, "passwordHash">;

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function signToken(payload: Record<string, unknown>) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = createHmac("sha256", JWT_SECRET).update(`${encodedHeader}.${encodedPayload}`).digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyToken(token: string) {
  const [encodedHeader, encodedPayload, signature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", JWT_SECRET).update(`${encodedHeader}.${encodedPayload}`).digest();
  const receivedSignature = Buffer.from(signature.replace(/-/g, "+").replace(/_/g, "/"), "base64");

  if (expectedSignature.length !== receivedSignature.length || !timingSafeEqual(expectedSignature, receivedSignature)) {
    return null;
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as {
    sub: string;
    email: string;
    role: UserRole;
    exp: number;
  };

  if (payload.exp * 1000 < Date.now()) {
    return null;
  }

  return payload;
}

function generatePasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(":");
  if (!salt || !storedHash) {
    return false;
  }

  const computedHash = pbkdf2Sync(password, salt, 120000, 64, "sha512");
  const storedBuffer = Buffer.from(storedHash, "hex");

  return storedBuffer.length === computedHash.length && timingSafeEqual(storedBuffer, computedHash);
}

async function ensureUserStore() {
  await mkdir(path.dirname(USERS_FILE), { recursive: true });

  if (existsSync(USERS_FILE)) {
    return;
  }

  const seededAdmin: StoredUser = {
    id: cryptoRandomId(),
    name: "AXION Admin",
    email: "admin@axion.host",
    company: "AXION",
    role: "admin",
    passwordHash: generatePasswordHash("Admin@123!"),
    createdAt: new Date().toISOString(),
  };

  await writeFile(USERS_FILE, JSON.stringify({ users: [seededAdmin] }, null, 2));
}

function cryptoRandomId() {
  return randomBytes(12).toString("hex");
}

async function readUserStore(): Promise<UserStore> {
  await ensureUserStore();
  const raw = await readFile(USERS_FILE, "utf8");
  return JSON.parse(raw) as UserStore;
}

async function writeUserStore(store: UserStore) {
  await writeFile(USERS_FILE, JSON.stringify(store, null, 2));
}

function sanitizeUser(user: StoredUser): PublicUser {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function registerUser(input: { name: string; email: string; password: string; company?: string }) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const company = input.company?.trim();

  if (!name || !normalizedEmail || !input.password) {
    throw new Error("Preencha nome, email e senha.");
  }

  if (input.password.length < 8) {
    throw new Error("A senha precisa ter pelo menos 8 caracteres.");
  }

  const store = await readUserStore();
  const existingUser = store.users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    throw new Error("Já existe uma conta com este email.");
  }

  const user: StoredUser = {
    id: cryptoRandomId(),
    name,
    email: normalizedEmail,
    company,
    role: "client",
    passwordHash: generatePasswordHash(input.password),
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  await writeUserStore(store);

  return sanitizeUser(user);
}

export async function authenticateUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const store = await readUserStore();
  const user = store.users.find((entry) => entry.email === normalizedEmail);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return sanitizeUser(user);
}

export async function getUserById(id: string) {
  const store = await readUserStore();
  const user = store.users.find((entry) => entry.id === id);
  return user ? sanitizeUser(user) : null;
}

export function createSessionToken(user: PublicUser) {
  return signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  });
}

export function getSessionCookie(token: string) {
  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  };
}

export function getLogoutCookie() {
  return {
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export async function getUserFromToken(token?: string) {
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  return getUserById(payload.sub);
}
