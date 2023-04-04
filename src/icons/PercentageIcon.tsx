export default function PercentageIcon({
  size,
  fill,
}: {
  size: number;
  fill: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      color="#000000"
    >
      <path
        d="M17 19a2 2 0 110-4 2 2 0 010 4zM7 9a2 2 0 110-4 2 2 0 010 4zM19 5L5 19"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
