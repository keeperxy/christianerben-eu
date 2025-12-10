import { useState } from "react";
import App from "next/app";
import type { AppContext, AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/SettingsContext";
import type { Language } from "@/contexts/settings-hook";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import "@/styles/globals.css";

type AppWithLanguageProps = AppProps & { initialLanguage?: Language };

export default function MyApp({ Component, pageProps, initialLanguage }: AppWithLanguageProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsProvider initialLanguage={initialLanguage}>
          <Toaster />
          <Sonner />
          <Component {...pageProps} />
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const req = appContext.ctx.req;
  let initialLanguage: Language = "en";

  if (req) {
    const cookieHeader = req.headers.cookie ?? "";
    const languageCookie = cookieHeader
      .split(";")
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith("language="));

    if (languageCookie) {
      const value = languageCookie.split("=")[1]?.toLowerCase();
      if (value === "de" || value === "en") {
        initialLanguage = value as Language;
      }
    } else {
      const acceptLanguage = req.headers["accept-language"];
      const preferred = acceptLanguage?.split(",")[0]?.trim().toLowerCase();
      if (preferred && preferred.startsWith("de")) {
        initialLanguage = "de";
      }
    }
  }

  return { ...appProps, initialLanguage };
};

