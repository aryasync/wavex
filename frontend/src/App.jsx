import { Routes, Route } from "react-router-dom";
import ImageConfirmationPage from "./ImageConfirmationPage";
import CalendarPage from "./CalendarPage";
import NotificationsPage from "./NotificationsPage";
import ManualInputPage from "./ManualInputPage";
import FridgePage from "./pages/FridgePage";
import { ItemsProvider } from "./providers/ItemsProvider";

function App() {
  return (
    <ItemsProvider>
      <Routes>
        <Route path="/" element={<FridgePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/manual-input" element={<ManualInputPage />} />
        <Route path="/image-confirmation" element={<ImageConfirmationPage />} />
      </Routes>
    </ItemsProvider>
  );
}

export default App;