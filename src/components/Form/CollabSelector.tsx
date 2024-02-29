import { useEffect, useMemo, useState } from 'react';
import { useTheme } from "@mui/material/styles";
import { v4 as uuid } from 'uuid';
import { Check, Close, Delete, Edit } from '@mui/icons-material';
import { Avatar, Box, Button, Chip, ClickAwayListener, Paper, Stack, TextField, Typography } from '@mui/material';
import { grey, red, blue, green, yellow, orange, purple, brown } from '@mui/material/colors';

import { CollabItem } from '../../types/collab';
import { useCollabs } from "../../contexts/collabs";
import useLongPress, { LongPressEvent } from '../../hooks/useLongPress';

const AVAILABLE_COLORS:string[] = [grey[500], blue[500], red[500], green[500], yellow[500], orange[500], purple[500], brown[500]];

interface CollabSelectorProps {
    onChange?: (collabs: CollabItem[]) => void;
    value?: CollabItem[];
    error?: string;
}

const CollabSelector:React.FC<CollabSelectorProps> = ({onChange, value, error}:CollabSelectorProps) => {

    const [dataFilter, setDataFilter] = useState<string>("");
    const [showSelect, setShowSelect] = useState<boolean>(false);
    const [dataNewName, setDataNewName] = useState<string>("");
    const [colorIndex, setColorIndex] = useState<number>(0);
    const [collabHoverId, setCollabHoverId] = useState<string>("");
    const [editingId, setEditingId] = useState<string>("");
    const [selectedCollabs, setSelectedCollabs] = useState<CollabItem[]>([]);

    const { collabs, saveCollab, deleteCollab, getCollabs } = useCollabs();
    const theme = useTheme();
    const longPress = useLongPress();


    const handleChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDataFilter(event.target.value);
    }

    const  handleOpen = () => {
        setShowSelect(true);
    }

    const  handleClose = () => {
        setShowSelect(false);
    }

    const handleChangeColor = () => {
        setColorIndex(index => (index + 1) % AVAILABLE_COLORS.length);
    }

    const handleSaveCollab = () => {
        if (!dataNewName) return;

        let usedColor = AVAILABLE_COLORS[colorIndex]
        if (!colorIndex) {
            usedColor = AVAILABLE_COLORS[(collabs.length % (AVAILABLE_COLORS.length-1)) + 1]
        }

        saveCollab({
            id: editingId || uuid(),
            name: dataNewName,
            color: usedColor
        });
        
        setDataNewName("");
        setColorIndex(0);
    }

    const handleEditCollab = (id: string) => {
        setEditingId(id || "");
        setDataNewName(collabs.find(collab => collab.id === id)?.name || "");
        setColorIndex((AVAILABLE_COLORS).indexOf(collabs.find(collab => collab.id === id)?.color ?? '') || 0);
    }

    const handleCancelEditCollab = () => {
        setEditingId("");
        setDataNewName("");
        setColorIndex(0);
    }

    const handleSelectCollab = (id: string) => {
        setSelectedCollabs(selectedCollabs => {
            let result:CollabItem[] = [];
            let collab = collabs.find(c => c.id === id) as CollabItem;
            if (collab && !selectedCollabs.find(c => c.id === id)) {
                result = [...selectedCollabs, collab];
            } else {
                result = collabs;
            }

            if (onChange) {
                onChange(result || []);
            }

            return result;
        });
        handleClose();
    }

    const handleRemoveSelectedCollab = (id: string) => {
        setSelectedCollabs(selectedCollabs => {
            let result = selectedCollabs.filter(collab => collab.id !== id);

            if (onChange) {
                onChange(result || []);
            }

            return result;
        });
    }

    const handleDeleteCollab = (id: string) => {
        deleteCollab({id, name:"", color:""});
    }

    const handleShowCollabControllers = (id: string) => {
        setCollabHoverId(id);
    }


    const memoCollabsAvailable = useMemo(() => {
        const available = collabs.filter(collab => !selectedCollabs.find(selected => selected.id === collab.id));
        if  (dataFilter) {
            return available.filter(collab => collab.name.toLowerCase().includes(dataFilter.toLowerCase()));
        }

        return available;
    }, [collabs, dataFilter, selectedCollabs]);


    useEffect(() => {
        longPress.setOnLongPress((event:LongPressEvent) => {
            handleShowCollabControllers((event.target as HTMLElement).getAttribute("data-id") || "");
        });
        longPress.setOnClick((event:LongPressEvent) => {
            handleSelectCollab((event.target as HTMLElement).getAttribute("data-id") || "");
        });
        longPress.setOnFinish(() => {
            setCollabHoverId("");
        });
    }, [collabs]);

    useEffect(() => {
        getCollabs();
    }, []);

    useEffect(() => {
        if (value) {
            setSelectedCollabs(value);
        }
    }, [value]);

    return <>
        <ClickAwayListener onClickAway={handleClose} >
            <Box position="relative">
                <TextField value={dataFilter} label="Colaboradores" sx={{width:1}} onChange={handleChangeFilter} onFocus={handleOpen} />
                {showSelect ? (
                    <Paper sx={{position:"absolute", zIndex:3, top: "100%", left: 0, right: 0, maxHeight:"16.5rem", overflow:"auto"}}>
                        {memoCollabsAvailable.length > 0 ? memoCollabsAvailable.map(collab => <Stack 
                                alignItems="center" 
                                data-id={collab.id} 
                                direction="row" 
                                key={collab.id}
                                spacing={1} 
                                sx={{p:1, cursor:"pointer", height:"2rem", "&:hover": {bgcolor:theme.palette.action.hover}}}
                                {...longPress.componentEvents} 
                                onMouseEnter={()=>handleShowCollabControllers(collab.id)} 
                        >
                            <Avatar data-id={collab.id} sx={{width:"2rem", height:"2rem", bgcolor:collab.color}} onClick={handleChangeColor}>{collab.name.substring(0,1).toUpperCase()}</Avatar>
                            <Typography data-id={collab.id} variant="body1" component="div" sx={{flexGrow:1}}>{collab.name}</Typography>
                            {collabHoverId === collab.id ? <>
                                <Button color="info" variant="text" onClick={()=>handleEditCollab(collab.id)} sx={{width:"2rem", minWidth:"2rem"}}>
                                    <Edit />
                                </Button>
                                <Button color="error" variant="text" onClick={()=>handleDeleteCollab(collab.id)} onTouchEnd={()=>handleDeleteCollab(collab.id)} sx={{width:"2rem", minWidth:"2rem"}}>
                                    <Delete />
                                </Button>
                            </> : null}
                        </Stack>) : <Stack direction="row" alignItems="center" spacing={1} sx={{p:1}}>
                            <Typography color={grey[500]} align="center" variant="body1" component="div" sx={{flexGrow:1, height:"2rem",}}>
                                Nenhum colaborador para selecionar
                            </Typography>
                        </Stack>}
                        <Stack direction="row" alignItems="center" spacing={1} sx={{p:1, height:"2rem"}}>
                            <Avatar sx={{width:"2rem", height:"2rem", bgcolor:AVAILABLE_COLORS[colorIndex], cursor:"pointer"}} onClick={handleChangeColor}>N</Avatar>
                            <TextField size="small" value={dataNewName} label="Novo colaborador" onChange={(event) => setDataNewName(event.target.value)} sx={{flexGrow:1}} />
                            {editingId ? <Button color="error" variant="text" onClick={()=>handleCancelEditCollab()} sx={{width:"2rem", minWidth:"2rem"}}>
                                <Close />
                            </Button> : null}
                            <Button color="success" disabled={!dataNewName} variant="text" onClick={handleSaveCollab} sx={{width:"2rem", minWidth:"2rem"}}>
                                <Check />
                            </Button>
                        </Stack>
                    </Paper>
                ) : null}
            </Box>
        </ClickAwayListener>
        <Box sx={{width:"100%"}}>
            {error ? <Typography color={"error"} align="center" variant="body1" component="div" sx={{flexGrow:1, height:"2rem", mb:1}}>
                {error}
            </Typography> : <>
                {selectedCollabs.length > 0 ? selectedCollabs.map(collab => <Chip sx={{mr:1, mb:1}}
                    key={collab.id}
                    avatar={<Avatar sx={{bgcolor:collab.color}}>{collab.name.substring(0,1).toUpperCase()}</Avatar>}
                    label={collab.name}
                    onDelete={()=>handleRemoveSelectedCollab(collab.id)}
                    deleteIcon={<Close />}
                />) : <Typography color={grey[500]} align="center" variant="body1" component="div" sx={{flexGrow:1, height:"2rem", mb:1}}>
                    Nenhum colaborador selecionado
                </Typography>}
            </>}
        </Box>
    </>
};

export default CollabSelector;