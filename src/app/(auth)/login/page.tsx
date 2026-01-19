"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import InputGroup from "@/components/FormElements/InputGroup";
import { Checkbox } from "@/components/FormElements/checkbox";
// import Signin from "@/components/Auth/Signin";
import Image from "next/image";
import Link from "next/link";
import { EmailIcon, PasswordIcon } from "@/assets/icons";

// NOTE: This MUST match the cookie name in your proxy.ts file!
// --- safe endpoint: use NEXT_PUBLIC_API_URL if defined, otherwise fall back to relative /api/login
const AUTH_TOKEN_COOKIE_NAME = "auth_token";
const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "";
const LARAVEL_LOGIN_ENDPOINT = API_BASE ? `${API_BASE}/login` : "/login";

// --- Component ---
const LoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    username: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    // Check if the auth cookie exists and redirect immediately
    if (Cookies.get(AUTH_TOKEN_COOKIE_NAME)) {
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    }
  }, []);

  // --- Utility function to set the authentication cookie ---
  const setAuthCookie = (token: string) => {
    if (typeof window !== "undefined") {
      // Set cookie for 7 days, available to the whole domain (path: '/')
      Cookies.set(AUTH_TOKEN_COOKIE_NAME, token, { expires: 7, path: "/" });
      console.log(
        `[Cookie Set] Auth token set successfully: ${token.substring(0, 10)}...`,
      );
    }
  };

  /**
   * Submits AD credentials to the Laravel API endpoint.
   * Handles successful response by setting the auth cookie and redirecting to the dashboard.
   * Handles error responses by displaying a message to the user.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call the Laravel API using the values from `data`
      const response = await fetch(LARAVEL_LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      // Handle non-successful API responses
      if (!response.ok) {
        let message = `Login failed. Please try again after sometime.)`;

        try {
          const errorData = await response.json();
          // If backend returns a structured message, use it
          if (errorData) {
            message = errorData.message || errorData.error || message;
          }
        } catch (_) { }

        if (response.status === 401 || response.status === 403) {
          setError("Invalid Username/Password.");
        } else {
          setError(message);
        }
        setLoading(false);
        return;
      }

      // Process successful response
      const respData = await response.json();

      if (!respData.token) {
        setError(
          "Login successful, but no authentication token received from the server.",
        );
        setLoading(false);
        return;
      }

      // Store the token in the browser cookie and redirect to dashboard
      setAuthCookie(respData.token);

      // ===== NEW: Save user object to localStorage (if present) =====
      // Try several common shapes returned by APIs
      // e.g. { token, user }, or { token, data: { user } }, or { token, userData }
      const user =
        respData.user ||
        (respData.data && respData.data.user) ||
        respData.userData ||
        respData.data ||
        null;

      try {
        if (user) {
          const safeUser = {
            ...user,
            name:
              user.emp_name ||
              user.name ||
              user.emp_code ||
              user.emp_email?.split?.("@")?.[0] ||
              null,
            email: user.emp_email || user.email || (user.user && user.user.emp_email) || null,
            img: user.emp_image || user.image || user.profile_picture || null,
            permissions: user.permissions || [],
            roles: user.roles || [],
          };
          localStorage.setItem("auth_user", JSON.stringify(safeUser));
        } else {
          // clear any stale stored user
          localStorage.removeItem("auth_user");
        }
      } catch (err) {
        // ignore localStorage errors (private modes)
        console.warn("Could not persist user to localStorage", err);
      }
      // ============================================================

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Network or API call error:", err);
      setError(
        "A network error occurred. Could not connect to the authentication server.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center">
      <div className="w-full xl:w-1/2">
        <div className="w-full p-4 sm:p-12.5 xl:p-15">
          <form onSubmit={handleLogin}>
            <InputGroup
              type="text"
              label="User Name"
              className="mb-4 [&_input]:py-[15px]"
              placeholder="Enter your username"
              name="username"
              handleChange={handleChange}
              value={data.username}
              icon={<EmailIcon />}
            />

            <InputGroup
              type="password"
              label="Password"
              className="mb-5 [&_input]:py-[15px]"
              placeholder="Enter your password"
              name="password"
              handleChange={handleChange}
              value={data.password}
              icon={<PasswordIcon />}
            />

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
              <Checkbox
                label="Remember me"
                name="remember"
                withIcon="check"
                minimal
                radius="md"
                onChange={(e) =>
                  setData({
                    ...data,
                    remember: e.target.checked,
                  })
                }
              />

              <Link
                href="/auth/forgot-password"
                className="hover:text-primary dark:text-primary dark:hover:text-primary"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="mb-4.5">
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
              >
                Sign In
                {loading && (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden w-full xl:block xl:w-1/2">
        <div className="custom-gradient-1 overflow-hidden px-12.5 pt-12.5">
          <Link className="mb-10 inline-block" href="/">
            <Image
              className="hidden dark:block"
              src={"/images/logo/logo.svg"}
              alt="Logo"
              width={176}
              height={32}
            />
            <Image
              className="dark:hidden"
              src={"/images/logo/LCS-Main-Logo-300x128.png"}
              alt="Logo"
              width={176}
              height={32}
            />
          </Link>
          <p className="mb-3 text-xl font-medium text-dark dark:text-primary">
            Sign in to your account
          </p>

          <h1 className="mb-4 text-2xl font-bold text-dark dark:text-primary sm:text-heading-3">
            Welcome Back!
          </h1>

          <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
            Please sign in to your account by completing the necessary fields
            below
          </p>

          <div className="mt-31">
            <Image
              src={"/images/grids/grid-02.svg"}
              alt="Logo"
              width={405}
              height={325}
              className="mx-auto dark:opacity-30"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
