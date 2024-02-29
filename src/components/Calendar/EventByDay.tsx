import React, { useMemo } from 'react';
import { Card } from '@mui/material';
import { Dayjs } from 'dayjs';
import { EventItem } from '../../types/event';
import { CheckTimeConflict } from '../../services/dates';

interface EventsByDayProps {
    date: Dayjs;
    events: EventItem[];
    startHour: number;
    onEventOpen: (id: string) => void;
}

const EventsByDay: React.FC<EventsByDayProps> = ({ events, date, startHour, onEventOpen }) => {
    let startOfDay = date.hour(startHour).minute(0).second(0);

    const memoTodayEvents = useMemo(() => {
        return events.filter(event => event.date.isSame(date, 'day'));
    }, [events, date]);

    return memoTodayEvents.map((event) => {
        let eventTime = event.time
            .year(startOfDay.get('y'))
            .month(startOfDay.get('M'))
            .date(startOfDay.get('D'));
        let timeDiff = eventTime.diff(startOfDay, 'hour');

        let conflicts = memoTodayEvents.filter(e => e.id !== event.id).reduce<[number,number]>((acc:[number,number], cur:EventItem) => {
            let conflict = CheckTimeConflict(event, cur);
            if (conflict) {
                cur.time.isBefore(event.time) ? acc[0]++ : acc[1]++;
            }
            return acc;
        }, [0,0]);
        console.log(event.title, conflicts);

        return (
            <Card
                elevation={3}
                key={event.id}
                sx={{
                    backgroundColor: event.collabs[0].color,
                    color: "white",
                    p: 1,
                    boxSizing: "border-box",
                    borderRadius: 1,
                    cursor: "pointer",
                    position: "absolute",
                    left: String(conflicts[0]+0.5) + "rem",
                    right: String(conflicts[1]+0.5) + "rem",
                    top: String(timeDiff * 3) + "rem",
                    height: String(event.duration * 3) + "rem",
                    zIndex: (event.time.get('h') + 10),
                }}
                onClick={() => onEventOpen(event.id)}
            >
                {event.title}
            </Card>
        );
    });
};

export default EventsByDay;