import { motion, AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <title>Rick and Morty Wiki</title>
        <link href="https://fonts.cdnfonts.com/css/get-schwifty" rel="stylesheet" />
      </Head>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            background: "#5e2ced",
            filter: "hue-rotate(180deg)"
          }}
          transition={{ duration: 0.5 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}