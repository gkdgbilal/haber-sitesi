"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export async function loginAction(input: {
  email: string;
  password: string;
  callbackUrl?: string;
}) {
  try {
    await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirectTo: input.callbackUrl || "/dashboard",
    });
    return { success: true as const };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false as const, error: "E-posta veya şifre hatalı." };
    }
    throw error;
  }
}
