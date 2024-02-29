import { ReactNode, createContext, useContext, useState } from "react";
import { CollabItem } from "../types/collab";
import { SaveCollab, DeleteCollab, GetCollabs } from "../services/collabs";

interface CollabsContextType {
    collabs: CollabItem[];
    saveCollab: React.Dispatch<CollabItem>;
    deleteCollab: React.Dispatch<CollabItem>;
    getCollabs: React.Dispatch<void>;
}

interface CollabsProviderProps {
    children: ReactNode;
}

export const CollabsContext = createContext<CollabsContextType>({
    collabs: [],
    saveCollab: () => {},
    deleteCollab: () => {},
    getCollabs: () => {}
});

export const CollabsProvider = ({children}:CollabsProviderProps) => {
    const [collabs, setCollabs] = useState<CollabItem[]>([]);

    const saveCollab = (collab: CollabItem) => { 
        SaveCollab(collab).then(response => {
            if (response.status === "success") {
                if (collabs.find(item => item.id === response.data?.id)) {
                    setCollabs(collabs => collabs.map(item => item.id === response.data?.id ? response.data : item));
                } else {
                    setCollabs(collabs => [...collabs, response.data as CollabItem]);
                }
            }
        });
    };
    const deleteCollab = (collab: CollabItem) => {
        DeleteCollab(collab).then(response => {
            if (response.status === "success") {
                setCollabs(collabs => collabs.filter(item => item.id !== response.data?.id));
            }
        });
    };

    const getCollabs = () => {
        GetCollabs().then(response => {
            if (response.status === "success") {
                setCollabs(response.list || []);
            }
        });
    };

    return <CollabsContext.Provider value={{ collabs, saveCollab, deleteCollab, getCollabs }}>
        {children}
    </CollabsContext.Provider>;
};

export function useCollabs(): CollabsContextType {
    const context = useContext(CollabsContext);
    if (!context) {
        throw new Error('useCollabs deve ser usado dentro de um CollabsProvider');
    }
    return context;
}