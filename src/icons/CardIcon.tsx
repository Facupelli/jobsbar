export default function CardIcon({
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
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // color={fill}
      className={`${
        active ? "stroke-green-500 sm:stroke-neutral-900" : "stroke-gray-200"
      }`}
    >
      <path
        d="M22 9v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h16a2 2 0 012 2v2zm0 0H6"
        // stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
