import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../utilities/api";
import { setAuthToken } from "../utilities/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function Login({ isAuth, setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.post("/user/login", { email, password });
      setAuthToken(response.data.token);
      setIsAuth(true);

      // Get the path the user was trying to access, or default to dashboard
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      setLoginError("Something went wrong logging you in.");
      setIsLoading(false);
      console.log(error);
      console.error("Login error:", error.response?.data?.error);
    }
  };
  useEffect(() => {
    console.log("isAuth", isAuth);
    if (isAuth) {
      console.log("isAuth", isAuth);
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="bg-zinc-900 text-zinc-100">
      {isLoading ? (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-zinc-50 text-2xl font-extrabold">
            Logging in!
          </div>
        </div>
      ) : null}
      <div className="flex h-screen w-full items-center justify-center px-4">
        <form onSubmit={handleLogin}>
          <div className="text-center text-red-400">{loginError}</div>
          <Card className="mx-auto max-w-lg w-[300px] bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Login</CardTitle>
              <CardDescription className="text-zinc-400">
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-zinc-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-zinc-200">
                      Password
                    </Label>
                    <Link
                      tabIndex="-1"
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm text-zinc-400 hover:text-zinc-300 underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-zinc-900 border-zinc-700 text-zinc-100"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="pt-0.5 absolute right-2.5 top-[40%] -translate-y-1/2 cursor-pointer text-zinc-400 hover:text-zinc-300 bg-transparent border-0 p-0 flex items-center justify-center w-[30px] h-full"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/80 text-zinc-100"
                >
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-zinc-300 hover:text-zinc-100 underline"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default Login;
