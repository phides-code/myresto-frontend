import {
    createContext,
    useCallback,
    useContext,
    useRef,
    type ReactNode,
} from 'react';

interface AdminKeyContextState {
    getAdminKey: () => string;
    setAdminKey: (v: string) => void;
}

const AdminKeyContext = createContext<AdminKeyContextState>({
    getAdminKey: () => '',
    setAdminKey: () => {
        /* empty */
    },
});

interface AdminKeyProviderProps {
    children: ReactNode;
}

export const AdminKeyProvider = ({ children }: AdminKeyProviderProps) => {
    const keyRef = useRef('');

    const setAdminKey = useCallback((v: string) => {
        keyRef.current = v;
    }, []);

    const getAdminKey = useCallback(() => keyRef.current, []);

    return (
        <AdminKeyContext.Provider value={{ getAdminKey, setAdminKey }}>
            {children}
        </AdminKeyContext.Provider>
    );
};

export const useAdminKey = () => {
    return useContext(AdminKeyContext);
};
