import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

type Props = {
  route?: string;
};

export default function Nav({ route }: Props) {
  const { data: session } = useSession();

  return (
    <nav
      className={`bg-neutral-900 px-10 font-medium text-white shadow-md ${
        route === "admin" ? "fixed h-[70px] w-full " : "relative"
      }`}
    >
      <ul className="flex h-[70px] items-center justify-end gap-8">
        {session && (
          <li className="cursor-pointer" onClick={() => void signOut()}>
            SALIR
          </li>
        )}

        <li className=" cursor-pointer">
          <Link href="/">INICIO</Link>
        </li>

        <li className="cursor-pointer">
          <Link href="/ranking">RANKINGS</Link>
        </li>

        {session?.user.role === "Admin" && (
          <li>
            <Link href="/admin">ADMIN</Link>
          </li>
        )}

        {!session && (
          <li className="cursor-pointer" onClick={() => void signIn("google")}>
            ENTRAR
          </li>
        )}
      </ul>
    </nav>
  );
}
