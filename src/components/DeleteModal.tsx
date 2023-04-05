export default function DeleteModal({
  handleDelete,
  id,
}: {
  handleDelete: (id: string) => void;
  id: string;
}) {
  return (
    <>
      <h1 className="text-xl font-bold text-red-700">CUIDADO</h1>
      <p className="pb-6">Está seguro que desea eliminar para siempre?</p>
      <div className="flex justify-center">
        <button
          className="w-full rounded-sm bg-red-500 py-1 text-neutral-100"
          onClick={() => handleDelete(id)}
        >
          ACEPTAR
        </button>
      </div>
    </>
  );
}
