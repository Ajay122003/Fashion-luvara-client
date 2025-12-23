import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import storage from "../../utils/storage";

const PrivateRoute = ({ children }) => {
  const reduxToken = useSelector((state) => state.auth.token);
  const localToken = storage.getUserToken();

  // 🔥 Allow access if token exists ANYWHERE
  if (reduxToken || localToken) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;

