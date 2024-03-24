import { Route, Routes } from "react-router-dom";
import Notes from "./pages/Notes";
import NotFound from "./pages/404";
import { ROUTER_PATH } from "./config";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { UserProvider } from "./contexts/UserContext";
import { AlertProvider } from "./contexts/AlertContext";
import { AlertOverlay } from "./components/alerts/AlertOverlay";

const theme = createTheme({
  typography: {
    fontFamily: "sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <AlertProvider>   
          <AlertOverlay/>       
          <Routes>
            <Route path={ROUTER_PATH.NOTES} element={<Notes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>          
        </AlertProvider>
      </UserProvider>      
    </ThemeProvider>
  );
}

export default App;
