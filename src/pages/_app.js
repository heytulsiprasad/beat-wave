import "@/styles/globals.css";
import "@/styles/audio.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Beat Wave</title>
      </Head>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}
