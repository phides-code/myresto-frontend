import { useContext, useEffect, useRef } from 'react';
import {
    adminKeyApiSlice,
    useLazyValidateAdminKeyQuery,
} from './adminKeyApiSlice';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';
import { useAdminKey } from '../../context/AdminKeyContext';
import { useAppDispatch } from '../../app/hooks';

const AdminKeyValidator = () => {
    const { setAdminKey } = useAdminKey();

    const { adminKeyValid, setAdminKeyValid } = useContext(
        AdminKeyValidityContext,
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();

    const [triggerValidateAdminKey, { data, isError, isLoading }] =
        useLazyValidateAdminKeyQuery();

    const adminKeyValidityResponse = data?.data as boolean;

    const formDisabled = adminKeyValidityResponse || adminKeyValid || isLoading;

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const adminKeyFromInput = inputRef.current?.value ?? '';
        setAdminKey(adminKeyFromInput);

        try {
            const validationResult =
                await triggerValidateAdminKey(adminKeyFromInput).unwrap();

            if (validationResult.data) {
                sessionStorage.setItem('adminKey', adminKeyFromInput);
                setAdminKeyValid(true);
            }
        } catch (error) {
            console.error('Error validating adminKey:', error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminKey');
        setAdminKey('');
        setAdminKeyValid(false);
        dispatch(adminKeyApiSlice.util.resetApiState()); // Clears RTK Query cache

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    useEffect(() => {
        const saved = sessionStorage.getItem('adminKey');
        if (saved) {
            setAdminKey(saved);
            setAdminKeyValid(true);

            if (inputRef.current) {
                inputRef.current.value = saved;
            }
        }
    }, [setAdminKey, setAdminKeyValid]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset disabled={formDisabled}>
                    <div>
                        <label htmlFor='adminKey'>Admin key:</label>
                        <input
                            type='password'
                            id='adminKey'
                            name='adminKey'
                            required
                            placeholder='Enter admin key'
                            ref={inputRef}
                        />
                        <button type='submit'>Verify</button>
                    </div>
                </fieldset>
            </form>
            {isError && <div>Error validating admin key</div>}
            {isLoading && <div>...</div>}
            {adminKeyValidityResponse || adminKeyValid ? (
                <div>
                    <div>Admin key OK</div>
                    <div>
                        <button type='button' onClick={handleLogout}>
                            Log out
                        </button>
                    </div>
                </div>
            ) : (
                <div>Please enter a valid admin key</div>
            )}
        </div>
    );
};

export default AdminKeyValidator;
