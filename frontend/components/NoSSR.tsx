"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

type NoSSRProps = {
  children: ReactNode;
};

export default dynamic(
  () =>
    Promise.resolve(({ children }: NoSSRProps) => {
      return children;
    }),
  { ssr: false }
);
