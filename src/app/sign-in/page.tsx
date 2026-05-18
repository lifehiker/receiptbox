import { Suspense } from "react";
import Link from "next/link";
import { SignInForm } from "./sign-in-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Sign in | ReceiptBox",
  description: "Sign in to your ReceiptBox account.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to ReceiptBox</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <SignInForm />
          </Suspense>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
