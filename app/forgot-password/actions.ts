"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function resetPassword(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  // Password resets are disabled to prevent unauthorized account takeovers
  // since a mail server loop is not configured in this sandbox environment.
  return { 
    error: "Self-service password resets are disabled in this sandbox environment. Please contact your workspace administrator to reset your credentials." 
  };
}
