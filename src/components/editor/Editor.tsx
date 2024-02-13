import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import EditIcon from "@mui/icons-material/Edit";
import { ApiClient } from "../../utils/ApiClient";
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $createTextNode, $getRoot, EditorState /*, $createParagraphNode*/ } from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import SubmitButtonPlugin from "../lexical/SubmitButtonPlugin";
import AutoFocusPlugin from "../lexical/AutoFocusPlugin";
import { EditorProps } from "./types";
import { FormattingToolBarPlugin } from "../lexical/FormattingToolBarPlugin";
import { composerBaseConfig } from "./composerBaseConfig";
import { DialogContent, DialogTitle } from "@mui/material";

/**
 * Function to give to composerConfig to initialize editorState
 */
function prepopulatedRichText() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {

    // Heading Template
    const heading = $createHeadingNode('h1');
    heading.append($createTextNode('Your title here...'));
    root.append(heading);

    // Note Template
    const quote = $createQuoteNode();
    quote.append(
      $createTextNode(
        'Enter your note here... '
      ),
    );
    root.append(quote);
    
    // Can't make the following like work, investigate.
    // const paragraph = $createParagraphNode();
    //paragraph.append(
    //  $createTextNode('Enter your note here... '),
    //  $createTextNode('@lexical/react').toggleFormat('code'),
    //  $createTextNode('.'),
    //  $createTextNode(' Try typing in '),
    //  $createTextNode('some text').toggleFormat('bold'),
    //  $createTextNode(' with '),
    //  $createTextNode('different').toggleFormat('italic'),
    //  $createTextNode(' formats.'),
    //);
    //root.append(paragraph);
  }
}

function Editor({ resource }: EditorProps) {
  const composerConfig: InitialConfigType = {
    ...composerBaseConfig,
    editable: true,
    editorState: prepopulatedRichText
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (editorState: EditorState) => {
    await ApiClient.createNote({ content: JSON.stringify(editorState.toJSON()) }, resource);
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
            {!resource.locked && <EditIcon sx={{ color: "text.secondary" }} className="cursor-pointer" />}
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle>Create a Note</DialogTitle>
        <DialogContent>
          <LexicalComposer initialConfig={composerConfig}>
            <FormattingToolBarPlugin />
            <RichTextPlugin
              placeholder={null}
              contentEditable={
                <ContentEditable className="m-2 p-2 border" />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleChange} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <SubmitButtonPlugin onSubmit={handleSubmit} />
          </LexicalComposer>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { Editor };
