import React from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "../app/components/Loader/Loader";

interface CustomProps {
  children: React.ReactNode;
}

const Custom: React.FC<CustomProps> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});
  return <>{isLoading ? <Loader /> : <>{children}</>}</>;
};

export default Custom;
