import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

function Filters() {
  return (
    <>
      <Box borderBottom={1} borderColor="grey.300" paddingX={3}>
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <Link href="#" underline="none">
              <Typography
                variant="subtitle2"
                paddingY={1}
                marginTop="2px"
                borderBottom="2px solid black"
                color="black"
              >
                Balanced
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" underline="none">
              <Typography
                variant="subtitle2"
                paddingY={1}
                marginTop="2px"
                borderBottom="2px solid white"
                sx={{ ":hover": { borderBottom: "2px solid #1976d2" } }}
              >
                Helpful
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" underline="none">
              <Typography
                variant="subtitle2"
                paddingY={1}
                marginTop="2px"
                borderBottom="2px solid white"
                sx={{ ":hover": { borderBottom: "2px solid #1976d2" } }}
              >
                Popular
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export { Filters };
