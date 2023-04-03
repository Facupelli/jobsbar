import Link from "next/link";

type AdminLayoutProps = {
  children: React.ReactNode;
  route?: string;
};

export default function AdminLayout({ children, route }: AdminLayoutProps) {
  return (
    <div className="flex gap-2">
      <AdminNav route={route} />
      <div className="ml-[220px] mt-[70px] w-full max-w-screen-2xl p-4">
        {children}
      </div>
    </div>
  );
}

type AdminNavProps = {
  route?: string;
};

function AdminNav({ route }: AdminNavProps) {
  return (
    <nav className="fixed top-[70px] h-[calc(100vh_-_70px)] w-[220px] bg-neutral-900 font-semibold text-gray-200 shadow-md">
      <ul className="grid gap-4 p-4">
        <li
          className={`p-2 ${
            route === "admin" ? "rounded bg-green-500  text-neutral-900" : null
          }`}
        >
          <Link href="/admin" className="">
            <div className="">
              {/* <ChartPie size={22} active={route === "admin"} /> */}
            </div>
            <p>Inicio</p>
          </Link>
        </li>

        <li
          className={`p-2 ${
            route === "membership"
              ? "rounded bg-green-500  text-neutral-900"
              : null
          }`}
        >
          <Link href="/admin/membership" className="">
            <div className="">
              {/* <CardIcon size={22} active={route === "memberships"} /> */}
            </div>
            <p>Membresías</p>
          </Link>
        </li>

        <li
          className={`p-2 ${
            route === "consumptions"
              ? "rounded bg-green-500  text-neutral-900"
              : null
          }`}
        >
          <Link href="/admin/consumption" className="">
            <div className="">
              {/* <BasketIcon size={22} active={route === "consumptions"} /> */}
            </div>
            <p>Consumiciones</p>
          </Link>
        </li>

        <li
          className={`p-2 ${
            route === "promotions"
              ? "rounded bg-green-500  text-neutral-900"
              : null
          }`}
        >
          <Link href="/admin/promotion" className="">
            <div className="">
              {/* <PercentageIcon size={22} active={route === "promotions"} /> */}
            </div>
            <p>Promociones</p>
          </Link>
        </li>

        <li
          className={`p-2 ${
            route === "users" ? "rounded bg-green-500  text-neutral-900" : null
          }`}
        >
          <Link href="/admin/users" className="">
            <div className="">
              {/* <UsersIcon size={22} active={route === "users"} /> */}
            </div>
            <p>Usuarios</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
