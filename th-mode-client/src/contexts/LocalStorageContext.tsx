import {LocalStorage} from "../utils/LocalStorage";
import {createContext, useContext} from "react";

export const LocalStorageContext = createContext<LocalStorage>(new LocalStorage());

export const useStorage = () => {
    const context = useContext(LocalStorageContext);
    if (context === undefined) {
        throw new Error('useStorage must be used within a LocalStorageContext');
    }
    return context;
}