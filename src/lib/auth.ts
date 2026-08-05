export type Role = "admin" | "customer" | "business";

export interface AuthUser {
  email: string;
  role: Role;
  name: string;
}

const FAKE_USERS: Array<AuthUser & { password: string }> = [
  { email: "admin@gmail.com", password: "123", role: "admin", name: "Admin" },
  { email: "customer@gmail.com", password: "123", role: "customer", name: "Customer" },
  { email: "business@gmail.com", password: "123", role: "business", name: "Business Owner" },
];

export function authenticate(email: string, password: string): AuthUser | null {
  const match = FAKE_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!match) return null;
  const { password: _password, ...user } = match;
  return user;
}
