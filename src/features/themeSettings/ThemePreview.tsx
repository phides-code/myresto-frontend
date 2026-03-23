import type { Theme } from '../../types';

interface ThemePreviewProps {
    theme: Theme;
}

const ThemePreview = ({ theme }: ThemePreviewProps) => {
    const {
        accentColor,
        backgroundColor,
        buttonColor,
        linkColor,
        textColor,
        buttonTextColor,
    } = theme;

    return (
        <div style={{ backgroundColor: backgroundColor }}>
            <p style={{ color: textColor }}>Text Color</p>
            <p style={{ color: linkColor }}>Link Color</p>
            <p style={{ color: accentColor }}>Accent Color</p>
            <p>
                <button
                    style={{
                        backgroundColor: buttonColor,
                        color: buttonTextColor,
                    }}
                >
                    Button Color
                </button>
            </p>
        </div>
    );
};

export default ThemePreview;
