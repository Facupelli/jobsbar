import { RefObject } from "react";

export const toggleFullScreen = async (divRef: RefObject<HTMLDivElement>) => {
  if (typeof window !== undefined && divRef.current) {
    await divRef.current.requestFullscreen();
  }
};
