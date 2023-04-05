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

  const onNext = () => {
    onPageChange(currentPage + 1);
    console.log("click");
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className="mt-6 flex items-center justify-center gap-2">
      <li className="cursor-pointer" onClick={onPrevious}>
        <NavArrowLeftIcon size={20} fill={"#171717"} />
      </li>
      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return (
            <li key={pageNumber} className="cursor-pointer">
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={pageNumber}
            className=" cursor-pointer"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li className="cursor-pointer" onClick={onNext}>
        <NavArrowRightIcon size={20} fill={"#171717"} />
      </li>
    </ul>
  );
}
