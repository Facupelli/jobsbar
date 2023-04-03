import Head from "next/head";
import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useState } from "react";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

import AdminLayout from "~/components/Admin/AdminLayout";
import Nav from "~/components/Nav";
import Table from "~/components/Table";

import type { Consumption, Membership, Promotion, User } from "~/types/model";
import Link from "next/link";
import {
  fetchAllConsumptionsByCategories,
  fetchAllPromotions,
} from "~/utils/admin";

type Props = {
  allConsumptionsByCategories: {
    consumptions: { name: string; points: number }[];
    id: string;
    name: string;
  }[];
  allMemberships: Membership[];
  allPromotions: Promotion[];
  allConsumptions: Consumption[];
  allUsers: User[];
  usersCount: number;
};

export type Routes =
  | "home"
  | "memberships"
  | "consumptions"
  | "promotions"
  | "users";

export default function Admin({
  allMemberships,
  allConsumptionsByCategories,
  allPromotions,
  allConsumptions,
  allUsers,
  usersCount,
}: Props) {
  const [route, setRoute] = useState<Routes>("home");

  const [consumptionsByCategories, setConsumptionsByCategory] = useState(
    allConsumptionsByCategories
  );
  const [memberships, setMemberships] = useState(allMemberships);

  //PROMOTIONS
  const [consumptions, setConsumptions] = useState(allConsumptions);
  const [promotions, setPromotions] = useState(allPromotions);

  //USERS
  const [users, setUsers] = useState(allUsers);
  const [totalUsers, setTotalUsers] = useState(usersCount);

  // const [drinks, setDrinks] = useState<SortedConsumption[]>(drinksList);
  // const [games, setGames] = useState<SortedConsumption[]>(gamesList);
  // const [promotions, setPromotions] =
  //   useState<SortedPromotion[]>(promotionsList);
  // const [users, setUsers] = useState<User[]>(usersList);

  return (
    <div className="">
      <Head>
        <title>JOBS | Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav route="admin" />

      <main className="min-h-screen bg-gray-200">
        <AdminLayout route={route} setRoute={setRoute}>
          {route === "memberships" && <Memberships memberships={memberships} />}
          {route === "consumptions" && (
            <Consumptions consumptions={consumptionsByCategories} />
          )}
          {route === "promotions" && (
            <Promotions consumptions={consumptions} promotions={promotions} />
          )}
          {route === "users" && <Users users={users} totalUsers={totalUsers} />}
        </AdminLayout>
      </main>
    </div>
  );
}

function Memberships({ memberships }: { memberships: Membership[] }) {
  return (
    <section>
      <h1 className="p-3 text-lg font-semibold">Membresías</h1>
      <Table trTitles={["Nombre", "Puntos Mínimos", "Puntos Máximos"]}>
        {memberships.map((membership) => (
          <tr key={membership.id}>
            <td className="border-b border-gray-300 p-3">{membership.name}</td>
            <td className="border-b border-gray-300 p-3">
              {membership.minPoints}
            </td>
            <td className="border-b border-gray-300 p-3">
              {membership.maxPoints}
            </td>
            <td className="border-b border-gray-300 p-3">Editar</td>
            <td className="border-b border-gray-300 p-3">Eliminar</td>
          </tr>
        ))}
      </Table>
    </section>
  );
}

function Consumptions({
  consumptions,
}: {
  consumptions: {
    consumptions: { name: string; points: number }[];
    id: string;
    name: string;
  }[];
}) {
  return (
    <section className="grid gap-10">
      {consumptions.map((category) => (
        <div key={category.id}>
          <h1 className="p-3 text-lg font-semibold">{category.name}</h1>
          <Table key={category.id} trTitles={["Nombre", "Puntos"]}>
            {category.consumptions.map((consumption) => (
              <tr key={consumption.name}>
                <td className="border-b border-gray-300 p-3">
                  {consumption.name}
                </td>
                <td className="border-b border-gray-300 p-3">
                  {consumption.points}
                </td>
                <td className="border-b border-gray-300 p-3">Editar</td>
                <td className="border-b border-gray-300 p-3">Eliminar</td>
              </tr>
            ))}
          </Table>
        </div>
      ))}
    </section>
  );
}

