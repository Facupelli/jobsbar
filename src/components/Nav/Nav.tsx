import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

import s from "./Nav.module.scss";

type Props = {
  route?: string;
};

export default function Nav({ route }: Props) {
  const { data: session } = useSession();

  console.log(session);

  return (
    <nav className="bg-gray-800 px-10 text-white">
      <ul className="flex h-[70px] items-center gap-8">
        {session && (
          <li className="cursor-pointer" onClick={async () => await signOut()}>
            SALIR
          </li>
        )}

        <li className="ml-auto cursor-pointer">
          <Link href="/">INICIO</Link>
        </li>

        <li className="cursor-pointer">
          <Link href="/ranking">RANKINGS</Link>
        </li>
        {/* 
        {session?.user.role === "ADMIN" && (
          <li>
            <Link href="/admin">ADMIN</Link>
          </li>
        )} */}

        {!session && (
          <li
            className="cursor-pointer"
            onClick={async () => await signIn("google")}
          >
            ENTRAR
          </li>
        )}
      </ul>
    </nav>
  );
}
