import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import AssetDetails from "./pages/AssetDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AddAsset from "./pages/AddAsset";
import EditAsset from "./pages/EditAsset";
import SendToService from "./pages/SendToService";
import UnderService from "./pages/ServiceList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <Assets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/:id"
          element={
            <ProtectedRoute>
              <AssetDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddAsset />
            </ProtectedRoute>
          }
        />

        {/* EDIT ASSET */}
        <Route
          path="/assets/:id/edit"
          element={
            <ProtectedRoute>
              <EditAsset />
            </ProtectedRoute>
          }
        />

        {/* Send Service */}
        <Route
          path="/service/send/:id"
          element={
            <ProtectedRoute>
              <SendToService />
            </ProtectedRoute>
          }
        />
        {/* List of Asset send for Service */}
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <UnderService />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
