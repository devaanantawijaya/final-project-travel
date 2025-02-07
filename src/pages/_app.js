import { UserProvider } from "@/context/userContext";
import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <link rel="icon" type="image/png" href="/images/logo-travely.png" />
        <title>Travely</title>
      </Head>
      <Component {...pageProps} />
    </UserProvider>
  );
}
