import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/Navigations/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const isAssessmentPath = router.asPath.startsWith("/assessment/");
    setShowHeader(!isAssessmentPath);
  }, [router.asPath]);

  return (
    <div className="px-3">
      {showHeader && <Header />}
      <Component {...pageProps} />
    </div>
  );
}
