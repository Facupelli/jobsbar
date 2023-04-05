import { useForm } from "react-hook-form";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjason from "superjson";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

import Table from "~/components/Table";
import Modal from "~/components/Modal";
import Nav from "~/components/Nav";
import SearchInput from "~/components/SearchInput";

import { useUserIdHotkeys } from "~/hooks/useUserIdHotkeys";

import type { ConsumptionActive } from "~/types/admin";
import type {
  ConsumptionsGrouped,
  UserConsumptionsGrouped,
} from "~/types/consumptionsByCategory";
import type { Promotion, User } from "~/types/model";
import type { Membership } from "~/types/model";
import type { ConsumptionOnUser } from "~/types/model";
import axios from "axios";
import { usePagination } from "~/hooks/usePagination";
import Pagination from "~/components/Pagination";

type Props = {
  id: string;
};

const UserDetail: NextPage<Props> = ({ id }) => {
  const router = useRouter();

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

  useUserIdHotkeys(
    setConsumptionActive,
    userConsumptionsGrouped.data?.map((category) => ({
      name: category.name,
      id: category.id,
    }))
  );

  if (!user.data || !consumptions.data || !userConsumptionsGrouped.data)
    return <div>404</div>;

  const selectedConsumption = consumptions.data.find(
    (consumption) => consumption.name === consumptionActive
  );

  const validPromotions = user.data.membership?.promotions;

  return (
    <div>
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

      <main className="min-h-screen bg-neutral-200 px-10 pb-10">
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
              <PromotionsList
                validPromotions={validPromotions}
                userId={id}
                userTotalPoints={user.data.totalPoints}
              />
            </section>
          )}

          <section>
            <LastConsumptions
              userConsumptions={user.data.consumptions}
              userId={id}
              // setTake={setTakeLastConsumptions}
              // setSkip={setSkipLastConsumptions}
            />
          </section>

          <section>
            <TotalConsumptions
              userConsumptionsGrouped={userConsumptionsGrouped.data}
            />
          </section>

          <div className="flex justify-end">
            <button
              onClick={() => router.push("/")}
              className="rounded bg-neutral-900 p-2 px-10 font-semibold text-neutral-100"
            >
              LISTO
            </button>
          </div>
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
  const { register, watch } = useForm<{ name: string }>();
  const { mutate } = api.user.postConsumptionOnUser.useMutation();

  const searchInput = watch("name");
  let filteredConsumptions = selectedConsumption.consumptions;
  if (searchInput) {
    filteredConsumptions = selectedConsumption.consumptions.filter((c) =>
      c.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  }

  const handlePostConsumption = (
    userId: string,
    consumptionId: string,
    points: number
  ) => {
    mutate(
      { userId, consumptionId, points, quantity: 1 },
      {
        onSuccess: async () => {
          ctx.user.getUserConsumptionsGrouped.invalidate();
          ctx.user.getUser.invalidate();

          //post al scoket
          await axios.post(`http://localhost:3000/api/socket/postConsumption`, {
            consumptionType: name,
          });
        },
      }
    );
  };

  return (
    <div className="grid gap-6">
      <SearchInput register={register} />
      <div className="flex gap-4">
        {filteredConsumptions.map((consumption) => (
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
                handlePostConsumption(
                  userId,
                  consumption.id,
                  consumption.points
                )
              }
              type="button"
              className="ml-auto rounded-xl bg-neutral-900 p-1 text-sm text-neutral-100"
            >
              Cargar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromotionsList({
  validPromotions,
  userId,
  userTotalPoints,
}: {
  validPromotions: Promotion[] | undefined;
  userId: string;
  userTotalPoints: number;
}) {
  const ctx = api.useContext();
  const { register, watch } = useForm<{ name: string }>();
  const { mutate } = api.promotions.postPromotionOnUser.useMutation();

  if (!validPromotions) return <div>404</div>;

  const searchInput = watch("name");
  let filteredPromos = validPromotions;
  if (searchInput) {
    filteredPromos = validPromotions.filter((p) =>
      p.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  }

  const handlePostPromotion = (
    userId: string,
    promotionId: string,
    points: number
  ) => {
    mutate(
      { userId, promotionId, points, quantity: 1 },
      {
        onSuccess: async () => {
          ctx.user.getUser.invalidate();

          //post al socket
          await axios.post(
            `http://localhost:3000/api/socket/exchangePromotion`
          );
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };

  if (!validPromotions || validPromotions.length === 0)
    return <div>Actualemte no hay promociones para tu membresía.</div>;

  return (
    <div className="grid gap-4">
      <SearchInput register={register} />
      <div className="flex gap-4">
        {filteredPromos?.map((promo) => (
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
              disabled={userTotalPoints - promo.points <= 0}
              type="button"
              onClick={() =>
                handlePostPromotion(userId, promo.id, promo.points)
              }
              className="ml-auto rounded-xl bg-neutral-900 p-1 text-sm text-neutral-100"
            >
              Cargar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LastConsumptions({
  userConsumptions,
  userId,
}: // setTake,
// setSkip,
{
  userConsumptions: ConsumptionOnUser[];
  userId: string;
  // setTake: Dispatch<SetStateAction<number>>;
  // setSkip: Dispatch<SetStateAction<number>>;
}) {
  const ctx = api.useContext();
  const [currentPage, setCurrentPage] = useState(1);

  const totalCount = api.user.getTotalUserConsumptions.useQuery({ id: userId });
  const userLastConsumptions = api.user.getUserLastConsumptions.useQuery({
    id: userId,
    take: 10,
    skip: (currentPage - 1) * 10,
  });

  const { mutate } = api.user.updateGameStatus.useMutation();
  const handleUpdateGameStatus = (
    id: string,
    status: boolean,
    gameId: string | undefined
  ) => {
    mutate(
      { id, winner: status },
      {
        onSuccess: async () => {
          ctx.user.getUser.invalidate();

          // post al socket
          await axios.post(`http://localhost:3000/api/socket/gameOver`, {
            id: gameId,
          });
        },
      }
    );
  };

  if (!userLastConsumptions.data) return <div>404</div>;

  return (
    <details className="rounded-sm bg-white p-4">
      <summary className="cursor-pointer">Últimas consumiciones:</summary>
      <div className="pt-4">
        <Table trTitles={["consumición", "ganó?", "cantidad", "fecha"]}>
          {userLastConsumptions.data.consumptions.map((consumption) => (
            <tr key={consumption.id}>
              <td className="border-b border-gray-300 p-3">
                {consumption.consumption?.name}
              </td>
              <td className="border-b border-gray-300 p-3">
                {consumption.consumption?.consumptionCategory?.name ===
                  "Juego" &&
                  (consumption.winner === null ? (
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          handleUpdateGameStatus(
                            consumption.id,
                            true,
                            consumption.consumption?.id
                          )
                        }
                        className="rounded bg-green-500 p-2 text-neutral-100"
                      >
                        GANÓ
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateGameStatus(
                            consumption.id,
                            false,
                            consumption.consumption?.id
                          )
                        }
                        className="rounded bg-red-600 p-2 text-neutral-100"
                      >
                        PERDIÓ
                      </button>
                    </div>
                  ) : consumption.winner ? (
                    "SI"
                  ) : (
                    "NO"
                  ))}
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

        {totalCount.data && (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount.data}
            pageSize={10}
            onPageChange={(page) => setCurrentPage(page as number)}
          />
        )}
      </div>
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
      <summary className="cursor-pointer">Consumiciones totales:</summary>
      <div className="grid grid-cols-3 gap-4 pt-4">
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
