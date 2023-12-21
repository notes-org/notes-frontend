import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { NoteProps } from "./types";

function Note({ note }: NoteProps) {

  const composerConfig: InitialConfigType = {
    namespace: 'notes', 
    onError: console.error,
    editorState: JSON.stringify(note.content),
    editable: false,
  };

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          borderBottom: 1,
          borderColor: "grey.300",
          padding: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs="auto">
            <Avatar />
          </Grid>
          <Grid item xs container spacing={2} direction="column">
            <Grid item xs container spacing={1} direction="column">
              <Grid item xs container spacing={1} alignItems="center">
                <Grid item>
                  <Typography variant="subtitle2">Jimbo Jimmy-John</Typography>
                </Grid>
                <Grid item>
                  {/* <Typography variant="caption">3 hours ago</Typography> */}
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="body2" sx={{whiteSpace: "pre-line"}}>
                  <LexicalComposer initialConfig={composerConfig}>
                    <RichTextPlugin
                      placeholder={null}
                      contentEditable={<ContentEditable/>}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                  </LexicalComposer>
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs container spacing={2} justifyContent="right" alignItems="center">
              <Grid item>
                <Typography variant="caption">Did you find this helpful?</Typography>
              </Grid>
              <Grid item>
                <Button variant="outlined" size="small">Rate It</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export { Note };
