import dayjs from "dayjs";

import { EventItem } from "../types/event";

interface EventAPIResponse {
    status: "success"|"error";
    data?: EventItem;
    list?: EventItem[];
    error?: Error;
}

export const SaveEvent = (eventToSave: EventItem) => {
    return new Promise<EventAPIResponse>((resolve) => {

        try {
            let events = JSON.parse(localStorage.getItem("events") || "{}") as {[key:string]: EventItem};

            events[eventToSave.id] = eventToSave;
                
            localStorage.setItem("events", JSON.stringify(events));
            resolve({
                status: "success",
                data: eventToSave,
            });
        } catch (error:any) {
            resolve({
                status: "error",
                error: error as Error,
            });
        }
    });
}

export const DeleteEvent = (eventToDelete: EventItem) => {
    return new Promise<EventAPIResponse>((resolve) => {

        try {
            let events = JSON.parse(localStorage.getItem("events") || "{}") as {[key:string]: EventItem};

            delete events[eventToDelete.id];
                
            localStorage.setItem("events", JSON.stringify(events));
            resolve({
                status: "success",
                data: eventToDelete,
            });
        } catch (error:any) {
            resolve({
                status: "error",
                error: error as Error,
            });
        }
    });
}

export const GetEvents = () => {
    return new Promise<EventAPIResponse>((resolve) => {

        try {
            let events = JSON.parse(localStorage.getItem("events") || "{}") as {[key:string]: EventItem};
            resolve({
                status: "success",
                list: Object.values(events).map(event => ({
                    ...event,
                    date: typeof event.date === 'string' ? dayjs(event.date) : event.date,
                    time: typeof event.time === 'string' ? dayjs(event.time) : event.time,
                }))
            });
        } catch (error:any) {
            resolve({
                status: "error",
                error: error as Error,
            });
        }
    });
}