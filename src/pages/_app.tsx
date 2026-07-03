import Head from "next/head";
import type { AppProps } from "next/app";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { Toaster } from "@/components/ui/toaster";

import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Christian Erben - Network Security & Linux Infrastructure Specialist</title>
        <meta
          name="description"
          content="Christian Erben - Network Security & Linux Infrastructure Specialist portfolio."
        />
      </Head>
      <SettingsProvider>
        <Toaster />
        <Component {...pageProps} />
      </SettingsProvider>
    </>
  );
}
