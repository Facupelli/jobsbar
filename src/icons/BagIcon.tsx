export default function BagIcon({
  size,
  active,
}: {
  size: number;
  active: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // color={fill}
      className={`${
        active ? "stroke-green-500 sm:stroke-neutral-900" : "stroke-gray-200"
      }`}
    >
      <path
        d="M19.26 9.696l1.385 9A2 2 0 0118.67 21H5.33a2 2 0 01-1.977-2.304l1.385-9A2 2 0 016.716 8h10.568a2 2 0 011.977 1.696zM9 11v7M15 11v7M14 5a2 2 0 10-4 0"
        // stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
