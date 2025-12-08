import { Navigate, Outlet, useLocation } from 'react-router-dom';
import paths from './paths';

const PrivateRoutes = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to={paths.login} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
