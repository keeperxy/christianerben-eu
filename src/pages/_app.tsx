import { useState } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Head>
        <title>Christian Erben - Network Security & Linux Infrastructure Specialist</title>
        <meta
          name="description"
          content="Christian Erben - Network Security & Linux Infrastructure Specialist portfolio."
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SettingsProvider>
            <Toaster />
            <Sonner />
            <Component {...pageProps} />
          </SettingsProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}
