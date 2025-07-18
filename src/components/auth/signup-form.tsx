"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/lib/hooks/use-auth";
import { signupSchema } from "@/lib/validations";
import type { SignupFormData } from "@/types";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const signupMutation = useSignup();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError("");
      await signupMutation.mutateAsync({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      });
    } catch {
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="space-y-5 w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="first_name" className="text-sm font-medium text-foreground">
              First name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 mt-0.5 text-muted-foreground" />
            <Input
                id="first_name"
              type="text"
                placeholder="Enter your first name"
                {...form.register("first_name")}
              className={`pl-10 h-12 border-border focus:border-cyan focus:ring-cyan ${
                  form.formState.errors.first_name
                    ? "border-destructive focus:border-destructive focus:ring-destructive"
                    : ""
              }`}
            />
            </div>
            {form.formState.errors.first_name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.first_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-sm font-medium text-foreground">
              Last name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 mt-0.5 text-muted-foreground" />
              <Input
                id="last_name"
                type="text"
                placeholder="Enter your last name"
                {...form.register("last_name")}
                className={`pl-10 h-12 border-border focus:border-cyan focus:ring-cyan ${
                  form.formState.errors.last_name
                    ? "border-destructive focus:border-destructive focus:ring-destructive"
                    : ""
                }`}
              />
            </div>
            {form.formState.errors.last_name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.last_name.message}
              </p>
          )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 mt-0.5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...form.register("email")}
              className={`pl-10 h-12 border-border focus:border-cyan focus:ring-cyan ${
                form.formState.errors.email
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : ""
              }`}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 mt-0.5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              {...form.register("password")}
              className={`pl-10 pr-12 h-12 border-border focus:border-cyan focus:ring-cyan ${
                form.formState.errors.password
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : ""
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-foreground"
          >
            Confirm password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 mt-0.5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...form.register("confirmPassword")}
              className={`pl-10 pr-12 h-12 border-border focus:border-cyan focus:ring-cyan ${
                form.formState.errors.confirmPassword
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : ""
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="agree-terms"
            name="agree-terms"
            type="checkbox"
            className="h-4 w-4 text-cyan focus:ring-cyan border-border rounded"
          />
          <label
            htmlFor="agree-terms"
            className="ml-2 block text-sm text-foreground"
          >
            I agree to the{" "}
            <a
              href="#"
              className="text-cyan hover:text-cyan/80 transition-colors font-medium"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-cyan hover:text-cyan/80 transition-colors font-medium"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        {error && (
          <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 bg-cyan hover:bg-cyan/90 text-primary font-medium rounded-lg transition-colors" 
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold text-cyan hover:text-cyan/80 transition-colors"
            onClick={onSwitchToLogin}
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
} 
