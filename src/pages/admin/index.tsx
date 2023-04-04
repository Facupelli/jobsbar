import { useForm } from "react-hook-form";
import Head from "next/head";
import Link from "next/link";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjason from "superjson";
import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { Dispatch, SetStateAction, useState } from "react";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import { api } from "~/utils/api";

import AdminLayout from "~/components/Admin/AdminLayout";
import Nav from "~/components/Nav";
import Table from "~/components/Table";
import Modal from "~/components/Modal";

import type { ConsumptionsGrouped } from "~/types/consumptionsByCategory";
import type { Consumption, Membership, Promotion, User } from "~/types/model";
import type {
  Active,
  AdminPromotion,
  CreateConsumption,
  CreateMembership,
  CreatePromotion,
  CreateUser,
} from "~/types/admin";
import DeleteModal from "~/components/DeleteModal";
import LastTd from "~/components/Admin/LastTD";

export type Routes =
  | "home"
  | "memberships"
  | "consumptions"
  | "promotions"
  | "users";

export default function Admin() {
  const memberships = api.membership.getAllMemberships.useQuery();
  const users = api.user.getAllUsers.useQuery();
  const promotions = api.promotions.getAllPromotions.useQuery();
  const consumptionsByCategories =
    api.consumptions.getConsumptionsGrouped.useQuery();

  const [route, setRoute] = useState<Routes>("home");

  if (
    !memberships.data ||
    !users.data ||
    !promotions.data ||
    !consumptionsByCategories.data
  ) {
    return <div>404</div>;
  }

  return (
    <div>
      <Head>
        <title>JOBS | Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav route="admin" />

      <main className="min-h-screen bg-gray-200">
        <AdminLayout route={route} setRoute={setRoute}>
          {route === "home" && <Home />}
          {route === "memberships" && (
            <Memberships memberships={memberships.data} />
          )}
          {route === "consumptions" && (
            <Consumptions consumptions={consumptionsByCategories.data} />
          )}
          {route === "promotions" && (
            <Promotions
              consumptions={consumptionsByCategories.data}
              promotions={promotions.data}
              memberships={memberships.data}
            />
          )}
          {route === "users" && (
            <Users
              users={users.data?.allUsers}
              totalUsers={users.data?.usersCount}
            />
          )}
        </AdminLayout>
      </main>
    </div>
  );
}

