import { Route, Routes } from "react-router-dom";
import Notes from "./pages/Notes";
import NotFound from "./pages/404";
import { ROUTER_PATH, env} from "./config";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { ApiClient } from "./utils/ApiClient";

const theme = createTheme({
  typography: {
    fontFamily: "sans-serif",
  },
});

function App() {
  useEffect(() => {
    /** Temporary code to login automatically */
    ApiClient.login(env.USERNAME, env.PASSWORD)
      .then(() => console.debug(`${env.USERNAME} successfully logged`))
      .catch((reason: any) => console.error(`${env.USERNAME} log failed!`, JSON.stringify(reason)))
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path={ROUTER_PATH.NOTES} element={<Notes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
