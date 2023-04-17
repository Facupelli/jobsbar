// import XMark from "../../icons/XMark";

import { createPortal } from "react-dom";

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
  return createPortal(
    <>
      <dialog
        title="Modal Dialog"
        open={isOpen}
        className={`fixed top-1/2 z-30 min-w-[90vw] -translate-y-1/2 rounded p-8 shadow-lg sm:min-w-[500px]  ${
          error ? "border border-red-600 shadow-none" : ""
        }`}
      >
        <div className="flex justify-end">
          <button
            className=""
            role="button"
            type="button"
            onClick={handleCloseModal}
            aria-label="close modal button"
          >
            {/* <XMark size={22} white /> */}XX
          </button>
        </div>
        {children}
      </dialog>
      <aside
        className="absolute left-0 top-0 z-20 h-screen w-full bg-[rgba(0,0,0,0.35)]"
        role="backdrop"
      ></aside>
    </>,
    document.body
  );
}
