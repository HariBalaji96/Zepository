import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import AssetDetails from "./pages/AssetDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AddAsset from "./pages/AddAsset";
import EditAsset from "./pages/EditAsset";

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

        {/* EDIT ASSET (new) */}
        <Route
          path="/assets/:id/edit"
          element={
            <ProtectedRoute>
              <EditAsset />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
