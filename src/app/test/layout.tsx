import React, { ReactNode } from "react";

const lauout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div>{children}</div>;
};

export default lauout;
