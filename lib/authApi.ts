import type { Role } from "@/context/AppContext";

type BackendRole = "CREATOR" | "BUSINESS" | "CONSUMER" | "ADMIN";

export type AuthResult = {
  ok: boolean;
  message: string;
};

export type RegisterResult = AuthResult & {
  userId?: string;
};

export type LoginResult = AuthResult & {
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  role?: Exclude<Role, "landing">;
};

export type RegisterPayload = {
  fullName?: string;
  email: string;
  phone?: string;
  password: string;
  role: Exclude<Role, "landing">;
};

export type VerifyRegistrationPayload = {
  userId: string;
  otp: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  password: string;
};

type ApiErrorBody = {
  error?: string;
  message?: string;
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1").replace(/\/$/, "");

const frontendToBackendRole = (role: Exclude<Role, "landing">): BackendRole => {
  if (role === "fan") return "CONSUMER";
  return role.toUpperCase() as BackendRole;
};

const backendToFrontendRole = (role?: string): Exclude<Role, "landing"> => {
  if (role === "CREATOR") return "creator";
  if (role === "BUSINESS") return "business";
  if (role === "ADMIN") return "admin";
  return "fan";
};

const decodeJwtPayload = (token: string): { userId?: string; role?: string } => {
  try {
    const [, payload] = token.split(".");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    return JSON.parse(json);
  } catch {
    return {};
  }
};

const requestJson = async <T>(path: string, init: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const body = (await response.json().catch(() => ({}))) as ApiErrorBody & T;

  if (!response.ok) {
    throw new Error(body.error ?? body.message ?? "Request failed. Please try again.");
  }

  return body as T;
};

export const registerWithApi = async (payload: RegisterPayload): Promise<RegisterResult> => {
  const body = await requestJson<{ message?: string; userId?: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: payload.fullName?.trim() || undefined,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || undefined,
      password: payload.password,
      role: frontendToBackendRole(payload.role),
    }),
  });

  return {
    ok: true,
    message: body.message ?? "Account created successfully.",
    userId: body.userId,
  };
};

export const verifyRegistrationWithApi = async (payload: VerifyRegistrationPayload): Promise<AuthResult> => {
  const body = await requestJson<{ message?: string }>("/auth/verify", {
    method: "POST",
    body: JSON.stringify({
      userId: payload.userId,
      otp: payload.otp.trim(),
    }),
  });

  return {
    ok: true,
    message: body.message ?? "Account verified successfully.",
  };
};

export const loginWithApi = async (email: string, password: string): Promise<LoginResult> => {
  const body = await requestJson<{ accessToken: string; refreshToken: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  const decoded = decodeJwtPayload(body.accessToken);

  return {
    ok: true,
    message: "Welcome back.",
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
    userId: decoded.userId,
    role: backendToFrontendRole(decoded.role),
  };
};

export const requestPasswordResetWithApi = async (email: string): Promise<AuthResult> => {
  const body = await requestJson<{ message?: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
    }),
  });

  return {
    ok: true,
    message: body.message ?? "Password reset code sent to your email.",
  };
};

export const resetPasswordWithApi = async (payload: ResetPasswordPayload): Promise<AuthResult> => {
  const body = await requestJson<{ message?: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      otp: payload.otp.trim(),
      password: payload.password,
    }),
  });

  return {
    ok: true,
    message: body.message ?? "Password reset successfully.",
  };
};

export const logoutWithApi = async (refreshToken: string | null): Promise<void> => {
  if (!refreshToken) return;

  await requestJson<{ message?: string }>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  }).catch(() => undefined);
};
