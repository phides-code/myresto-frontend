import { BrowserRouter, Route, Routes } from 'react-router';
import { AdminKeyProvider } from '../context/AdminKeyContext';
import { AdminKeyValidityProvider } from '../context/AdminKeyValidityContext';
import AdminKeyValidator from '../features/adminKey/AdminKeyValidator';
import Menuitems from '../features/menuitems/Menuitems';
import MainNav from './MainNav';
import MainPage from './MainPage';

export const App = () => {
    return (
        <BrowserRouter>
            <AdminKeyProvider>
                <AdminKeyValidityProvider>
                    <AdminKeyValidator />
                    <MainNav />
                    <Routes>
                        <Route path='/' element={<MainPage />} />
                        <Route path='/menuitems/*' element={<Menuitems />} />
                    </Routes>
                </AdminKeyValidityProvider>
            </AdminKeyProvider>
        </BrowserRouter>
    );
};
