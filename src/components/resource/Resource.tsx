import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ResourceProps } from "./types";
import { formatUrl } from "../../utils/Url";

function Resource({ resource }: ResourceProps) {
  const { hostname, path } = formatUrl(resource.url);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          borderBottom: 1,
          borderColor: "grey.300",
          padding: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Link
              href={resource.url}
              underline="none"
              target="_blank"
              rel="noopener"
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  component="img"
                  alt=""
                  src={resource.favicon_url}
                  sx={{
                    height: 16,
                    width: "auto",
                    marginRight: 1,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "PT Serif",
                    width: "100%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {resource.title}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", marginTop: 0.5, maxWidth: "90%" }}>
                <Typography
                  component="span"
                  sx={{ color: "#4d5156;", fontSize: 13, fontWeight: 700 }}
                >
                  {hostname}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    color: "#4d5156;",
                    fontSize: 13,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  &nbsp;{path}
                </Typography>
              </Box>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{resource.description}</Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export { Resource };
