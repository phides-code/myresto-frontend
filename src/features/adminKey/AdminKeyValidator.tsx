import { useContext, useEffect, useRef } from 'react';
import { useLazyValidateAdminKeyQuery } from './adminKeyApiSlice';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';
import { useAdminKey } from '../../context/AdminKeyContext';

const AdminKeyValidator = () => {
    const { setAdminKey } = useAdminKey();

    const { adminKeyValid, setAdminKeyValid } = useContext(
        AdminKeyValidityContext,
    );

    const inputRef = useRef<HTMLInputElement>(null);

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
                <div>
                    <label htmlFor='adminKey'>Admin key:</label>
                    <input
                        type='password'
                        id='adminKey'
                        name='adminKey'
                        required
                        placeholder='Enter admin key'
                        disabled={formDisabled}
                        ref={inputRef}
                    />
                    <button type='submit' disabled={formDisabled}>
                        Verify
                    </button>
                </div>

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
            </form>
        </div>
    );
};

export default AdminKeyValidator;
