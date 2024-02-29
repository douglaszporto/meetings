import { CollabItem } from "../types/collab";

interface CollabAPIResponse {
    status: "success"|"error";
    data?: CollabItem;
    list?: CollabItem[];
    error?: Error;
}

export const SaveCollab = (collabToSave: CollabItem) => {
    return new Promise<CollabAPIResponse>((resolve, reject) => {

        try {
            let collabs = JSON.parse(localStorage.getItem("collabs") || "{}") as {[key:string]: CollabItem};

            collabs[collabToSave.id] = collabToSave;
                
            localStorage.setItem("collabs", JSON.stringify(collabs));
            resolve({
                status: "success",
                data: collabToSave,
            });
        } catch (error:any) {
            reject({
                status: "success",
                error: error as Error,
            });
        }
    });
}

export const DeleteCollab = (collabToDelete: CollabItem) => {
    return new Promise<CollabAPIResponse>((resolve, reject) => {

        try {
            let collabs = JSON.parse(localStorage.getItem("collabs") || "{}") as {[key:string]: CollabItem};

            delete collabs[collabToDelete.id];
                
            localStorage.setItem("collabs", JSON.stringify(collabs));
            resolve({
                status: "success",
                data: collabToDelete,
            });
        } catch (error:any) {
            reject({
                status: "success",
                error: error as Error,
            });
        }
    });
}

export const GetCollabs = () => {
    return new Promise<CollabAPIResponse>((resolve, reject) => {

        try {
            let collabs = JSON.parse(localStorage.getItem("collabs") || "{}") as {[key:string]: CollabItem};
            resolve({
                status: "success",
                list: Object.values(collabs),
            });
        } catch (error:any) {
            reject({
                status: "success",
                error: error as Error,
            });
        }
    });
}