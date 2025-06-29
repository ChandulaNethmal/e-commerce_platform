"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, register } from "@/lib/actions";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/lib/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type AuthFormProps = {
  mode: "login" | "register";
};

function SubmitButton({ mode }: { mode: "login" | "register" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {mode === "login" ? "Login" : "Create Account"}
    </Button>
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  const action = mode === "login" ? login : register;
  const [state, formAction] = useFormState(action, null);
  const { login: authLogin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      const username = new FormData(document.querySelector(`form[data-mode="${mode}"]`) as HTMLFormElement).get("username") as string;
      authLogin(username);
      toast({ title: mode === 'login' ? 'Login Successful' : 'Registration Successful', description: "Welcome to BloomNext!" });
      router.push("/");
    } else if (state?.error) {
      // Concatenate all error messages for the toast
      const errorMessages = Object.values(state.error).flat().join(", ");
      toast({ variant: "destructive", title: "Authentication Failed", description: errorMessages });
    }
  }, [state, authLogin, router, toast, mode]);

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">{mode === "login" ? "Welcome Back" : "Create an Account"}</CardTitle>
          <CardDescription>
            {mode === "login" ? "Log in to continue your floral journey." : "Join us to start exploring our collection."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form data-mode={mode} action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="your_username" required />
              {state?.error?.username && <p className="text-sm text-destructive">{state.error.username.join(', ')}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
               {state?.error?.password && <p className="text-sm text-destructive">{state.error.password.join(', ')}</p>}
            </div>
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
                {state?.error?.confirmPassword && <p className="text-sm text-destructive">{state.error.confirmPassword.join(', ')}</p>}
              </div>
            )}
            <SubmitButton mode={mode} />
          </form>
           <div className="mt-4 text-center text-sm">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <Button variant="link" asChild className="p-0">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Button variant="link" asChild className="p-0">
                  <Link href="/login">Login</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
