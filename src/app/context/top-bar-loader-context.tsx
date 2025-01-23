import { createContext, ReactNode } from "react";

export type TopLoaderContextValues = {
    staticStart : () => void;
    complete: () => void;
    continuousStart: () => void;
}
  
  
export const TopLoaderContext = createContext<TopLoaderContextValues | undefined>(undefined);

export type TopLoaderContextProviderProps = { 
    children: ReactNode, 
    values: TopLoaderContextValues
}
  
export const TopLoaderContextProvider = ({ children, values } : TopLoaderContextProviderProps) => {
    return (
        <TopLoaderContext.Provider value={values}>
            { children }
        </TopLoaderContext.Provider>
    )
};