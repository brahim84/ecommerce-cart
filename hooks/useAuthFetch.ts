import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useAuthFetch() {
  const { data: session, status } = useSession();

  return useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (status !== "authenticated" || !session?.token) {
        throw new Error("User not authenticated or token missing");
      }
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${session.token}`,
      };
      const res = await fetch(url, { ...options, headers });
      return res;
    },
    [session?.token, status]
  );
}