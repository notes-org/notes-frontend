import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { EditorState } from "lexical";
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import SubmitButtonPlugin from "../lexical/SubmitButtonPlugin";
import AutoFocusPlugin from "../lexical/AutoFocusPlugin";
import { EditorProps } from "./types";
import { useApiClient } from "../../hooks/useApiClient";

function Editor( { resource }: EditorProps ) {
  const composerConfig: InitialConfigType = {
    namespace: 'notes', 
    // theme: composerTheme, // to override theme if needed
    onError: console.error,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const api = useApiClient();

  const handleSubmit = async (editorState: EditorState) => {
    await api.createNote({content: JSON.stringify(editorState.toJSON()) }, resource);
    // TODO: handle errors
    setOpen(false);
    // TODO: re-fetch data instead of refreshing the page.
    //       This can be done using a context or global state
    window.location.reload();
  };

  const handleChange = (editorState: EditorState /*, editor: LexicalEditor, tags: Set<string>*/) => {
    console.log(`Editor content changed:\n${JSON.stringify(editorState, null, '  ')}`);
    // TODO: validate data
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 10,
            outline: "none",
            backgroundColor: "background.paper",
          }}
        >
          <Box component="form" sx={{ width: 550 }}>
            <LexicalComposer initialConfig={composerConfig}>
              <RichTextPlugin
                placeholder={null}
                contentEditable={<ContentEditable />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <OnChangePlugin onChange={handleChange} />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <SubmitButtonPlugin onSubmit={handleSubmit}/>
            </LexicalComposer>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export { Editor };
