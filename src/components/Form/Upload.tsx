import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const NONE_FILE_STRING = "Nenhum arquivo selecionado";

interface UploadButtonProps {
    id: string;
    onFileChange?: (base64?: string) => void;
}

const convertToBase64 = (file: File):Promise<string|undefined> => {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve((reader.result as string) ?? undefined);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
 }

const UploadButton:React.FC<UploadButtonProps> = ({id, onFileChange}:UploadButtonProps) => {

    const [fileName, setFileName] = useState<string>(NONE_FILE_STRING);
    const [hasFile, setHasFile] = useState<boolean>(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            setFileName(NONE_FILE_STRING);
            setHasFile(false);
            if (onFileChange) {
                onFileChange(undefined);
            }
            return;
        }

        const file = event.target.files[0];
        setFileName(file.name);
        setHasFile(true);
        if (onFileChange) {
            convertToBase64(file).then((base64?: string) => {
                onFileChange(base64);
            });

        }
    };

    const handleClearField = () => {
        setFileName(NONE_FILE_STRING);
        setHasFile(false);
        if (onFileChange) {
            onFileChange(undefined);
        }
    };
    
    return <>
        <input accept="image/*" onChange={handleFileUpload} id={id+"-input"} style={{display:'none'}} type="file" />
        <TextField 
            sx={{width:"100%"}} 
            label="Outlined" 
            value={fileName} 
            InputProps={{
                readOnly: true,
                endAdornment: <Stack direction="row" spacing={1} sx={{ml:1}}>
                    <Box>
                        {hasFile ? <Button onClick={handleClearField} variant="contained" color="error" sx={{minWidth:"1rem", width:"1rem"}}>
                            <CloseIcon />
                        </Button> : null}
                    </Box>
                    <label htmlFor={id+"-input"}>
                        <Button variant="contained" color="primary" component="span">
                            Upload
                        </Button>
                    </label>
                </Stack>
            }}
        />
    </>
};

export default UploadButton;