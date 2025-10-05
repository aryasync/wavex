import { Routes, Route, useLocation } from "react-router-dom";
import ImageConfirmationPage from "./ImageConfirmationPage";
import NewItemsConfirmationPage from "./NewItemsConfirmationPage";
import CalendarPage from "./CalendarPage";
import NotificationsPage from "./NotificationsPage";
import Home from "./Home";
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
      case '/image-confirmation': return 'image-confirmation';
      case '/new-items-confirmation': return 'new-items-confirmation';
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
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/image-confirmation" element={<ImageConfirmationPage />} />
          <Route path="/new-items-confirmation" element={<NewItemsConfirmationPage />} />
        </Routes>
      </DarkThemeLayout>
    </ItemsProvider>
  );
}

export default App;