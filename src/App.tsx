import { BrowserRouter } from 'react-router-dom';
import AppRoutesWrapper from './routes/AppRouteWrapper';
import { NotificationProvider } from './contexts/NotificationProvider';
import { AuthProvider } from './contexts/AuthContext';

// Tạo một component wrapper riêng để sử dụng AuthProvider (vì AuthProvider cần Router)
const AppContent = () => {
    return (
        <AuthProvider>
            <AppRoutesWrapper />
        </AuthProvider>
    );
};

const App = () => {
    return (
        <NotificationProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </NotificationProvider>
    );
};

export default App;
