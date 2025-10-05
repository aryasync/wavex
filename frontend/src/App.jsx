import { Routes, Route, useLocation } from "react-router-dom";
import ImageConfirmationPage from "./ImageConfirmationPage";
import CalendarPage from "./CalendarPage";
import NotificationsPage from "./NotificationsPage";
import ManualInputPage from "./ManualInputPage";
import FridgePage from "./pages/FridgePage";
import DarkThemeLayout from "./components/DarkThemeLayout";
import { ItemsProvider } from "./providers/ItemsProvider";

function App() {
  const location = useLocation();

  // Get current page based on route
  const getCurrentPage = () => {
    const path = location.pathname;
    switch (path) {
      case '/': return 'home';
      case '/calendar': return 'calendar';
      case '/notifications': return 'notifications';
      case '/manual-input': return 'manual-input';
      case '/image-confirmation': return 'image-confirmation';
      default: return 'home';
    }
  };



  return (
    <ItemsProvider>
      <DarkThemeLayout 
        title="WaveX" 
        currentPage={getCurrentPage()}
      >
        <Routes>
          <Route path="/" element={<FridgePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/manual-input" element={<ManualInputPage />} />
          <Route path="/image-confirmation" element={<ImageConfirmationPage />} />
        </Routes>
      </DarkThemeLayout>
    </ItemsProvider>
  );
}

export default App;