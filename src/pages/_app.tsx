import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/Navigations/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NotificationProvider } from "@/components/context/NotificationContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const isAssessmentPath = router.asPath.startsWith("/assessment/");
    setShowHeader(!isAssessmentPath);
  }, [router.asPath]);

  return (
    <div>
        {showHeader && <Header />}
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
    </div>
  );
}