function Promotions({
  consumptions,
  promotions,
}: {
  consumptions: Consumption[];
  promotions: Promotion[];
}) {
  return (
    <section>
      <h1 className="p-3 text-lg font-semibold">Promociones</h1>

      <Table
        trTitles={[
          "Nombre",
          "Membresía",
          "Bebidas",
          "Comidas",
          "Juegos",
          "Descuento",
          "Puntos",
        ]}
      >
        {promotions.map((promo) => (
          <tr key={promo.id}>
            <td className="border-b border-gray-300 p-3">{promo.name}</td>
            <td className="border-b border-gray-300 p-3">
              {promo.memberships
                ?.map((membership) => membership.name)
                .join(", ")}
            </td>
            <td className="border-b border-gray-300 p-3">
              {promo.consumptions
                ?.filter(
                  (consumption) =>
                    consumption.consumption.consumptionCategory.name ===
                    "Bebida"
                )
                .map((consumption) => consumption.consumption.name)
                .join(", ")}
            </td>
            <td className="border-b border-gray-300 p-3">
              {promo.consumptions
                ?.filter(
                  (consumption) =>
                    consumption.consumption?.consumptionCategory.name ===
                    "Comida"
                )
                .map((consumption) => consumption.consumption.name)
                .join(", ")}
            </td>
            <td className="border-b border-gray-300 p-3">
              {promo.consumptions
                ?.filter(
                  (consumption) =>
                    consumption.consumption?.consumptionCategory.name ===
                    "Juego"
                )
                .map((consumption) => consumption.consumption.name)
                .join(", ")}
            </td>
            <td className="border-b border-gray-300 p-3">{promo.discount}%</td>
            <td className="border-b border-gray-300 p-3">{promo.points}</td>
            <td className="border-b border-gray-300 p-3">Eliminar</td>
          </tr>
        ))}
      </Table>
    </section>
  );
}

function Users({ users, totalUsers }: { users: User[]; totalUsers: number }) {
  return (
    <section>
      <h1 className="p-3 text-lg font-semibold">Usuarios</h1>
      <Table trTitles={["", "Nombre", "ID"]}>
        {users.map((user, i) => (
          <tr key={user.id}>
            <td className="border-b border-gray-300 p-3">{i + 1}</td>
            <td className="border-b border-gray-300 p-3">
              <Link href={`/user/${user.id}`}>{user.name}</Link>
            </td>
            <td className="border-b border-gray-300 p-3">{user.id}</td>
          </tr>
        ))}
      </Table>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session?.user.role === "Admin") {
    let allMemberships,
      allConsumptionsByCategories,
      allPromotions,
      allConsumptions,
      allUsers,
      usersCount;

    try {
      allConsumptionsByCategories = await fetchAllConsumptionsByCategories();
    } catch (err) {
      console.error(err);
    }

    try {
      allMemberships = await prisma.membership.findMany({
        orderBy: { minPoints: "asc" },
      });
    } catch (err) {
      console.log(err);
    }

    try {
      allPromotions = await fetchAllPromotions();

      allConsumptions = await prisma.consumptionCategory.findMany({
        select: { consumptions: { select: { name: true } } },
      });
    } catch (err) {
      console.log(err);
    }

    try {
      allUsers = await prisma.user.findMany({
        skip: 0,
        take: 20,
      });

      usersCount = await prisma.user.count();
    } catch (err) {
      console.log(err);
    }

    return {
      props: {
        allMemberships,
        allConsumptionsByCategories,
        allPromotions,
        allConsumptions,
        allUsers,
        usersCount,
      },
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
