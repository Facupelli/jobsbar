import EditIcon from "~/icons/EditIcon";
import TrashIcon from "~/icons/TrashIcon";

type Props = {
  handleEdit?: () => void;
  handleDelete: () => void;
  onlyDelete?: boolean;
};

export default function LastTd({
  handleEdit,
  handleDelete,
  onlyDelete,
}: Props) {
  return (
    <>
      {!onlyDelete && (
        <td
          className="w-[24px] cursor-pointer border-b border-gray-300 p-3"
          onClick={handleEdit}
        >
          <button aria-label="edit button">
            <EditIcon size={18} />
          </button>
        </td>
      )}
      <td
        className="w-[24px] cursor-pointer border-b border-gray-300 p-3"
        onClick={handleDelete}
      >
        <button aria-label="delete button">
          <TrashIcon size={18} />
        </button>
      </td>
    </>
  );
}
