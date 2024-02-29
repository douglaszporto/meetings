import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AppBar, Box, Button, ButtonGroup, Drawer, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Toolbar, Typography } from "@mui/material";

import Form from "./Form";
import { useCollabs } from "../contexts/collabs";
import { useCurrentDate } from "../contexts/currentDate";
import { useEvents } from "../contexts/events";

const Header = () => {
    const [currentCollab, setCurrentCollab] = useState<string>("");
    const [formOpened, setFormOpened] = useState<boolean>(false);

    const { eventId, setEventId, setCollabId } = useEvents();
    const { collabs, getCollabs } = useCollabs();
    const { currentDate, setCurrentDate } = useCurrentDate();


    const handleChangeCollab = (event: SelectChangeEvent<string>) => {
        setCurrentCollab(event.target.value as string);
        setCollabId((event.target.value as string) || undefined);
    };

    const handleNextWeek = () => {
        setCurrentDate(currentDate.add(1, 'week'));
    }

    const handlePreviousWeek = () => {
        setCurrentDate(currentDate.subtract(1, 'week'));
    }

    const handleOpenDrawer = () => {
        setFormOpened(true);
    };

    const handleCloseDrawer = () => {
        setFormOpened(false);
        setEventId(undefined);
    };

    const handleOpenNew = () => {
        handleOpenDrawer();
    };


    const memoStartOfWeek = useMemo(() => {
        return currentDate.startOf('week').format("L");
    }, [currentDate]);

    const memoEndOfWeek = useMemo(() => {
        return currentDate.endOf('week').format("L");
    }, [currentDate]);


    useEffect(()=>{
        getCollabs();
    }, []);

    useEffect(()=>{
        if (eventId) {
            handleOpenDrawer();
        }
    }, [eventId]);


    return <>
        <AppBar position="static">
            <Toolbar disableGutters>
                <Stack direction={{xs:"column", md:"row"}} sx={{width:"100%"}}>
                    <Typography variant="h5" component="div" sx={{flexGrow: 1, p:"1rem 0 0 1rem"}}>
                        Meetings
                    </Typography>
                    <Stack direction={{xs:"column", md:"row"}} sx={{p:2}} gap={{xs:1, md:2}} alignItems="center" >
                        <Stack direction="row" alignItems="center" gap={1} sx={{width:{xs:"100%", md:"auto"}}}>
                            <Typography variant="h6" component="div" sx={{display:{xs:"none",md:"block"}}}>
                                De {memoStartOfWeek} até {memoEndOfWeek}
                            </Typography>
                            <Typography variant="subtitle1" component="div" sx={{flex:1, display:{xs:"block",md:"none"}}}>
                                {memoStartOfWeek} - {memoEndOfWeek}
                            </Typography>
                            <ButtonGroup size="small" variant="outlined" color="primary" sx={{mr:{md:2}}}>
                                <Button aria-label="Semana anterior" onClick={handlePreviousWeek} >
                                    <ChevronLeft />
                                </Button>
                                <Button aria-label="Semana anterior" onClick={handleNextWeek} >
                                    <ChevronRight />
                                </Button>
                            </ButtonGroup>
                        </Stack>
                        <Stack direction="row" gap={1} sx={{width:{xs:"100%", md:"auto"}}}>
                            <Box sx={{minWidth: {xs:150, md:200}, flex: {xs:1, md:"auto"}}}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="header-collab-select">Colaborador</InputLabel>
                                    <Select labelId="header-collab-select" value={currentCollab} label="Colaborador" onChange={handleChangeCollab}>
                                        <MenuItem value="">Todos</MenuItem>
                                        {collabs.map((collab, index) => <MenuItem key={index} value={collab.id}>{collab.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box>
                                <Button variant="contained" color="primary" onClick={handleOpenNew}>
                                    Nova reunião
                                </Button>
                            </Box>
                        </Stack>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
        <Drawer
            anchor="right"
            open={formOpened}
            onClose={handleCloseDrawer}
          >
            <Form onClose={handleCloseDrawer} />
          </Drawer>
    </>
}

export default Header;