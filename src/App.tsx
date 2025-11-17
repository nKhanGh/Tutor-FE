import { BrowserRouter } from 'react-router-dom';
import AppRoutesWrapper from './routes/AppRouteWrapper';
import { NotificationProvider } from './contexts/NotificationProvider';

const App = () => {
    return (
        <NotificationProvider>
            <BrowserRouter>
                <AppRoutesWrapper />
            </BrowserRouter>
        </NotificationProvider>
    );
};

export default App;
