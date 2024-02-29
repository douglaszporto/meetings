import { Box, Typography } from "@mui/material";

interface TimeCellProps {
    children?: React.ReactNode | null;
    key?: number | string;
};

const TimeCell:React.FC<TimeCellProps> = ({children}:TimeCellProps) => {
    return <Box sx={{
                borderTop: children ? 1 : 0, 
                borderRight: children ? 1 : 0,
                borderColor: '#fff3', 
                boxSizing: 'border-box',
                width: "2.5rem",
                height: children ? "3rem" : "2rem"
            }}>
        <Typography variant='caption'>
            {children}
        </Typography>
    </Box>;
}

export default TimeCell;