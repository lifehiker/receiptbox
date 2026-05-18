import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AuthSessionProvider } from "@/components/layout/session-provider";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <AuthSessionProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader email={session.user.email} />
          <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
        </div>
      </div>
    </AuthSessionProvider>
  );
}
