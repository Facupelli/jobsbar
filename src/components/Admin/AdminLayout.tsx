import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { Routes } from "~/pages/admin";

type AdminLayoutProps = {
  children: React.ReactNode;
  route?: string;
  setRoute: Dispatch<SetStateAction<Routes>>;
};

export default function AdminLayout({
  children,
  route,
  setRoute,
}: AdminLayoutProps) {
  return (
    <div className="flex gap-2">
      <AdminNav route={route} setRoute={setRoute} />
      <div className="ml-[220px] mt-[70px] w-full max-w-screen-2xl p-4">
        {children}
      </div>
    </div>
  );
}

type AdminNavProps = {
  route?: string;
  setRoute: Dispatch<SetStateAction<Routes>>;
};

function AdminNav({ route, setRoute }: AdminNavProps) {
  return (
    <nav className="fixed top-[70px] h-[calc(100vh_-_70px)] w-[220px] bg-neutral-900 font-semibold text-gray-200 shadow-md">
      <ul className="grid gap-4 p-4">
        <li
          className={`p-2 ${
            route === "admin" ? "rounded bg-green-500  text-neutral-900" : null
          }`}
        >
          <button onClick={() => setRoute("home")} className="">
            <div className="">
              {/* <ChartPie size={22} active={route === "admin"} /> */}
            </div>
            <p>Inicio</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "memberships"
              ? "rounded bg-green-500  text-neutral-900"
              : null
          }`}
        >
          <button onClick={() => setRoute("memberships")} className="">
            <div className="">
              {/* <CardIcon size={22} active={route === "memberships"} /> */}
            </div>
            <p>Membresías</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "consumptions"
              ? "rounded bg-green-500  text-neutral-900"
              : null
          }`}
        >
          <button onClick={() => setRoute("consumptions")} className="">
            <div className="">
              {/* <BasketIcon size={22} active={route === "consumptions"} /> */}
            </div>
            <p>Consumiciones</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "promotions"
              ? "rounded bg-green-500  text-neutral-900"
              : null
          }`}
        >
          <button onClick={() => setRoute("promotions")} className="">
            <div className="">
              {/* <PercentageIcon size={22} active={route === "promotions"} /> */}
            </div>
            <p>Promociones</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "users" ? "rounded bg-green-500  text-neutral-900" : null
          }`}
        >
          <button onClick={() => setRoute("users")} className="">
            <div className="">
              {/* <UsersIcon size={22} active={route === "users"} /> */}
            </div>
            <p>Usuarios</p>
          </button>
        </li>
      </ul>
    </nav>
  );
}
