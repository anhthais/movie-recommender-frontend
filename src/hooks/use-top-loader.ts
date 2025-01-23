import { TopLoaderContext } from "@/app/context/top-bar-loader-context";
import { useContext } from "react";

export const useTopBarLoader = () => {
  const context = useContext(TopLoaderContext);
  if (!context) {
    throw new Error('useTopBarLoader must be used within a TopBarloaderProvider');
  }

  return context;
}