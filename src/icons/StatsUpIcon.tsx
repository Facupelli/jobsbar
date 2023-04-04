export default function StatsUpIcon({
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={fill}
    >
      <path
        d="M16 20v-8m0 0l3 3m-3-3l-3 3M4 14l8-8 3 3 5-5"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
