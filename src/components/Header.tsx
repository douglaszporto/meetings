import { useState } from "react";
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AppBar, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Toolbar, Typography } from "@mui/material";


const Header = () => {
    const [collab, setCollab] = useState<string>('');

    const handleChangeCollab = (event: SelectChangeEvent<string>) => {
        setCollab(event.target.value as string);
    };

    return <AppBar position="static">
        <Toolbar>
            <Typography variant="h5" component="div" sx={{flexGrow: 1}}>
                Meetings
            </Typography>
            <Stack direction="row" sx={{p:2}} gap={2} >
                <Button variant="outlined" color="primary" aria-label="Semana anterior" sx={{ mr: 2 }}>
                    <ChevronLeft />
                </Button>
                <Button variant="outlined" color="primary" aria-label="Semana anterior" sx={{ mr: 2 }}>
                    <ChevronRight />
                </Button>
                <Box sx={{minWidth: 200}}>
                    <FormControl fullWidth>
                        <InputLabel id="header-collab-select">Colaborador</InputLabel>
                        <Select labelId="header-collab-select" value={collab} label="Colaborador" onChange={handleChangeCollab}>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button variant="contained" color="primary">
                    Nova reunião
                </Button>
            </Stack>
        </Toolbar>
    </AppBar>
}

export default Header;