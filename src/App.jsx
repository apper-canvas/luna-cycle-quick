import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BottomNav from "@/components/molecules/BottomNav";
import TodayPage from "@/components/pages/TodayPage";
import CalendarPage from "@/components/pages/CalendarPage";
import InsightsPage from "@/components/pages/InsightsPage";
import ProfilePage from "@/components/pages/ProfilePage";
import CustomizationsPage from "@/components/pages/CustomizationsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<TodayPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/insights" element={<InsightsPage />} />
<Route path="/profile" element={<ProfilePage />} />
            <Route path="/customizations" element={<CustomizationsPage />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;