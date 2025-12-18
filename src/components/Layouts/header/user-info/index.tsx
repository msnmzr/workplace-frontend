"use client";

import Cookies from "js-cookie";
import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

function parseJwt(token: string | undefined | null) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1];
    const b64fixed = b64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64fixed.length % 4;
    const padded = pad ? b64fixed + "=".repeat(4 - pad) : b64fixed;
    const decoded = atob(padded);
    const json = decodeURIComponent(
      decoded
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState({
    name: "John Smith",
    email: "johnson@nextadmin.com",
    img: "/images/user/user-03.png",
  });

  useEffect(() => {
    // Try cookie names used across the app
    const token = Cookies.get("auth_token") || Cookies.get("token");
    const payload = parseJwt(token);

    if (payload) {
      const name =
        payload.name ||
        payload.fullName ||
        payload.username ||
        payload.user?.name ||
        payload.user?.fullName ||
        (payload.email ? payload.email.split?.("@")?.[0] : undefined);

      const email = payload.email || payload.user?.email;
      const img =
        payload.avatar ||
        payload.picture ||
        payload.profile_picture ||
        payload.user?.avatar;

      setUser((prev) => ({
        name: name ?? prev.name,
        email: email ?? prev.email,
        img: img ?? prev.img,
      }));
      return;
    }

    // Fallback: read persisted user info from localStorage (saved by login)
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser((prev) => ({
          name: parsed.name ?? prev.name,
          email: parsed.email ?? prev.email,
          img: parsed.img ?? prev.img,
        }));
        return;
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleLogout = () => {
    // Remove cookie created by login flow (path '/')
    Cookies.remove("auth_token", { path: "/" });
    Cookies.remove("token", { path: "/" });
    setIsOpen(false);
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            src={user.img}
            className="size-12"
            alt={`Avatar of ${user.name}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{user.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">user information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={user.img}
            className="size-12"
            alt={`Avatar for ${user.name}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {user.name}
            </div>

            <div className="leading-none text-gray-6">{user.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
