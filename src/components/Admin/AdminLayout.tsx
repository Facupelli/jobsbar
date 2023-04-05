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
      <div className="ml-[220px] mt-[70px] w-full max-w-screen-2xl p-6">
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
            route === "home" ? "rounded bg-green-500  text-neutral-900" : ""
          }`}
        >
          <button
            onClick={() => setRoute("home")}
            className="flex items-center gap-4"
          >
            <div className="">
              <StatsUpIcon
                size={22}
                fill={route === "home" ? "#171717" : "#f5f5f5"}
              />
            </div>
            <p>Inicio</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "memberships"
              ? "rounded bg-green-500  text-neutral-900"
              : ""
          }`}
        >
          <button
            onClick={() => setRoute("memberships")}
            className="flex items-center gap-4"
          >
            <div className="">
              <CardIcon
                size={22}
                fill={route === "memberships" ? "#171717" : "#f5f5f5"}
              />
            </div>
            <p>Membresías</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "consumptions"
              ? "rounded bg-green-500  text-neutral-900"
              : ""
          }`}
        >
          <button
            onClick={() => setRoute("consumptions")}
            className="flex items-center gap-4"
          >
            <div className="">
              <BagIcon
                size={22}
                fill={route === "consumptions" ? "#171717" : "#f5f5f5"}
              />
            </div>
            <p>Consumiciones</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "promotions"
              ? "rounded bg-green-500  text-neutral-900"
              : ""
          }`}
        >
          <button
            onClick={() => setRoute("promotions")}
            className="flex items-center gap-4"
          >
            <div className="">
              <PercentageIcon
                size={22}
                fill={route === "promotions" ? "#171717" : "#f5f5f5"}
              />
            </div>
            <p>Promociones</p>
          </button>
        </li>

        <li
          className={`p-2 ${
            route === "users" ? "rounded bg-green-500 text-neutral-900" : ""
          }`}
        >
          <button
            onClick={() => setRoute("users")}
            className="flex items-center gap-4"
          >
            <div className="">
              <UsersIcon
                size={22}
                fill={route === "users" ? "#171717" : "#f5f5f5"}
              />
            </div>
            <p>Usuarios</p>
          </button>
        </li>
      </ul>
    </nav>
  );
}
