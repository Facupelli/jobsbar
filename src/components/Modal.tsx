// import XMark from "../../icons/XMark";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  handleCloseModal: () => void;
  error?: boolean;
};

export default function Modal({
  children,
  isOpen,
  handleCloseModal,
  error,
}: Props) {
  return (
    <>
      <dialog
        open={isOpen}
        className={`fixed left-1/2 top-1/2 z-30 min-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded p-4 shadow-lg  ${
          error ? "border border-red-600 shadow-none" : ""
        }`}
      >
        <div className="flex justify-end">
          <button
            className=""
            role="button"
            type="button"
            onClick={handleCloseModal}
          >
            {/* <XMark size={22} white /> */}XX
          </button>
        </div>
        {children}
      </dialog>
      <div
        className="absolute left-0 top-0 z-20 h-screen w-full bg-[rgba(0,0,0,0.35)]"
        role="backdrop"
      ></div>
    </>
  );
}
