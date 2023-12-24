import { Route, Routes } from "react-router-dom";
import Notes from "./pages/Notes";
import NotFound from "./pages/404";
import { ROUTER_PATH } from "./config";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "sans-serif",
  },
});

function App() {
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
