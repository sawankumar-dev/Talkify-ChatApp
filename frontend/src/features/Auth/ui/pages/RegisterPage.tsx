import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RegisterUserSchema, type RegisterUserType } from "../../validator/auth.schema"
import { useAppDispatch } from "@/shared/hooks/hooks"
import { registerUserAction } from "../../state/authActions"

const RegisterPage = () => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm<RegisterUserType>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })
  const dispatch = useAppDispatch()

  const handleForm = async (data: RegisterUserType) => {
    try {
      console.log(data)
      // Yahan aapki backend API request aayegi
      dispatch(registerUserAction({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password
      }))
      reset()
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  return (
    // Ab yahan full screen wrapper ki zaroorat nahi hai, sirf ek clean dynamic glassmorphic card hoga
    <div className="w-full bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 p-8 rounded-2xl shadow-2xl space-y-6">
      
      {/* Header section (Layout ke logo ke neeche aane ke liye perfectly spaced) */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-white">Create an account</h1>
        <p className="text-sm text-zinc-400">Enter your details below to get started</p>
      </div>

      <form onSubmit={handleSubmit(handleForm)} className="space-y-4">
        <FieldGroup className="flex flex-col gap-4">
          
          {/* Name Field */}
          <Field data-invalid={!!errors.name} aria-invalid={!!errors.name}>
            <FieldLabel htmlFor="name" className="text-zinc-300 font-medium text-xs uppercase tracking-wider mb-1.5">Full Name</FieldLabel>
            <Input 
              type="text" 
              placeholder="John Doe" 
              id="name" 
              className="h-11 bg-zinc-950/40 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
              {...register("name")}
            />
            {errors.name && <FieldError className="text-red-400 text-xs mt-1">{errors.name.message}</FieldError>}
          </Field>

          {/* Username Field */}
          <Field data-invalid={!!errors.username} aria-invalid={!!errors.username}>
            <FieldLabel htmlFor="username" className="text-zinc-300 font-medium text-xs uppercase tracking-wider mb-1.5">Username</FieldLabel>
            <Input 
              type="text" 
              placeholder="johndoe_12" 
              id="username" 
              className="h-11 bg-zinc-950/40 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
              {...register("username")} 
            />
            {errors.username && <FieldError className="text-red-400 text-xs mt-1">{errors.username.message}</FieldError>}
          </Field>

          {/* Email Field */}
          <Field data-invalid={!!errors.email} aria-invalid={!!errors.email}>
            <FieldLabel htmlFor="email" className="text-zinc-300 font-medium text-xs uppercase tracking-wider mb-1.5">Email Address</FieldLabel>
            <Input 
              type="email" 
              placeholder="you@example.com" 
              id="email" 
              className="h-11 bg-zinc-950/40 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
              {...register("email")} 
            />
            {errors.email && <FieldError className="text-red-400 text-xs mt-1">{errors.email.message}</FieldError>}
          </Field>

          {/* Password Field */}
          <Field data-invalid={!!errors.password} aria-invalid={!!errors.password}>
            <FieldLabel htmlFor="password" className="text-zinc-300 font-medium text-xs uppercase tracking-wider mb-1.5">Password</FieldLabel>
            <Input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              className="h-11 bg-zinc-950/40 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
              {...register("password")} 
            />
            {errors.password && <FieldError className="text-red-400 text-xs mt-1">{errors.password.message}</FieldError>}
          </Field>

          {/* Confirm Password Field */}
          <Field data-invalid={!!errors.confirmPassword} aria-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword" className="text-zinc-300 font-medium text-xs uppercase tracking-wider mb-1.5">Confirm Password</FieldLabel>
            <Input 
              type="password" 
              id="confirmPassword" 
              placeholder="••••••••" 
              className="h-11 bg-zinc-950/40 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
              {...register("confirmPassword")} 
            />
            {errors.confirmPassword && <FieldError className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</FieldError>}
          </Field>

          {/* Submit Button */}
          <Button 
            disabled={isSubmitting} 
            type="submit" 
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>

        </FieldGroup>
      </form>

      {/* Footer Nav Link */}
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <a href="/auth" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline underline-offset-4">
          Sign in
        </a>
      </p>

    </div>
  )
}

export default RegisterPage