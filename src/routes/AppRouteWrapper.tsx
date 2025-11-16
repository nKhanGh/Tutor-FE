import { useRoutes } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';

const AppRoutesWrapper = () => {
    const routes = useRoutes(AppRoutes);
    return routes;
};

export default AppRoutesWrapper;
