import Header from "@/components/Navigations/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="px-3">
      <Header />
      <Component {...pageProps} />
    </div>
  );
}
