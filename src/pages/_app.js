import "@/styles/globals.css";
import "@/styles/audio.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Beat Wave</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
