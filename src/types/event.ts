import { Dayjs } from 'dayjs';
import { CollabItem } from './collab';

export interface EventItem {
    id: string;
    title: string;
    date: Dayjs;
    time: Dayjs;
    duration: number;
    photo?: string;
    collabs: CollabItem[];
}