import { HashRouter as Router, Route, Routes } from "react-router-dom";
import IntelligentSearchScreen from "../screens/IntelligentSearchScreen";
import ServiceRequestScreen from "../screens/ServiceRequestScreen";
import { AuthProvider } from "../context/AuthContext";

const RouterComponent = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/intelligent-search" element={<IntelligentSearchScreen />} />
          <Route path="/service-request" element={<ServiceRequestScreen />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default RouterComponent;