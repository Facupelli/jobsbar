import axios from "axios";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjason from "superjson";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "~/components/Modal";
import Nav from "~/components/Nav";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import type { Promotion, User } from "~/types/model";
import { Membership } from "~/types/model";
import { ConsumptionOnUser } from "~/types/model";
import {
  ConsumptionsGrouped,
  UserConsumptionsGrouped,
} from "~/types/consumptionsByCategory";
import Table from "~/components/Table";

// import { useUserIdHotkeys } from "../../src/hooks/useUserIdHotkeys";

const trLastConsumptionsTitles = ["consumición", "ganó?", "cantidad", "fecha"];

type Props = {
  id: string;
};

type ConsumptionActive = "Bebida" | "Comida" | "Juego" | "Promociones";

const UserDetail: NextPage<Props> = ({ id }) => {
  const user = api.user.getUser.useQuery({
    id,
  });
  const consumptions = api.consumptions.getConsumptionsGrouped.useQuery();
  const userConsumptionsGrouped = api.user.getUserConsumptionsGrouped.useQuery({
    id,
  });

  const [error, setError] = useState<string>("");
  const [consumptionActive, setConsumptionActive] =
    useState<ConsumptionActive>("Bebida");

  if (!user.data || !consumptions.data || !userConsumptionsGrouped.data)
    return <div>404</div>;

  const selectedConsumption = consumptions.data.find(
    (consumption) => consumption.name === consumptionActive
  );

  const validPromotions = user.data.membership?.promotions;

  return (
    <div className="">
      <Head>
        <title>JOBS | {user.data.name}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {error && (
        <Modal
          isOpen={error ? true : false}
          handleCloseModal={() => setError("")}
          error
        >
          <div className="">
            <p>ERROR</p>
            <p>
              {error === "insufficient points" ? "Puntos insuficientes." : ""}
            </p>
          </div>
        </Modal>
      )}

      <Nav />

      <main className="min-h-screen bg-neutral-200 px-10">
        <div className="mx-auto grid max-w-screen-xl gap-20">
          <section className="grid grid-cols-12 gap-10 pt-10">
            <section className="col-span-8 grid grid-cols-2 gap-2">
              <ConsumptionButtons
                consumptions={consumptions.data}
                consumptionActive={consumptionActive}
                setConsumptionActive={setConsumptionActive}
              />
            </section>
            <section className="col-span-4">
              <MembershipCard user={user.data} />
            </section>
          </section>

          {consumptionActive !== "Promociones" && selectedConsumption && (
            <section className="rounded-sm bg-white p-4">
              <ConsumptionsList
                selectedConsumption={selectedConsumption}
                userId={id}
              />
            </section>
          )}

          {consumptionActive === "Promociones" && (
            <section className="rounded-sm bg-white p-4">
              <PromotionsList validPromotions={validPromotions} userId={id} />
            </section>
          )}

          <section>
            <LastConsumptions userConsumptions={user.data.consumptions} />
          </section>

          <section>
            <TotalConsumptions
              userConsumptionsGrouped={userConsumptionsGrouped.data}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

function ConsumptionButtons({
  consumptions,
  consumptionActive,
  setConsumptionActive,
}: {
  consumptions: ConsumptionsGrouped[];
  consumptionActive: ConsumptionActive;
  setConsumptionActive: Dispatch<SetStateAction<ConsumptionActive>>;
}) {
  return (
    <>
      {consumptions.map((category, i) => (
        <button
          key={category.id}
          className={`${
            consumptionActive === category.name
              ? "text-netrual-900 bg-green-500"
              : "bg-neutral-900 text-neutral-100"
          } col-span-1 flex items-center justify-center rounded-sm  font-semibold `}
          onClick={() =>
            setConsumptionActive(category.name as ConsumptionActive)
          }
        >
          <p>
            {i + 1}. {category.name}s
          </p>
        </button>
      ))}
      <button
        className={`${
          consumptionActive === "Promociones"
            ? "text-netrual-900 bg-green-500"
            : "bg-neutral-900 text-neutral-100"
        } col-span-1 flex items-center justify-center rounded-sm  font-semibold `}
        onClick={() => setConsumptionActive("Promociones")}
      >
        <p>4. Promociones</p>
      </button>
    </>
  );
}

function MembershipCard({
  user,
}: {
  user: User & {
    membership: Membership | null;
    consumptions: ConsumptionOnUser[];
  };
}) {
  return (
    <div className="grid gap-2 rounded bg-white p-4 shadow-xl">
      <div className="flex flex-col items-end">
        <p>
          <strong>{user.membership?.name}</strong>
        </p>
        <p className="text-sm">
          {user.membership?.minPoints}pts - {user.membership?.maxPoints}
          pts
        </p>
      </div>
      <div>
        <p>{user.name}</p>
        <p>
          Acumulados: <strong>{user.totalPoints}</strong>
        </p>
        <p>
          Gastados: <strong>{user.totalPointsSpent}</strong>
        </p>
      </div>
    </div>
  );
}

function ConsumptionsList({
  selectedConsumption,
  userId,
}: {
  selectedConsumption: ConsumptionsGrouped;
  userId: string;
}) {
  const ctx = api.useContext();
  const { mutate, isLoading } = api.user.postConsumptionOnUser.useMutation();

  const handlePostConsumption = (
    userId: string,
    consumptionId: string,
    points: number
  ) => {
    mutate(
      { userId, consumptionId, points, quantity: 1 },
      {
        onSuccess: () => {
          ctx.user.getUserConsumptionsGrouped.invalidate();
          ctx.user.getUser.invalidate();
        },
      }
    );
  };

  return (
    <div className="flex gap-4">
      {selectedConsumption.consumptions.map((consumption) => (
        <div
          key={consumption.name}
          className="flex items-center gap-10 rounded bg-neutral-300 p-2"
        >
          <div>
            <p className="text-sm">
              <strong className="font-semibold">{consumption.name}</strong>
            </p>
            <p className="text-sm">{consumption.points} pts</p>
          </div>
          <button
            onClick={() =>
              handlePostConsumption(userId, consumption.id, consumption.points)
            }
            type="button"
            className="ml-auto rounded-xl bg-neutral-900 p-1 text-sm text-neutral-100"
          >
            Cargar
          </button>
        </div>
      ))}
    </div>
  );
}

function PromotionsList({
  validPromotions,
  userId,
}: {
  validPromotions: Promotion[] | undefined;
  userId: string;
}) {
  const ctx = api.useContext();
  const { mutate } = api.promotions.postPromotionOnUser.useMutation();

  const handlePostPromotion = (
    userId: string,
    promotionId: string,
    points: number
  ) => {
    mutate(
      { userId, promotionId, points, quantity: 1 },
      {
        onSuccess: () => {
          ctx.user.getUser.invalidate();
        },
      }
    );
  };

  if (!validPromotions || validPromotions.length === 0)
    return <div>Actualemte no hay promociones para tu membresía.</div>;

  return (
    <div className="flex gap-4">
      {validPromotions?.map((promo) => (
        <div
          key={promo.id}
          className="flex items-center gap-10 rounded bg-neutral-300 p-2 text-sm"
        >
          <div className="">
            <p>
              <strong className="font-semibold">{promo.name}</strong>
            </p>
            <p>Descuento: {promo.discount}%</p>
            <p className="text-base">-{promo.points} pts</p>
          </div>
          <button
            type="button"
            onClick={() => handlePostPromotion(userId, promo.id, promo.points)}
            className="ml-auto rounded-xl bg-neutral-900 p-1 text-sm text-neutral-100"
          >
            Cargar
          </button>
        </div>
      ))}
    </div>
  );
}

function LastConsumptions({
  userConsumptions,
}: {
  userConsumptions: ConsumptionOnUser[];
}) {
  return (
    <details className="rounded-sm bg-white p-4">
      <summary className="cursor-pointer pb-4">Últimas consumiciones:</summary>
      <Table trTitles={["consumición", "ganó?", "cantidad", "fecha"]}>
        {userConsumptions
          .slice(0, 10)
          .reverse()
          .map((consumption) => (
            <tr key={consumption.id}>
              <td className="border-b border-gray-300 p-3">
                {consumption.consumption?.name}
              </td>
              <td className="border-b border-gray-300 p-3">
                {consumption.consumption?.name}
              </td>
              <td className="border-b border-gray-300 p-3">
                {consumption.quantity}
              </td>
              <td className="border-b border-gray-300 p-3">
                {new Date(consumption.createdAt).toLocaleDateString("es-AR", {
                  year: "numeric",
                  day: "numeric",
                  month: "short",
                })}
                {" - "}
                {new Date(consumption.createdAt).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
      </Table>
    </details>
  );
}

function TotalConsumptions({
  userConsumptionsGrouped,
}: {
  userConsumptionsGrouped: UserConsumptionsGrouped[];
}) {
  return (
    <details className="rounded-sm bg-white p-4">
      <summary className="cursor-pointer pb-4">Consumiciones totals:</summary>
      <div className="grid grid-cols-3 gap-4">
        {userConsumptionsGrouped.map((category) => (
          <div key={category.id} className="col-span-1">
            <p className="pb-2 pl-1 text-sm font-light">{category.name}</p>
            <Table key={category.id} trTitles={["Nombre", "Cantidad"]}>
              {category.consumptions.map((consumption) => (
                <tr key={consumption.name}>
                  <td className="border-b border-gray-300 p-3">
                    {consumption.name}
                  </td>
                  <td className="border-b border-gray-300 p-3">
                    {consumption.users.length}
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        ))}
      </div>
    </details>
  );
}

export default UserDetail;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjason,
  });

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no slug");

  await ssg.user.getUser.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};