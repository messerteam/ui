import { ArrowLeft } from "lucide-react";
import { type AppType } from "next/app";
import { Lexend } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "~/components/theme";
import Toaster from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import "~/styles/globals.css";

const lexend = Lexend({
  subsets: ["latin"],
});

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  const router = useRouter();
  const queryClient = new QueryClient()

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster visibleToasts={2.5} duration={2500} />
          <div className="absolute flex gap-2 w-fit p-4 z-50">
            {router.pathname !== "/" ? (
              <div className="bg-secondary p-2 rounded-full">
                <Link href="/">
                  <ArrowLeft />
                </Link>
              </div>
            ) : null}
          </div>
          <main className={`absolute top-0 left-0 h-full w-full flex flex-col overflow-y-auto ${lexend.className}`}>
            <Component {...pageProps} />
          </main>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default MyApp;
