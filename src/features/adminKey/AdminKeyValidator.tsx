import { useContext } from 'react';
import { useLazyValidateAdminKeyQuery } from './adminKeyApiSlice';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';
import { useAdminKey } from '../../context/AdminKeyContext';

const AdminKeyValidator = () => {
    const { getAdminKey, setAdminKey } = useAdminKey();

    const { setAdminKeyValid } = useContext(AdminKeyValidityContext);

    const [triggerValidateAdminKey, { data, isError, isLoading }] =
        useLazyValidateAdminKeyQuery();

    const adminKeyValid = data?.data as boolean;

    const formDisabled = adminKeyValid || isLoading;

    const handleAdminKeyChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setAdminKey(ev.target.value);
    };

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const adminKey = getAdminKey();

        try {
            const validationResult =
                await triggerValidateAdminKey(adminKey).unwrap();

            if (validationResult.data) {
                setAdminKeyValid(true);
            }
        } catch (error) {
            console.error('Error validating adminKey:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='adminKey'>Admin key:</label>
                    <input
                        type='text'
                        id='adminKey'
                        name='adminKey'
                        required
                        placeholder='Enter admin key'
                        onChange={handleAdminKeyChange}
                        disabled={formDisabled}
                    />
                    <button type='submit' disabled={formDisabled}>
                        Verify
                    </button>
                </div>

                {isError && <div>Error validating admin key</div>}
                {isLoading && <div>...</div>}
                {adminKeyValid && <div>Admin key OK</div>}
                {!adminKeyValid && !isLoading && !isError && (
                    <div>Please enter a valid admin key</div>
                )}
            </form>
        </div>
    );
};

export default AdminKeyValidator;