function Home() {
  const mostPopularConsumptions =
    api.admin.getMostPopularConsumptions.useQuery();
  const mostPopularPromotion = api.admin.getMostPopularPromotion.useQuery();
  const mostValuableUser = api.admin.getMostValuableUser.useQuery();

  if (
    !mostPopularConsumptions.data ||
    !mostPopularPromotion.data ||
    !mostValuableUser.data
  )
    return <div>404</div>;

  return (
    <section className="grid gap-10">
      {mostPopularConsumptions.data.map((category) => (
        <div key={category.id}>
          <h1 className="p-2 text-lg font-semibold">
            {category.name} más popular
          </h1>
          <Table trTitles={["Nombre", "Total"]}>
            {category.consumptions.map((consumption) => (
              <tr key={consumption.name}>
                <td className="w-1/2 border-b border-gray-300 p-3">
                  {consumption.name}
                </td>
                <td className="w-1/2 border-b border-gray-300 p-3">
                  {consumption.total}
                </td>
              </tr>
            ))}
          </Table>
        </div>
      ))}

      <div>
        <h1 className="p-2 text-lg font-semibold">Promo más popular</h1>
        <Table trTitles={["Nombre", "Total"]}>
          {mostPopularPromotion.data.map((promo) => (
            <tr key={promo.name}>
              <td className="w-1/2 border-b border-gray-300 p-3">
                {promo.name}
              </td>
              <td className="w-1/2 border-b border-gray-300 p-3">
                {promo.total}
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <div>
        <h1 className="p-2 text-lg font-semibold">Usuario más valorado</h1>
        <Table trTitles={["Nombre", "Puntos Gastados"]}>
          {mostValuableUser.data.map((user) => (
            <tr key={user.id}>
              <td className="w-1/2 border-b border-gray-300 p-3">
                {user.name}
              </td>
              <td className="w-1/2 border-b border-gray-300 p-3">
                {user.totalPointsSpent}
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </section>
  );
}

function Memberships({ memberships }: { memberships: Membership[] }) {
  const ctx = api.useContext();

  const [membership, setMembership] = useState<Membership | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { mutate } = api.membership.deleteMembershipById.useMutation();

  const handleDelete = (membershipId: string) => {
    mutate(
      { id: membershipId },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          ctx.membership.getAllMemberships.invalidate();
        },
      }
    );
  };
  return (
    <>
      {showDeleteModal && membership && (
        <Modal
          isOpen={showDeleteModal}
          handleCloseModal={() => setShowDeleteModal(false)}
        >
          <DeleteModal handleDelete={handleDelete} id={membership.id} />
        </Modal>
      )}
      {showModal && (
        <Modal isOpen={showModal} handleCloseModal={() => setShowModal(false)}>
          <CreateMembership
            setShowModal={setShowModal}
            membership={membership}
          />
        </Modal>
      )}
      <section>
        <div className="flex items-center justify-between pb-6">
          <h1 className="p-3 text-lg font-semibold">Membresías</h1>
          <button
            type="button"
            onClick={() => {
              setMembership(null);
              setShowModal(true);
            }}
            className="rounded bg-green-500 p-2 text-neutral-100"
          >
            Crear membresía
          </button>
        </div>
        <Table trTitles={["Nombre", "Puntos Mínimos", "Puntos Máximos"]}>
          {memberships.map((membership) => (
            <tr key={membership.id}>
              <td className="border-b border-gray-300 p-3">
                {membership.name}
              </td>
              <td className="border-b border-gray-300 p-3">
                {membership.minPoints}
              </td>
              <td className="border-b border-gray-300 p-3">
                {membership.maxPoints}
              </td>
              <LastTd
                handleEdit={() => {
                  setMembership(membership);
                  setShowModal(true);
                }}
                handleDelete={() => {
                  setMembership(membership);
                  setShowDeleteModal(true);
                }}
              />
            </tr>
          ))}
        </Table>
      </section>
    </>
  );
}

function CreateMembership({
  setShowModal,
  membership,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  membership: Membership | null;
}) {
  const ctx = api.useContext();
  const { register, handleSubmit } = useForm<CreateMembership>({
    defaultValues: membership ?? {},
  });
  const createMembership = api.admin.postMembership.useMutation();
  const editMembership = api.membership.editMembershipById.useMutation();

  const onSubmit = (data: CreateMembership) => {
    if (membership) {
      return editMembership.mutate(
        { ...data, id: membership.id },
        {
          onSuccess: () => {
            setShowModal(false);
            ctx.membership.getAllMemberships.invalidate();
          },
        }
      );
    }
    return createMembership.mutate(data, {
      onSuccess: () => {
        setShowModal(false);
        ctx.membership.getAllMemberships.invalidate();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-1">
        <label htmlFor="name">Nombre:</label>
        <input
          className="rounded border border-neutral-600 p-1"
          type="text"
          id="name"
          required
          {...register("name")}
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="minPoints">Puntos mínimos:</label>
        <input
          className="rounded border border-neutral-600 p-1"
          type="text"
          id="minPoints"
          required
          {...register("minPoints", { valueAsNumber: true })}
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="maxPoints">Puntos máximos:</label>
        <input
          className="rounded border border-neutral-600 p-1"
          type="text"
          id="maxPoints"
          required
          {...register("maxPoints", { valueAsNumber: true })}
        />
      </div>
      <button
        type="submit"
        className="rounded-sm bg-green-500 p-1 font-semibold text-neutral-100"
      >
        {membership ? "EDITAR" : "CREAR"}
      </button>
    </form>
  );
}

function Consumptions({
  consumptions,
}: {
  consumptions: ConsumptionsGrouped[];
}) {
  const ctx = api.useContext();
  const [consumption, setConsumption] = useState<Consumption | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [active, setActive] = useState<Active>("Bebida");

  const { mutate } = api.consumptions.deleteConsumption.useMutation();

  const selectedConsumption = consumptions.find(
    (category) => category.name === active
  );

  const categories = consumptions.map((c) => ({ name: c.name, id: c.id }));

  const handleDelete = (id: string) => {
    mutate(
      { id },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          ctx.consumptions.getConsumptionsGrouped.invalidate();
        },
      }
    );
  };

  return (
    <>
      {showDeleteModal && consumption && (
        <Modal
          isOpen={showDeleteModal}
          handleCloseModal={() => setShowDeleteModal(false)}
        >
          <DeleteModal handleDelete={handleDelete} id={consumption.id} />
        </Modal>
      )}
      {showModal && (
        <Modal isOpen={showModal} handleCloseModal={() => setShowModal(false)}>
          <CreateConsumption
            setShowModal={setShowModal}
            categories={categories}
            active={active}
            consumption={consumption}
          />
        </Modal>
      )}
      <section className="gap-10">
        <nav className="fixed left-[220px] top-[70px] h-[calc(100vh_-_70px)] w-[120px] bg-neutral-800">
          <ul className="grid gap-4 text-neutral-100">
            {consumptions.map((category) => (
              <li
                key={category.id}
                className={`p-4 ${
                  active === category.name
                    ? "border-r-[6px] border-green-500 font-semibold"
                    : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActive(category.name as Active)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-[120px]">
          <div className="flex items-center justify-between pb-6">
            <h1 className="p-3 text-lg font-semibold">{active}</h1>
            <button
              type="button"
              onClick={() => {
                setConsumption(null);
                setShowModal(true);
              }}
              className="rounded bg-green-500 p-2 text-neutral-100"
            >
              Crear {active}
            </button>
          </div>
          <Table trTitles={["Nombre", "Puntos"]}>
            {selectedConsumption?.consumptions.map((consumption) => (
              <tr key={consumption.name}>
                <td className="border-b border-gray-300 p-3">
                  {consumption.name}
                </td>
                <td className="border-b border-gray-300 p-3">
                  {consumption.points}
                </td>
                <LastTd
                  handleEdit={() => {
                    setShowModal(true);
                    setConsumption(consumption);
                  }}
                  handleDelete={() => {
                    setShowDeleteModal(true);
                    setConsumption(consumption);
                  }}
                />
              </tr>
            ))}
          </Table>
        </div>
      </section>
    </>
  );
}

function CreateConsumption({
  setShowModal,
  categories,
  active,
  consumption,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  categories: { id: string; name: string }[];
  active: Active;
  consumption: Consumption | null;
}) {
  const { register, handleSubmit } = useForm<CreateConsumption>({
    defaultValues: {
      categoryId: categories.find((c) => c.name === active)?.id,
      name: consumption?.name,
      points: consumption?.points,
    },
  });
  const ctx = api.useContext();
  const createConsumption = api.admin.postConsumption.useMutation();
  const editConsumption = api.consumptions.editConsumption.useMutation();

  const onSubmit = (data: CreateConsumption) => {
    if (consumption) {
      return editConsumption.mutate(
        { ...data, id: consumption.id },
        {
          onSuccess: () => {
            setShowModal(false);
            ctx.consumptions.getConsumptionsGrouped.invalidate();
          },
        }
      );
    }
    return createConsumption.mutate(data, {
      onSuccess: () => {
        setShowModal(false);
        ctx.consumptions.getConsumptionsGrouped.invalidate();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-1">
        <label>Tipo:</label>
        <select
          {...register("categoryId")}
          className="rounded border border-neutral-600 p-1"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1">
        <label>Nombre:</label>
        <input
          type="text"
          {...register("name")}
          className="rounded border border-neutral-600 p-1"
        />
      </div>

      <div className="grid gap-1">
        <label>Puntos:</label>
        <input
          type="text"
          {...register("points", { valueAsNumber: true })}
          className="rounded border border-neutral-600 p-1"
        />
      </div>

      <button
        type="submit"
        className="rounded-sm bg-green-500 p-1 font-semibold text-neutral-100"
      >
        {consumption ? "EDITAR" : "CREAR"}
      </button>
    </form>
  );
}

function Promotions({
  consumptions,
  promotions,
  memberships,
}: {
  consumptions: ConsumptionsGrouped[];
  promotions: AdminPromotion[];
  memberships: Membership[];
}) {
  const ctx = api.useContext();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promotion, setPromotion] = useState<AdminPromotion | null>(null);

  const { mutate } = api.promotions.deletePromotion.useMutation();

  const handleDelete = (id: string) => {
    mutate(
      { id },
      {
        onSuccess: () => {
          ctx.promotions.getAllPromotions.invalidate();
          setShowDeleteModal(false);
        },
      }
    );
  };

  return (
    <>
      {showDeleteModal && promotion && (
        <Modal
          isOpen={showDeleteModal}
          handleCloseModal={() => setShowDeleteModal(false)}
        >
          <DeleteModal handleDelete={handleDelete} id={promotion.id} />
        </Modal>
      )}
      {showModal && (
        <Modal isOpen={showModal} handleCloseModal={() => setShowModal(false)}>
          <CreatePromotion
            setShowModal={setShowModal}
            consumptions={consumptions}
            memberships={memberships}
          />
        </Modal>
      )}
      <section>
        <div className="flex items-center justify-between pb-6">
          <h1 className="p-3 text-lg font-semibold">Promociones</h1>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded bg-green-500 p-2 text-neutral-100"
          >
            Crear promoción
          </button>
        </div>

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
                      consumption.consumption?.consumptionCategory?.name ===
                      "Bebida"
                  )
                  .map((consumption) => consumption.consumption?.name)
                  .join(", ")}
              </td>
              <td className="border-b border-gray-300 p-3">
                {promo.consumptions
                  ?.filter(
                    (consumption) =>
                      consumption.consumption?.consumptionCategory?.name ===
                      "Comida"
                  )
                  .map((consumption) => consumption.consumption?.name)
                  .join(", ")}
              </td>
              <td className="border-b border-gray-300 p-3">
                {promo.consumptions
                  ?.filter(
                    (consumption) =>
                      consumption.consumption?.consumptionCategory?.name ===
                      "Juego"
                  )
                  .map((consumption) => consumption.consumption?.name)
                  .join(", ")}
              </td>
              <td className="border-b border-gray-300 p-3">
                {promo.discount}%
              </td>
              <td className="border-b border-gray-300 p-3">{promo.points}</td>
              <LastTd
                onlyDelete
                handleDelete={() => {
                  setPromotion(promo);
                  setShowDeleteModal(true);
                }}
              />
            </tr>
          ))}
        </Table>
      </section>
    </>
  );
}

function CreatePromotion({
  setShowModal,
  consumptions,
  memberships,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  consumptions: ConsumptionsGrouped[];
  memberships: Membership[];
}) {
  const { register, handleSubmit } = useForm<CreatePromotion>();
  const ctx = api.useContext();
  const { mutate } = api.admin.createPromotion.useMutation();

  const onSubmit = (data: CreatePromotion) => {
    mutate(
      {
        name: data.name,
        membershipsIds: data.membershipsIds,
        consumptionsIds: [
          ...data.bebidaIds,
          ...data.juegoIds,
          ...data.comidaIds,
        ],
        points: data.points,
        discount: data.discount,
        quantity: 1,
      },
      {
        onSuccess: () => {
          setShowModal(false);
          ctx.promotions.getAllPromotions.invalidate();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <h4>CREAR PROMOCIÓN</h4>

      <div className="grid gap-1">
        <label>Nombre:</label>
        <input
          className="rounded border border-neutral-600 p-1"
          type="text"
          {...register("name")}
        />
      </div>

      <div className="grid gap-1">
        <label>Membresias:</label>
        <select
          className="rounded border border-neutral-600 p-1"
          multiple
          {...register("membershipsIds")}
        >
          {memberships?.map((membership) => (
            <option key={membership.id} value={membership.id}>
              {membership.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {consumptions.map((category) => (
          <div key={category.id} className="grid gap-1">
            <label>{category.name}:</label>
            <select
              className="rounded border border-neutral-600 p-1"
              multiple
              {...register(
                `${category.name.toLowerCase()}Ids` as keyof CreatePromotion
              )}
            >
              {category.consumptions.map((consumption) => (
                <option key={consumption.id} value={consumption.id}>
                  {consumption.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="grid gap-1">
        <label>Descuento (%):</label>
        <input
          className="rounded border border-neutral-600 p-1"
          type="text"
          {...register("discount", { valueAsNumber: true })}
        />
      </div>

      <div className="grid gap-1">
        <label>Puntos:</label>
        <input
          className="rounded border border-neutral-600 p-1"
          type="text"
          {...register("points", { valueAsNumber: true })}
        />
      </div>

      <button
        type="submit"
        className="rounded-sm bg-green-500 p-1 font-semibold text-neutral-100"
      >
        CREAR
      </button>
    </form>
  );
}

function Users({ users, totalUsers }: { users: User[]; totalUsers: number }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <Modal isOpen={showModal} handleCloseModal={() => setShowModal(false)}>
          <CreateUser setShowModal={setShowModal} />
        </Modal>
      )}

      <section>
        <div className="flex items-center justify-between pb-6">
          <h1 className="p-3 text-lg font-semibold">Usuarios</h1>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded bg-green-500 p-2 text-neutral-100"
          >
            Crear usuario
          </button>
        </div>
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
    </>
  );
}

function CreateUser({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { register, handleSubmit } = useForm<CreateUser>();
  const ctx = api.useContext();
  const { mutate } = api.admin.createUser.useMutation();

  const onSubmit = (data: CreateUser) => {
    mutate(data, {
      onSuccess: () => {
        setShowModal(false);
        ctx.user.getAllUsers.invalidate();
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-1">
        <label htmlFor="name">Nombre y Apellido:</label>
        <input
          type="text"
          {...register("name")}
          required
          id="name"
          className="rounded border border-neutral-600 p-1"
        />
      </div>

      <button
        type="submit"
        className="rounded-sm bg-green-500 p-1 font-semibold text-neutral-100"
      >
        CREAR
      </button>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session?.user.role === "Admin") {
    const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: { prisma, session: null },
      transformer: superjason,
    });

    await ssg.membership.getAllMemberships.prefetch();
    await ssg.consumptions.getConsumptionsGrouped.prefetch();
    await ssg.promotions.getAllPromotions.prefetch();
    await ssg.user.getAllUsers.prefetch();

    return {
      props: {
        trpcState: ssg.dehydrate(),
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
