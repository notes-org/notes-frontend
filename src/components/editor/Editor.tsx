import React, { FormEventHandler, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { EditorProps } from "./types";
import { useApiClient } from "../../hooks/useApiClient";
import ReactQuill from 'react-quill';
import { DeltaStatic, Sources } from 'quill';
import 'react-quill/dist/quill.snow.css';
import Button from "@mui/material/Button";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const DEFAULT_VALUE = "";

function Editor( { resource, onCreateNote }: EditorProps ) {

  const [value, setValue] = useState<ReactQuill.Value>(DEFAULT_VALUE);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [status, setStatus] = useState<string | null>(null);
  const api = useApiClient();

  useEffect( () => {
    if (!open) setStatus(null)
  }, [open])

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    setStatus("Submitting...")
    const newNote = await api.createNote({content: JSON.stringify(value) }, resource);
    if ( newNote ) {
      // TODO: handle errors
      setOpen(false);
      setValue(DEFAULT_VALUE);
      onCreateNote(newNote)
    }
    setStatus( newNote ? "Submitted" : "Oups, we're unable to submit...")
  };

  const handleChange = (value: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor): void => {
    console.debug("Editor change:", { value, delta, source, editor});
    setValue(value);
  }

  const handleCancel = () => {
    // Clear value before to close
    setValue(DEFAULT_VALUE);
    setOpen(false);
  }

  return (
    <>
      <Box sx={{ paddingX: 3, paddingY: 4, borderBottom: 1, borderColor: "grey.300" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            item
            xs
            container
            justifyContent="space-between"
            onClick={handleOpen}
            sx={{ cursor: "text" }}
          >
            <Typography variant="subtitle1" color="text.secondary">
            {!resource.locked ? "Have any context to add?" : "Sorry, this resource can't be edited ..."}
            </Typography>
            {!resource.locked && <EditIcon sx={{ color: "text.secondary" }}/>}
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}       
      >
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            className="flex flex-col gap-2"
            onSubmit={handleSubmit}
          >
            <ReactQuill
              theme="snow"
              value={value}
              onChange={handleChange}
              className="flex-auto"
              placeholder="Type something here..."
            />
            <Box className="flex-200px flex gap-2 justify-end">
              <Button variant="outlined" onClick={handleCancel}>Cancel</Button>              
              <Button variant="contained" type="submit">Submit</Button>
            </Box>
            <p>{status}</p>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { Editor };
