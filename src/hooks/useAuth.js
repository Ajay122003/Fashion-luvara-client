import { useSelector } from "react-redux";

const useAuth = () => {
  const auth = useSelector((state) => state.auth);

  if (!auth) {
    return { user: null, isLoggedIn: false };
  }

  return {
    user: auth.user,
    isLoggedIn: Boolean(auth.user),
  };
};

export default useAuth;
