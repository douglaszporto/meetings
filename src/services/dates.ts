import dayjs, { Dayjs } from "dayjs";
import { CalendarDay } from "../types/calendar";
import { EventItem } from "../types/event";

export const GetWeekByDate = (date: Dayjs) => {
    let startOfWeek = date.startOf('week');
    let days: CalendarDay[] = [];
    for (let i=0; i<7; i++) {
        let date = startOfWeek.add(i,'day');
        days.push({
            date: date,
            isToday: dayjs().isSame(date, 'day'),
            name: date.format('ddd').toUpperCase(),
        });
    }
    return days;
}

export const CheckTimeConflict = (event1:EventItem, event2:EventItem) => {
    let start1 = event1.time.startOf('minute');
    let end1 = event1.time.startOf('minute').add(event1.duration, 'hour');
    let start2 = event2.time.startOf('minute');
    let end2 = event2.time.startOf('minute').add(event2.duration, 'hour');

    return (
        (start1.isAfter(start2,"m") && start1.isBefore(end2,"m")) || 
        (end1.isAfter(start2,"m") && end1.isBefore(end2,"m")) ||
        (start2.isAfter(start1,"m") && start2.isBefore(end1,"m")) ||
        (end2.isAfter(start1,"m") && end2.isBefore(end1,"m"))
    );
}