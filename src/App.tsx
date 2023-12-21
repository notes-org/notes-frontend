import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Notes from "./pages/Notes"
import NotFound from "./pages/404";
import { ROUTER_PATH } from "./config";

function App() {
  return (
    <Routes>
      <Route path={ROUTER_PATH.HOME} element={<Home />} />
      <Route path={ROUTER_PATH.NOTES} element={<Notes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
