import { DOTS, usePagination } from "~/hooks/usePagination";
import NavArrowLeftIcon from "~/icons/NavArrowLeftIcon";
import NavArrowRightIcon from "~/icons/NavArrowRight";

type Props = {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
  onPageChange: (page: number | string) => void;
};

export default function Pagination({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}: Props) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (!paginationRange) return null;

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const lastPage = paginationRange[paginationRange.length - 1];
  const firstPage = paginationRange[0];

  const onNext = () => {
    if (lastPage === currentPage) return;
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    if (firstPage === currentPage) return;
    onPageChange(currentPage - 1);
  };

  return (
    <ul className="mt-6 flex items-center justify-center font-medium text-neutral-800 ">
      <button className="cursor-pointer " onClick={onPrevious}>
        <NavArrowLeftIcon size={20} fill={"#171717"} />
      </button>
      <div className="flex">
        {paginationRange.map((pageNumber) => {
          if (pageNumber === DOTS) {
            return (
              <li key={pageNumber} className="cursor-pointer ">
                &#8230;
              </li>
            );
          }

          return (
            <li
              key={pageNumber}
              className=" cursor-pointer border-r border-neutral-300 px-2 last:border-none"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          );
        })}
      </div>
      <button className="cursor-pointer" onClick={onNext}>
        <NavArrowRightIcon size={20} fill={"#171717"} />
      </button>
    </ul>
  );
}
