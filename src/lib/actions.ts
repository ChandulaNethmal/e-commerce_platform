"use server";

import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }
  console.log("Login submitted for:", result.data.username);
  return { success: true };
}

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export async function register(prevState: any, formData: FormData) {
  const result = registerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }
  console.log("Registration submitted for:", result.data.username);
  return { success: true };
}

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContact(prevState: any, formData: FormData) {
  const result = contactSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }
  console.log("Contact form submitted:", result.data);
  return { success: true };
}

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  card: z.string().length(16, "Card number must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be MM/YY"),
  cvc: z.string().length(3, "CVC must be 3 digits"),
});

export async function placeOrder(prevState: any, formData: FormData) {
    const result = checkoutSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!result.success) {
      return { error: result.error.flatten().fieldErrors };
    }
    console.log("Order placed for:", result.data.email);
    console.log("Mock email notification sent.");
    return { success: true };
}
