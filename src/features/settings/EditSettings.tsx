import { useContext, useEffect, useState } from 'react';
import {
    useGetSettingsQuery,
    usePostSettingsMutation,
} from './settingsApiSlice';
import type { ImageSource, Settings } from '../../types';
import { useAdminKey } from '../../context/AdminKeyContext';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';
import ImageUploader from '../images/ImageUploader';

const EditSettings = () => {
    const { adminKeyValid } = useContext(AdminKeyValidityContext);
    const {
        data,
        isError: isGetError,
        isLoading: isGetLoading,
        isFetching: isGetFetching,
        refetch: refetchQuery,
    } = useGetSettingsQuery();
    const [postSettings, { isLoading: isPostLoading, isError: isPostError }] =
        usePostSettingsMutation();
    const blankSettings: Settings = {
        bannerMessage: '',
        bannerImage: {
            originalName: '',
            uuidName: '',
        } as ImageSource,
        hoursMonday: '',
        hoursTuesday: '',
        hoursWednesday: '',
        hoursThursday: '',
        hoursFriday: '',
        hoursSaturday: '',
        hoursSunday: '',
        phone: '',
        email: '',
        address: '',
        instagram: '',
        facebook: '',
        tiktok: '',
    };

    const [showSuccess, setShowSuccess] = useState(false);

    const [updatedSettings, setUpdatedSettings] =
        useState<Settings>(blankSettings);

    const { getAdminKey } = useAdminKey();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof Settings,
    ) => {
        setUpdatedSettings((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Updating Settings:', updatedSettings);

        const adminKey = getAdminKey();

        try {
            const putResult = await postSettings({
                settings: updatedSettings,
                adminKey,
            }).unwrap();

            if (putResult.errorMessage) {
                throw new Error(putResult.errorMessage);
            }

            await refetchQuery();
            setShowSuccess(true);
        } catch (error) {
            console.error('Error adding settings:', error);
        }
    };

    const handleCancel = () => {
        setUpdatedSettings(settings as Settings);
    };

    const settings = data?.data;

    useEffect(() => {
        if (settings) {
            setUpdatedSettings(settings);
        }
    }, [settings]);

    const contentUnchanged =
        settings != null &&
        settings.bannerMessage === updatedSettings.bannerMessage &&
        settings.hoursMonday === updatedSettings.hoursMonday &&
        settings.hoursTuesday === updatedSettings.hoursTuesday &&
        settings.hoursWednesday === updatedSettings.hoursWednesday &&
        settings.hoursThursday === updatedSettings.hoursThursday &&
        settings.hoursFriday === updatedSettings.hoursFriday &&
        settings.hoursSaturday === updatedSettings.hoursSaturday &&
        settings.hoursSunday === updatedSettings.hoursSunday &&
        settings.phone === updatedSettings.phone &&
        settings.email === updatedSettings.email &&
        settings.address === updatedSettings.address &&
        settings.instagram === updatedSettings.instagram &&
        settings.facebook === updatedSettings.facebook &&
        settings.tiktok === updatedSettings.tiktok &&
        settings.bannerImage.uuidName === updatedSettings.bannerImage.uuidName;

    const isLoading = isPostLoading || isGetFetching;
    const submitDisabled = isLoading || contentUnchanged || !adminKeyValid;

    if (isGetLoading) {
        return <div>Loading...</div>;
    }
    if (isGetError || !settings) {
        return <div>Error loading settings.</div>;
    }

    return (
        <div>
            <p>Edit settings</p>

            <div>
                <form onSubmit={handleSubmit}>
                    <fieldset disabled={isLoading}>
                        <p>
                            <label htmlFor='bannerMessage'>
                                Banner Message:
                            </label>
                            <input
                                type='text'
                                id='bannerMessage'
                                name='bannerMessage'
                                value={updatedSettings.bannerMessage}
                                required
                                onChange={(e) => {
                                    handleChange(e, 'bannerMessage');
                                }}
                            />
                        </p>
                        <p>
                            <div>Open hours:</div>
                            <div>
                                <label htmlFor='hoursSunday'>Sunday:</label>
                                <input
                                    type='text'
                                    id='hoursSunday'
                                    name='hoursSunday'
                                    value={updatedSettings.hoursSunday}
                                    required
                                    onChange={(e) => {
                                        handleChange(e, 'hoursSunday');
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor='hoursMonday'>Monday:</label>
                                <input
                                    type='text'
                                    id='hoursMonday'
                                    name='hoursMonday'
                                    value={updatedSettings.hoursMonday}
                                    required
                                    onChange={(e) => {
                                        handleChange(e, 'hoursMonday');
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor='hoursTuesday'>Tuesday:</label>
                                <input
                                    type='text'
                                    id='hoursTuesday'
                                    name='hoursTuesday'
                                    value={updatedSettings.hoursTuesday}
                                    required
                                    onChange={(e) => {
                                        handleChange(e, 'hoursTuesday');
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor='hoursWednesday'>
                                    Wednesday:
                                </label>
                                <input
                                    type='text'
                                    id='hoursWednesday'
                                    name='hoursWednesday'
                                    value={updatedSettings.hoursWednesday}
                                    required
                                    onChange={(e) => {
                                        handleChange(e, 'hoursWednesday');
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor='hoursThursday'>Thursday:</label>
                                <input
                                    type='text'
                                    id='hoursThursday'
                                    name='hoursThursday'
                                    value={updatedSettings.hoursThursday}
                                    required
                                    onChange={(e) => {
                                        handleChange(e, 'hoursThursday');
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor='hoursFriday'>Friday:</label>
                                <input
                                    type='text'
                                    id='hoursFriday'
                                    name='hoursFriday'
                                    value={updatedSettings.hoursFriday}
                                    required
                                    onChange={(e) => {
                                        handleChange(e, 'hoursFriday');
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor='hoursSaturday'>Saturday:</label>
                                <input
                                    type='text'
                                    id='hoursSaturday'
                                    name='hoursSaturday'
                                    value={updatedSettings.hoursSaturday}
                                    required
                                    onChange={(e) => {
                                        handleChange(e, 'hoursSaturday');
                                    }}
                                />
                            </div>
                        </p>
                        <p>
                            <div>
                                Contact Info:
                                <div>
                                    <label htmlFor='phone'>Phone:</label>
                                    <input
                                        type='text'
                                        id='phone'
                                        name='phone'
                                        value={updatedSettings.phone}
                                        required
                                        onChange={(e) => {
                                            handleChange(e, 'phone');
                                        }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor='email'>Email:</label>
                                    <input
                                        type='text'
                                        id='email'
                                        name='email'
                                        value={updatedSettings.email}
                                        required
                                        onChange={(e) => {
                                            handleChange(e, 'email');
                                        }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor='address'>Address:</label>
                                    <input
                                        type='text'
                                        id='address'
                                        name='address'
                                        value={updatedSettings.address}
                                        required
                                        onChange={(e) => {
                                            handleChange(e, 'address');
                                        }}
                                    />
                                </div>
                            </div>
                        </p>
                        <p>
                            <div>
                                Social:
                                <div>
                                    <label htmlFor='facebook'>Facebook:</label>
                                    <input
                                        type='text'
                                        id='facebook'
                                        name='facebook'
                                        value={updatedSettings.facebook}
                                        required
                                        onChange={(e) => {
                                            handleChange(e, 'facebook');
                                        }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor='instagram'>
                                        Instagram:
                                    </label>
                                    <input
                                        type='text'
                                        id='instagram'
                                        name='instagram'
                                        value={updatedSettings.instagram}
                                        required
                                        onChange={(e) => {
                                            handleChange(e, 'instagram');
                                        }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor='tiktok'>TikTok:</label>
                                    <input
                                        type='text'
                                        id='tiktok'
                                        name='tiktok'
                                        value={updatedSettings.tiktok}
                                        required
                                        onChange={(e) => {
                                            handleChange(e, 'tiktok');
                                        }}
                                    />
                                </div>
                            </div>
                        </p>
                        <p>
                            <ImageUploader
                                parentForm={updatedSettings}
                                setParentForm={setUpdatedSettings}
                                imageKey='bannerImage'
                            />
                        </p>
                        <p>
                            <button type='submit' disabled={submitDisabled}>
                                Update Settings
                            </button>

                            <button type='button' onClick={handleCancel}>
                                Cancel
                            </button>
                        </p>
                        {isPostError && (
                            <p>Error updating settings. Please try again.</p>
                        )}
                    </fieldset>
                </form>
            </div>

            {showSuccess && (
                <div>
                    <h2>Settings updated successfully!</h2>
                    <button
                        onClick={() => {
                            setShowSuccess(false);
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditSettings;
