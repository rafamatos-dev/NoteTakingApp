import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

export const createUserDTO = z.object({
    body: z.object({
        firstName: z.string({required_error: "First name is required"}),
        lastName: z.string({required_error: "Last name is required"}),
        email: z.string({required_error: "Email is required"})
            .email("Invalid email"),
        password: z.string({required_error: "Password is required"})
            .min(8, "Password length must be greater than 8 characters")
            .max(16, "Password length must be lower than 8 characters"),
        birthday: z.date({required_error: "Birthday is required"}),
        createdOn: z.date(),
        lastModified: z.date()
    })
});

export const loginUserDTO = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email or password'),
        password: z
            .string({ required_error: 'Password is required' })
            .min(8, 'Invalid email or password'),
        }),
});

export type CreateUserInput = z.TypeOf<typeof createUserDTO>['body'];
export type LoginUserInput = z.TypeOf<typeof loginUserDTO>['body'];