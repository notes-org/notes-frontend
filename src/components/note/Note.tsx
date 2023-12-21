import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { NoteProps } from "./types";
import { formatDate } from "../../utils/DateTime";

function Note({ note }: NoteProps) {
  const composerConfig: InitialConfigType = {
    namespace: "notes",
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
          <Grid item xs container spacing={2} direction="column">
            <Grid item xs container spacing={1} direction="column">
              <Grid item xs container spacing={1} alignItems="center">
                <Grid item>
                  <Box display="flex" alignItems="center">
                    <Link href="#" underline="hover">
                      <Typography variant="subtitle2">
                        Jimbo Jimmy-John
                      </Typography>
                    </Link>
                  </Box>
                </Grid>
                <Grid item>
                  <Box display="flex" alignItems="center">
                    <Typography variant="caption" color="text.secondary">&#183;</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box display="flex" alignItems="center">
                    <Typography variant="caption" color="text.secondary">{formatDate(note.created_at)}</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  <LexicalComposer initialConfig={composerConfig}>
                    <RichTextPlugin
                      placeholder={null}
                      contentEditable={<ContentEditable />}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                  </LexicalComposer>
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              xs
              container
              spacing={2}
              alignItems="center"
              justifyContent="right"
            >
              <Grid item>
                <Link href="#" underline="none">
                  <Typography
                    variant="caption"
                    padding={1}
                    borderRadius={1}
                    sx={{ ":hover": { backgroundColor: "#eaf4ff" } }}
                  >
                    Rate
                  </Typography>
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" underline="none">
                  <Typography
                    variant="caption"
                    padding={1}
                    borderRadius={1}
                    sx={{ ":hover": { backgroundColor: "#eaf4ff" } }}
                  >
                    References
                  </Typography>
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" underline="none">
                  <Typography
                    variant="caption"
                    padding={1}
                    borderRadius={1}
                    sx={{ ":hover": { backgroundColor: "#f3f3f3" } }}
                    color="black"
                  >
                    <MoreHorizIcon />
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export { Note };
