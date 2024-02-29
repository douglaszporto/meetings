import { Dayjs } from 'dayjs';

export interface CalendarDay {
    date: Dayjs;
    isToday: boolean;
    name: string;
}