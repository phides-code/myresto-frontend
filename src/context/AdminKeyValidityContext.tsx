import type { ReactNode } from 'react';
import { createContext, useMemo, useState } from 'react';

interface AdminKeyValidityContextState {
    adminKeyValid: boolean;
    setAdminKeyValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminKeyValidityContext = createContext<AdminKeyValidityContextState>({
    adminKeyValid: false,
    setAdminKeyValid: () => {
        /* empty */
    },
});

interface AdminKeyValidityProviderProps {
    children: ReactNode;
}

const AdminKeyValidityProvider = ({
    children,
}: AdminKeyValidityProviderProps) => {
    const [adminKeyValid, setAdminKeyValid] = useState<boolean>(false);

    const value = useMemo(
        () => ({ adminKeyValid, setAdminKeyValid }),
        [adminKeyValid],
    );

    return (
        <AdminKeyValidityContext.Provider value={value}>
            {children}
        </AdminKeyValidityContext.Provider>
    );
};

export { AdminKeyValidityContext, AdminKeyValidityProvider };
