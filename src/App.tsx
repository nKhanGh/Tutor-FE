import { BrowserRouter } from 'react-router-dom';
import AppRoutesWrapper from './routes/AppRouteWrapper';

const App = () => {
    return (
        <BrowserRouter>
            <AppRoutesWrapper />
        </BrowserRouter>
    );
};

export default App;
