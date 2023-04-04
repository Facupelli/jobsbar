export default function UsersIcon({
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
        d="M1 20v-1a7 7 0 017-7v0a7 7 0 017 7v1"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M13 14v0a5 5 0 015-5v0a5 5 0 015 5v.5"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M8 12a4 4 0 100-8 4 4 0 000 8zM18 9a3 3 0 100-6 3 3 0 000 6z"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
