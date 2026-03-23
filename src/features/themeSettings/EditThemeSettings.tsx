import { useContext, useEffect, useState } from 'react';
import ImageUploader from '../images/ImageUploader';
import type { Theme, ThemeSettings } from '../../types';
import { useAdminKey } from '../../context/AdminKeyContext';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';
import {
    useGetThemeSettingsQuery,
    usePostThemeSettingsMutation,
} from '../themeSettings/themeSettingsApiSlice';
import { useUploadImageMutation } from '../images/imagesApiSlice';
import { UPLOAD_IMAGE_KEY } from '../../constants';
import { useGetThemesQuery } from '../themes/themesApiSlice';
import ThemePreview from './ThemePreview';

const EditThemeSettings = () => {
    const { adminKeyValid } = useContext(AdminKeyValidityContext);
    const {
        data: themeSettingsData,
        isError: isGetThemeSettingsError,
        isLoading: isGetThemeSettingsLoading,
        isFetching: isGetThemeSettingsFetching,
        refetch: refetchThemeSettings,
    } = useGetThemeSettingsQuery();
    const themeSettings = themeSettingsData?.data;

    const [
        postThemeSettings,
        { isLoading: isPostLoading, isError: isPostError },
    ] = usePostThemeSettingsMutation();

    const [, { isLoading: isUploading }] = useUploadImageMutation({
        fixedCacheKey: UPLOAD_IMAGE_KEY,
    });

    const {
        data: themesData,
        isError: isGetThemesError,
        isLoading: isGetThemesLoading,
    } = useGetThemesQuery();
    const themes = themesData?.data;

    const [showSuccess, setShowSuccess] = useState(false);

    const [updatedThemeSettings, setUpdatedThemeSettings] =
        useState<ThemeSettings>({
            bannerImage: {
                originalName: '',
                uuidName: '',
            },
            selectedTheme: {
                accentColor: '',
                backgroundColor: '',
                buttonColor: '',
                buttonTextColor: '',
                linkColor: '',
                textColor: '',
                themeName: '',
            },
        });

    const { getAdminKey } = useAdminKey();

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('e.target.value: ' + e.target.value);
        const newTheme = themes?.find(
            (theme) => theme.themeName === e.target.value,
        ) as Theme;
        console.log('newTheme: ');
        console.log(newTheme);
        setUpdatedThemeSettings((prev) => ({
            ...prev,
            selectedTheme: newTheme,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Updating Settings:', updatedThemeSettings);

        const adminKey = getAdminKey();

        try {
            const putResult = await postThemeSettings({
                themeSettings: updatedThemeSettings,
                adminKey,
            }).unwrap();

            if (putResult.errorMessage) {
                throw new Error(putResult.errorMessage);
            }

            await refetchThemeSettings();
            setShowSuccess(true);
        } catch (error) {
            console.error('Error adding settings:', error);
        }
    };

    const handleCancel = () => {
        setUpdatedThemeSettings(themeSettings as ThemeSettings);
    };

    useEffect(() => {
        if (themeSettings) {
            setUpdatedThemeSettings(themeSettings);
        }
    }, [themeSettings]);

    const contentUnchanged =
        themeSettings != null &&
        themeSettings.bannerImage.originalName ===
            updatedThemeSettings.bannerImage.originalName &&
        themeSettings.bannerImage.uuidName ===
            updatedThemeSettings.bannerImage.uuidName &&
        themeSettings.selectedTheme.themeName ===
            updatedThemeSettings.selectedTheme.themeName;

    const isLoading =
        isPostLoading || isGetThemeSettingsFetching || isUploading;
    const submitDisabled = isLoading || contentUnchanged || !adminKeyValid;

    if (isGetThemeSettingsLoading || isGetThemesLoading) {
        return <div>Loading...</div>;
    }
    if (isGetThemeSettingsError || isGetThemesError || !themeSettings) {
        return <div>Error loading Theme Settings.</div>;
    }

    return (
        <div>
            <p>Edit Theme settings</p>

            <div>
                <form onSubmit={handleSubmit}>
                    <fieldset disabled={isLoading}>
                        <p>
                            <label htmlFor='bannerImage'>Banner Image:</label>
                            <ImageUploader
                                parentForm={updatedThemeSettings}
                                setParentForm={setUpdatedThemeSettings}
                                imageKey='bannerImage'
                            />
                        </p>
                        <p>
                            <label htmlFor='selectedTheme'>Select Theme:</label>
                            <select
                                value={
                                    updatedThemeSettings.selectedTheme.themeName
                                }
                                onChange={handleThemeChange}
                            >
                                {themes?.map((theme) => (
                                    <option key={theme.themeName}>
                                        {theme.themeName}
                                    </option>
                                ))}
                            </select>
                        </p>
                        <p>
                            <button type='submit' disabled={submitDisabled}>
                                Update Theme Settings
                            </button>

                            <button type='button' onClick={handleCancel}>
                                Cancel
                            </button>
                        </p>
                        {isPostError && (
                            <p>
                                Error updating Theme settings. Please try again.
                            </p>
                        )}
                    </fieldset>
                </form>
                <ThemePreview theme={updatedThemeSettings.selectedTheme} />
            </div>
            {showSuccess && (
                <div>
                    <h2>Theme Settings updated successfully!</h2>
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

export default EditThemeSettings;
