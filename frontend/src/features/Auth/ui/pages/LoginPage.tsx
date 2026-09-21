import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoginUserSchema, type LoginUserType } from "../../validator/auth.schema"
import { loginUserAction } from "../../state/authActions"
import { useAppDispatch } from "@/shared/hooks/hooks"
import { NavLink } from "react-router"

const LoginPage = () => {
  const dispatch = useAppDispatch()
  
  const { 
    register, 
    reset, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginUserType>({
    resolver: zodResolver(LoginUserSchema),
    // defaultValues taaki console warning na aaye aur inputs fresh render hon
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const handleForm = async (credentials: LoginUserType) => {
    try {
      console.log(credentials)
      // Thunk action dispatch ho raha hai
      await dispatch(loginUserAction(credentials))
      reset()
    } catch (error) {
      console.error("Login component error:", error)
    }
  }

  return (
    // 'bg-white' ko hata kar perfect translucent glassmorphic container lagaya
    <div className="w-full bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 p-8 rounded-2xl shadow-2xl space-y-6">
      
      {/* Header section - Register page jaisi premium spacing */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
        <p className="text-sm text-zinc-400">Enter your credentials to access your chats</p>
      </div>

      <form onSubmit={handleSubmit(handleForm)} className="space-y-4">
        <FieldGroup className="flex flex-col gap-4">
          
          {/* Email Field */}
          <Field>
            <FieldLabel htmlFor="email" className="text-zinc-300 font-medium text-xs uppercase tracking-wider mb-1.5">Email Address</FieldLabel>
            <Input 
              type="email" 
              id="email" 
              placeholder="you@example.com" 
              aria-invalid={!!errors.email}
              className="h-11 bg-zinc-950/40 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
              {...register("email")} 
            />
            {errors.email && <FieldError className="text-red-400 text-xs mt-1">{errors.email.message}</FieldError>}
          </Field>

          {/* Password Field */}
          <Field>
            {/* Flex wrapper taaki future mein agar 'Forgot Password?' link lagana ho toh side mein set ho jaye */}
            <div className="flex items-center justify-between mb-1.5">
              <FieldLabel htmlFor="password" className="text-zinc-300 font-medium text-xs uppercase tracking-wider">Password</FieldLabel>
              <a href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot?</a>
            </div>
            <Input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              aria-invalid={!!errors.password}
              className="h-11 bg-zinc-950/40 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
              {...register("password")} 
            />
            {errors.password && <FieldError className="text-red-400 text-xs mt-1">{errors.password.message}</FieldError>}
          </Field>

          {/* Submit Button with loader support and click effect */}
          <Button 
            disabled={isSubmitting} 
            type="submit" 
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>

        </FieldGroup>
      </form>

      {/* Footer Nav Link */}
      <p className="text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <NavLink to={"/auth/register"} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline underline-offset-4">
          Sign up
        </NavLink>
      </p>

    </div>
  )
}

export default LoginPage