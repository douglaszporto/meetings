import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { NavigateNext } from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { Box, Breadcrumbs, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import UploadButton from './Form/Upload';
import CollabSelector from './Form/CollabSelector';
import { useEvents } from '../contexts/events';
import { CollabItem } from '../types/collab';

interface FormProps {
    onClose?: () => void;
}

const Form: React.FC<FormProps> = ({onClose}:FormProps) => {

    const [dataTitle, setDataTitle] = React.useState<string>("");
    const [dataDate, setDataDate] = React.useState<Dayjs|null>(dayjs());
    const [dataTime, setDataTime] = React.useState<Dayjs|null>(dayjs());
    const [dataDuration, setDataDuration] = React.useState<number>(1);
    const [dataCollabs, setDataCollabs] = React.useState<CollabItem[]>([]);
    const [dataPhoto, setDataPhoto] = React.useState<string>();
    const [validationTitle, setValidationTitle] = React.useState<string>();
    const [validationDate, setValidationDate] = React.useState<string>();
    const [validationTime, setValidationTime] = React.useState<string>();
    const [validationDuration, setValidationDuration] = React.useState<string>();
    const [validationCollabs, setValidationCollabs] = React.useState<string>();


    const { events, eventId, saveEvent, getEvents, deleteEvent } = useEvents();


    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDataTitle(event.target.value);
        setValidationTitle(undefined);
    };

    const handleChangeDate = (value: Dayjs|null) => {
        setDataDate(value);
        setValidationDate(undefined);
    };

    const handleChangeTime = (value: Dayjs|null) => {
        setDataTime(value);
        setValidationTime(undefined);
    };

    const handleChangeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
        let input = parseFloat(event.target.value.replace(/\D/g, '') || '1');
        
        if (input < 1) 
            input = 1;
        if (input > 12) 
            input = 12;

        setDataDuration(input);
        setValidationDuration(undefined);
    };

    const handleChangeCollabs = (collabs: CollabItem[]) => {
        setDataCollabs(collabs);
        setValidationCollabs(undefined);
    };

    const handleChangeFile = (photo?: string) => {
        setDataPhoto(photo);
    };

    const handleSubmitForm = () => {
        setValidationTitle(dataTitle ? undefined : "Este campo é obrigatório");
        setValidationDate(dataDate ? undefined : "Este campo é obrigatório");
        setValidationTime(dataTime ? undefined : "Este campo é obrigatório");
        setValidationDuration(dataDuration ? undefined : "Este campo é obrigatório");
        setValidationCollabs(dataCollabs.length ? undefined : "Este campo é obrigatório");

        if (!dataTitle || !dataDate || !dataTime || !dataCollabs.length) return;

        saveEvent({
            id: eventId ?? uuid(),
            title: dataTitle,
            date: dataDate ?? dayjs(),
            time: dataTime ?? dayjs(),
            duration: dataDuration ?? 1,
            collabs: dataCollabs,
            photo: dataPhoto
        });

        handleCloseForm();
    }

    const handleCloseForm = () => {
        if (onClose) {
            onClose();
        }
    }

    const handleDeleteEvent = () => {
        if (eventId) {
            deleteEvent({id: eventId} as any);
            handleCloseForm();
        }
    }


    useEffect(() => {
        getEvents();
    }, []);

    useEffect(() => {
        if (eventId) {
            let event = events.find(item => item.id === eventId);
            if (event) {
                setDataTitle(event.title);
                setDataDate(event.date);
                setDataTime(event.time);
                setDataDuration(event.duration);
                setDataCollabs(event.collabs);
                setDataPhoto(event.photo);
            }
        }
    }, [eventId]);


    return <>
        <Box sx={{height:"100%", width:{xs:"80vw", md:500, overflow:"auto"}}}>
            <Stack direction="column" spacing={2} sx={{pt:4, pl:4, pr:4, boxSizing:"border-box", height:"100%"}}>
                <Breadcrumbs separator={<NavigateNext />} aria-label="Título do formulário" sx={{mb:2}}>
                    <Typography variant="h5" component="div">
                        Reunião
                    </Typography>
                    <Typography variant="h5" component="div">
                        {eventId ? "Editar" : "Novo"}
                    </Typography>
                </Breadcrumbs>
                {dataPhoto ? <Box sx={{width:"100%", minHeight: "10rem", height:"10rem", bgcolor: "transparent", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <img src={dataPhoto} alt="Foto de Referência" style={{minWidth:"100%", minHeight:"100%", width:"100%", height:"auto"}} />
                </Box> : null}
                <TextField value={dataTitle} label="Objetivo" onChange={handleChangeTitle} helperText={validationTitle} error={Boolean(validationTitle)} />
                <Stack direction="row" spacing={2}>
                    <DatePicker value={dataDate} label="Data" onChange={handleChangeDate} sx={{flex:"3"}} />
                    <TimePicker value={dataTime} label="Hora" onChange={handleChangeTime} sx={{flex:"2"}} />
                    <TextField value={dataDuration} label="Duração" sx={{flex:"2"}} InputProps={{endAdornment: <InputAdornment position="end">horas</InputAdornment>,}} helperText={validationDuration} error={Boolean(validationDuration)} onChange={handleChangeDuration} />
                </Stack>
                <CollabSelector onChange={handleChangeCollabs} value={dataCollabs} error={validationCollabs} />
                <UploadButton id="photo-input" onFileChange={handleChangeFile} />
                <div style={{flex:1}}></div>
                <Box sx={{pb:4}}>
                    <Stack direction="row" spacing={2} >
                        <Button variant="contained" onClick={handleSubmitForm}>Salvar</Button>
                        <Button variant="outlined" onClick={handleCloseForm}>Cancelar</Button>
                        <Box sx={{flex:1}}></Box>
                        {eventId ? 
                            <Button variant="contained" color='error' onClick={handleDeleteEvent}>Excluir</Button>
                        : null}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    </>;
};

export default Form;