import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { Box, Grid, Stack } from '@mui/material';

import TimeCell from './Calendar/TimeCell';
import DayHeader from './Calendar/DayHeader';
import { CalendarDay } from '../types/calendar';
import { GetWeekByDate } from '../services/dates';
import { useCurrentDate } from '../contexts/currentDate';
import { useEvents } from '../contexts/events';
import EventsByDay from './Calendar/EventByDay';

const START_HOUR = 7;
const END_HOUR = 19;

const hours = Array.from(new Array(END_HOUR-START_HOUR)).map((_, i) => i+START_HOUR);
const hoursFormatted = ['', ...hours.map(h => h.toString().padStart(2, '0') + ':00')];

const Calendar: React.FC = () => {
    let [weekDays, setWeekDays] = React.useState<CalendarDay[]>([]);

    let { currentDate } = useCurrentDate();
    let { events, collabId, getEvents, setEventId } = useEvents();


    const handleOpenEvent = (id: string) => {
        setEventId(id);
    }

    const memoWeekEvents = React.useMemo(() => {
        return events.filter(event => {
            const dt = typeof event.date === 'string' ? dayjs(event.date) : event.date;
            const filterByCollab = collabId ? event.collabs.some(collab => collab.id === collabId) : true;
            return dt.isSame(currentDate, 'week') && filterByCollab;
        });
    }, [events, currentDate, collabId]);


    useEffect(() => {
        let days = GetWeekByDate(currentDate);
        setWeekDays(days);
    }, [currentDate]);

    useEffect(() => {
        getEvents();
    }, []);


    return <>
        <Box sx={{p:4}}>
            <Stack direction="row" >
                <Stack direction="column">
                    {hoursFormatted.map(hour => <TimeCell key={hour}>{hour}</TimeCell>)}
                </Stack>
                <Box overflow={"auto"} sx={{height:"100%",flexGrow:1}}>
                    <Grid container sx={{height:"100%",flexGrow:1}} columns={7} minWidth={{xs:"350vw",md:"auto"}} columnGap={0} spacing={0}>
                        {weekDays.map((day, i) => <DayHeader key={i} day={day} />)}
                        {Array.from(Array(7)).map((c, i) => <Grid item key={i} xs={1}>
                            <Box sx={{width:"100%", height:"36rem", bgcolor:c, position:"relative"}}>
                                {weekDays[i] ? <EventsByDay events={memoWeekEvents} date={weekDays[i].date} startHour={START_HOUR} onEventOpen={handleOpenEvent} /> : null}
                            </Box>
                        </Grid>)}
                    </Grid>
                </Box>
            </Stack>
        </Box>
    </>;
};

export default Calendar;