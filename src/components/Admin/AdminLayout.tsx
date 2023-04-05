import type { Dispatch, SetStateAction } from "react";
import BagIcon from "~/icons/BagIcon";
import CardIcon from "~/icons/CardIcon";
import PercentageIcon from "~/icons/PercentageIcon";
import StatsUpIcon from "~/icons/StatsUpIcon";
import UsersIcon from "~/icons/UsersIcon";
import { type Routes } from "~/pages/admin";

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
      <div className="mt-[140px] w-full max-w-screen-2xl sm:ml-[220px] sm:mt-[70px] sm:p-6">
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
    <nav className="fixed top-[70px] h-[55px] w-full bg-neutral-800 font-semibold text-gray-200 shadow-md sm:h-[calc(100vh_-_70px)] sm:w-[220px] sm:bg-neutral-900">
      <ul className="flex gap-4 overflow-x-auto px-6 py-2 text-sm sm:grid sm:p-4 sm:text-base">
        <li
          className={`p-2 ${
            route === "home"
              ? "rounded text-green-500 sm:bg-green-500  sm:text-neutral-900"
              : ""
          }`}
        >
          <button
            onClick={() => setRoute("home")}
            className="flex items-center gap-2 sm:gap-4"
          >
            <div className="">
              <StatsUpIcon size={22} active={route === "home"} />
            </div>
            <p>Inicio</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "memberships"
              ? "rounded text-green-500 sm:bg-green-500 sm:text-neutral-900"
              : ""
          }`}
        >
          <button
            onClick={() => setRoute("memberships")}
            className="flex items-center gap-2 sm:gap-4"
          >
            <div className="">
              <CardIcon size={22} active={route === "memberships"} />
            </div>
            <p>Membresías</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "consumptions"
              ? "rounded text-green-500 sm:bg-green-500 sm:text-neutral-900"
              : ""
          }`}
        >
          <button
            onClick={() => setRoute("consumptions")}
            className="flex items-center gap-2 sm:gap-4"
          >
            <div className="">
              <BagIcon size={22} active={route === "consumptions"} />
            </div>
            <p>Consumiciones</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "promotions"
              ? "rounded text-green-500 sm:bg-green-500 sm:text-neutral-900"
              : ""
          }`}
        >
          <button
            onClick={() => setRoute("promotions")}
            className="flex items-center gap-2 sm:gap-4"
          >
            <div className="">
              <PercentageIcon size={22} active={route === "promotions"} />
            </div>
            <p>Promociones</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "users"
              ? "rounded text-green-500 sm:bg-green-500 sm:text-neutral-900"
              : ""
          }`}
        >
          <button
            onClick={() => setRoute("users")}
            className="flex items-center gap-2 sm:gap-4"
          >
            <div className="">
              <UsersIcon size={22} active={route === "users"} />
            </div>
            <p>Usuarios</p>
          </button>
        </li>
      </ul>
    </nav>
  );
}
