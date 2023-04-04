import axios from "axios";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

let didInit: boolean = false;

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const initializeSocket = async () => {
    await axios.post("http://localhost:3000/api/socket");
  };

  useEffect(() => {
    if (!didInit) {
      didInit = true;

      initializeSocket();
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
