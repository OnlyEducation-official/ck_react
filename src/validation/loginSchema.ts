import {z} from "zod"

export const LoginSchema = z.object({
    email:z.email(),
    password:z.string().min(1,"Password Required")
})

export type LoginSchemaType = z.infer<typeof LoginSchema>