import { ReactNode, createContext, useContext, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

interface CurrentDateContextType {
    currentDate: Dayjs;
    setCurrentDate: React.Dispatch<React.SetStateAction<Dayjs>>;
}

interface CurrentDateProviderProps {
    children: ReactNode;
}

export const CurrentDateContext = createContext<CurrentDateContextType>({
    currentDate: dayjs(),
    setCurrentDate: () => {}
});

export const CurrentDateProvider = ({children}:CurrentDateProviderProps) => {
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());

    return <CurrentDateContext.Provider value={{ currentDate, setCurrentDate }}>
        {children}
    </CurrentDateContext.Provider>;
};

export function useCurrentDate(): CurrentDateContextType {
    const context = useContext(CurrentDateContext);
    if (!context) {
        throw new Error('useCurrentDate deve ser usado dentro de um CurrentDateProvider');
    }
    return context;
}
