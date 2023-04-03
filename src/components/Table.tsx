type Props = {
  children?: React.ReactNode;
  trTitles: string[];
};

export default function Table({ trTitles = [], children }: Props) {
  return (
    <table className="w-full border-collapse overflow-hidden rounded-md bg-gray-100 shadow-md">
      <thead className="border-b border-gray-300  text-[12px] font-light text-gray-800">
        <tr className="rounded font-semibold">
          {trTitles.length > 0 &&
            trTitles.map((title, i) => (
              <th key={i} className="rounded-br-md rounded-tr-md p-3 text-left">
                {title}
              </th>
            ))}
        </tr>
      </thead>
      <tbody className="bg-white text-[14px]">{children}</tbody>
    </table>
  );
}
