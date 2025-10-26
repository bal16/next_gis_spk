// components/QueryParamNotifier.tsx
"use client";

import { useLayoutEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export function QueryParamNotifier() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    const message = searchParams.get("message");

    if (!message) {
      return;
    }
    switch (message) {
      case "logout-success":
        toast.success("Logout berhasil!");
        break;
      case "registration-success":
        toast.success("Registrasi berhasil!");
        break;
      case "login-success":
        toast.success("Login berhasil!");
        break;
    }

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("message");

    router.replace(`${pathname}?${newParams.toString()}`);
  }, [searchParams, router, pathname]);

  return null;
}
