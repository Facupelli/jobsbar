import { UseFormRegister } from "react-hook-form";
import SearchIcon from "~/icons/SearchIcon";

export default function SearchInput({
  register,
}: {
  register: UseFormRegister<{ name: string }>;
}) {
  return (
    <div className="flex items-center ">
      <input
        type="search"
        className="h-10 w-1/3 min-w-[200px] rounded-bl rounded-tl border-b border-l border-t border-neutral-600 p-2"
        placeholder="Fernet"
        {...register("name")}
      />
      <div className="flex h-10 w-[50px] items-center justify-center rounded-br rounded-tr border-b border-r border-t border-neutral-600 bg-neutral-900">
        <SearchIcon size={22} fill="#f5f5f5" />
      </div>
    </div>
  );
}
