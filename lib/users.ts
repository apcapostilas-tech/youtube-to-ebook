import fs from "fs";
import path from "path";
import crypto from "crypto";

const USERS_FILE = process.env.USERS_FILE || path.join(process.cwd(), "data", "users.json");

function hash(password: string) {
  return crypto.createHash("sha256").update(password + "mccl_salt").digest("hex");
}

function load(): Record<string, { passwordHash: string; token?: string }> {
  if (!fs.existsSync(USERS_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8")); } catch { return {}; }
}

function save(users: Record<string, { passwordHash: string; token?: string }>) {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function registerUser(email: string, password: string): { ok: boolean; error?: string } {
  const users = load();
  const key = email.toLowerCase().trim();
  if (users[key]) return { ok: false, error: "Email já cadastrado." };
  users[key] = { passwordHash: hash(password) };
  save(users);
  return { ok: true };
}

export function loginUser(email: string, password: string): { ok: boolean; token?: string; error?: string } {
  const users = load();
  const key = email.toLowerCase().trim();
  const user = users[key];
  if (!user || user.passwordHash !== hash(password)) return { ok: false, error: "Email ou senha incorretos." };
  const token = crypto.randomBytes(32).toString("hex");
  users[key].token = token;
  save(users);
  return { ok: true, token };
}

export function validateToken(token: string): boolean {
  if (!token) return false;
  const users = load();
  return Object.values(users).some((u) => u.token === token);
}
