import { useSelector } from "react-redux";

const useAdminAuth = () => {
  const { admin, accessToken } = useSelector((state) => state.admin);

  return {
    isAdminLoggedIn: !!accessToken,
    admin,
    accessToken,
  };
};

export default useAdminAuth;
