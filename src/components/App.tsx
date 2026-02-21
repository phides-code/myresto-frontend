import { AdminKeyProvider } from '../context/AdminKeyContext';
import { AdminKeyValidityProvider } from '../context/AdminKeyValidityContext';
import AdminKeyValidator from '../features/adminKey/AdminKeyValidator';
import Menuitems from '../features/menuitems/Menuitems';

export const App = () => {
    return (
        <div>
            <AdminKeyProvider>
                <AdminKeyValidityProvider>
                    <AdminKeyValidator />
                    <Menuitems />
                </AdminKeyValidityProvider>
            </AdminKeyProvider>
        </div>
    );
};
