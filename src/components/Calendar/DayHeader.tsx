import { Grid, Typography } from "@mui/material";
import { CalendarDay } from "../../types/calendar";

interface DayHeaderProps {
    key: number | string;
    day: CalendarDay;
};

const DayHeader:React.FC<DayHeaderProps> = ({day}:DayHeaderProps) => {
    return <Grid item sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '2rem',
            gap: 0,
            MozBoxSizing: 'border-box',
            backgroundColor: day.isToday ? 'primary.main' : 'inherit',
            color: day.isToday ? 'white' : 'inherit',
    }} xs={1}>
        <Typography variant='button'>
            {day.date.format('DD')} | {day.name}
        </Typography>
    </Grid>;
}

export default DayHeader;