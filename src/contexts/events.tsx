import { ReactNode, createContext, useContext, useState } from "react";
import { EventItem } from "../types/event";
import { SaveEvent, DeleteEvent, GetEvents } from "../services/events";

interface EventsContextType {
    events: EventItem[];
    saveEvent: React.Dispatch<EventItem>;
    deleteEvent: React.Dispatch<EventItem>;
    getEvents: React.Dispatch<void>;
    setEventId: React.Dispatch<string|undefined>;
    eventId?: string;
    setCollabId: React.Dispatch<string|undefined>;
    collabId?: string;
}

interface EventsProviderProps {
    children: ReactNode;
}

export const EventsContext = createContext<EventsContextType>({
    events: [],
    saveEvent: () => {},
    deleteEvent: () => {},
    getEvents: () => {},
    setEventId: () => {},
    eventId: undefined,
    setCollabId: () => {},
    collabId: undefined,
});

export const EventsProvider = ({children}:EventsProviderProps) => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [eventId, setEventId] = useState<string>();
    const [collabId, setCollabId] = useState<string>();

    const saveEvent = (event: EventItem) => { 
        SaveEvent(event).then(response => {
            if (response.status === "success") {
                if (events.find(item => item.id === response.data?.id)) {
                    setEvents(events => events.map(item => item.id === response.data?.id ? response.data : item));
                } else {
                    setEvents(events => [...events, response.data as EventItem]);
                }
            }
        });
    };
    
    const deleteEvent = (event: EventItem) => {
        DeleteEvent(event).then(response => {
            if (response.status === "success") {
                setEvents(events => events.filter(item => item.id !== response.data?.id));
            }
        });
    };

    const getEvents = () => {
        GetEvents().then(response => {
            if (response.status === "success") {
                setEvents(response.list || []);
            }
        });
    };

    return <EventsContext.Provider value={{
            events, 
            saveEvent, 
            deleteEvent, 
            getEvents, 
            eventId, 
            setEventId,
            collabId,
            setCollabId
    }}>
        {children}
    </EventsContext.Provider>;
};

export function useEvents(): EventsContextType {
    const context = useContext(EventsContext);
    if (!context) {
        throw new Error('useEvents deve ser usado dentro de um EventsProvider');
    }
    return context;
}