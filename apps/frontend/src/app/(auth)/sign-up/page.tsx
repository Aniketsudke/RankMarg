"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const signUpSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  username: z
    .string()
    .min(1, "Username is required")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters, numbers, or underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters long.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/\d/, "Password must contain at least one number."),
  confirmpassword: z.string()
    .min(6, "Password must be at least 6 characters long.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/\d/, "Password must contain at least one number."),
});

const SignUpForm = () => {
  const [msg, setMsg] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const watchPassword = watch("password");
  const watchConfirmPassword = watch("confirmpassword");

  const handleSignUp = async (data) => {
    setMsg("");
    if (data.password !== data.confirmpassword) {
      setMsg("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      setMsg(responseData.message);

      if (response.ok) {
        setMsg("Account created successfully. Redirecting to sign-in page...");
        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      } else {
        setMsg(responseData.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      setMsg("An error occurred, please try again.");
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    const response = await fetch(`/api/users?username=${username}`);
    const data = await response.json();
    setIsUsernameAvailable(data.available);
  };

  useEffect(() => {
    const username = watch("username");
    if (username) {
      checkUsernameAvailability(username);
    }
  }, [watch("username")]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const lowercaseUsername = event.target.value.toLowerCase();
    setValue("username", lowercaseUsername, { shouldValidate: true });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <form onSubmit={handleSubmit(handleSignUp)}>
                <div className="grid gap-2 mb-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Enter Full Name"
                    {...register("fullname")}
                  />
                  {errors.fullname?.message && (
                    <div className="text-red-500 text-xs">
                      {errors.fullname.message.toString()}
                    </div>
                  )}
                </div>
                <div className="grid gap-2 mb-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter Username"
                    {...register("username")}
                    onChange={handleUsernameChange}
                  />
                  {errors.username && (
                    <div className="text-red-500 text-xs">
                      {errors.username.message.toString()}
                    </div>
                  )}
                  {!isUsernameAvailable && (
                    <div className="text-red-500 text-xs">
                      Username is already taken
                    </div>
                  )}
                </div>
                <div className="grid gap-2 mb-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <div className="text-red-500 text-xs">
                      {errors.email.message.toString()}
                    </div>
                  )}
                </div>
                <div className="grid gap-2 mb-2 relative items-center ">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-7 text-sm text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                  </button>
                  {errors.password && (
                    <div className="text-red-500 text-xs">
                      {errors.password.message.toString()}
                    </div>
                  )}
                </div>
                <div className="grid gap-2 mb-2 relative">
                  <Label htmlFor="confirmpassword">Confirm Password</Label>
                  <Input
                    id="confirmpassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...register("confirmpassword")}
                  />
                 
                  {errors.confirmpassword && (
                    <div className="text-red-500 text-xs">
                      {errors.confirmpassword.message.toString()}
                    </div>
                  )}
                  {watchPassword &&
                    watchConfirmPassword &&
                    watchPassword !== watchConfirmPassword && (
                      <div className="text-red-500 text-xs">
                        Passwords do not match
                      </div>
                    )}
                </div>
                {msg && <div className="text-red-500 text-xs">{msg}</div>}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isUsernameAvailable}
                >
                  Create an account
                </Button>
              </form>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  signIn("google", { callbackUrl: "/questionset" })
                }
              >
                Sign up with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="underline hover:text-yellow-500"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpForm;
