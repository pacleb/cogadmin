"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { z } from "zod";

import { users } from "@/data/users";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

export async function login(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validatedData = loginSchema.parse(data);

  // Simple mock authentication - in real app, check against database
  const user = users.find((u) => u.email === validatedData.email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // In a real app, you'd verify the password hash
  // For demo purposes, accept any password for existing users

  // Create session
  const sessionData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };

  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validatedData = registerSchema.parse(data);

  // Check if user already exists
  const existingUser = users.find((u) => u.email === validatedData.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // In a real app, you'd hash the password and save to database
  const newUser = {
    id: Date.now().toString(),
    name: validatedData.name,
    email: validatedData.email,
    username: validatedData.email.split("@")[0],
    role: "user",
    avatar: "",
  };

  // For demo, we'll just create a session
  const sessionData = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    avatar: newUser.avatar,
  };

  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/auth/v1/login");
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value);
    return sessionData;
  } catch {
    return null;
  }
}
