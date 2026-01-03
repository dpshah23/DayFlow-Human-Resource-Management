import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

import { AuthBackLink } from "./auth-back-link";
import { AuthWrapper } from "./auth-wrapper";
import { SignInForm } from "./sign-in-form";

export const SignInContent = () => {
  // const searchParams = useSearchParams();
  // const redirectTo = searchParams.get("redirectTo");

  return (
    <AuthWrapper
      footerContent={
        <div className="flex flex-col items-center gap-2 text-center">
          {/* Forgot password link */}
          <AuthBackLink
            href="/forgot-password"
            linkText="Reset it"
            text="Forgot your password?"
          />

          {/* Sign up link */}
          <AuthBackLink
            href={
              // redirectTo
              // ? `/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`
              "/sign-up"
            }
            linkText="Sign up"
            text="Don't have an account?"
          />
        </div>
      }
      subtitle="Welcome back!"
      title="Sign In"
    >
      <SignInForm
      // redirectTo={redirectTo ? decodeURIComponent(redirectTo) : undefined}
      />
    </AuthWrapper>
  );
};
export const SignInSkeleton = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-4 shadow-md rounded-2xl">
        <CardHeader className="space-y-2">
          <Skeleton className="w-32 h-8 rounded-lg" /> {/* Title */}
          <Skeleton className="w-48 h-4 rounded-md" /> {/* Subtitle */}
        </CardHeader>

        <CardBody className="space-y-3">
          <Skeleton className="w-full h-10 rounded-md" /> {/* Email field */}
          <Skeleton className="w-full h-10 rounded-md" /> {/* Password field */}
          <Skeleton className="w-24 h-5 rounded-md" />{" "}
          {/* Remember me / label */}
        </CardBody>

        <CardFooter className="flex flex-col items-center space-y-3">
          <Skeleton className="w-full h-10 rounded-md" /> {/* Submit button */}
          <div className="flex items-center space-x-2">
            <Skeleton className="w-24 h-4 rounded-md" /> {/* Text */}
            <Skeleton className="w-16 h-4 rounded-md" /> {/* Link */}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
