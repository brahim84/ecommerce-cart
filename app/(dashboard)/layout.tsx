import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log("Session in layout:", session);

  if (!session) {
    redirect("/");
  }

  const email = session?.user?.email;
  const token = session?.token;

  const res = await fetch(`${API_URL}/api/users/email/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  if (data.role === "user") {
    redirect("/");
  }

  return <>{children}</>;
}
