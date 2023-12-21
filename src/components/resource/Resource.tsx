import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ResourceProps } from "./types";

function Resource({ resource }: ResourceProps) {
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
            <Link href={resource.url} target="_blank" rel="noopener">
              <Box
                component="img"
                alt=""
                src={resource.image_url}
                sx={{
                  width: 112,
                  height: 112,
                  borderRadius: 4,
                  objectFit: "cover",
                }}
              />
            </Link>
          </Grid>
          <Grid item xs container spacing={1} direction="column">
            <Grid item>
              <Box
                component="img"
                alt=""
                src={resource.favicon_url}
                sx={{ height: 20, width: "auto" }}
              />
            </Grid>
            <Grid item>
              <Link href={resource.url} variant="h6" underline="none" color="text-primary" target="_blank" rel="noopener">
                {resource.title}
              </Link>
            </Grid>
            <Grid item>
              <Typography variant="body2">{resource.description}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export { Resource };
