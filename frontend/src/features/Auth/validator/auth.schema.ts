import { z } from "zod";

export const RegisterUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name cannot exceed 50 characters" }),
    
    // 1. Username validation add kiya taaki empty string submit na ho
    username: z
      .string()
      .trim()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(30, { message: "Username cannot exceed 30 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
    
    // 2. Email validation ko clean aur standard tarike se likha
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email({message: "Invalid email address"})),
    
    password: z
      .string()
      .trim()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(50, { message: "Password cannot exceed 50 characters" }),
    
    // 3. Confirm password ko bhi trim aur validate kiya
    confirmPassword: z
      .string()
      .trim()
      .min(6, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error confirmPassword field par dikhega
  });

// Type export standard naming convention ke sath (PascalCase)
export type RegisterUserType = z.infer<typeof RegisterUserSchema>;