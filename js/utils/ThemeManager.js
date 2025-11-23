// テーマ管理（ダークモード対応）
class ThemeManager {
    static THEMES = {
        LIGHT: 'light',
        DARK: 'dark',
        AUTO: 'auto'
    };

    static getCurrentTheme() {
        return localStorage.getItem('theme') || ThemeManager.THEMES.AUTO;
    }

    static setTheme(theme) {
        localStorage.setItem('theme', theme);
        ThemeManager.applyTheme(theme);
    }

    static applyTheme(theme) {
        const root = document.documentElement;

        if (theme === ThemeManager.THEMES.AUTO) {
            // システム設定に従う
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? ThemeManager.THEMES.DARK : ThemeManager.THEMES.LIGHT;
        }

        if (theme === ThemeManager.THEMES.DARK) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.setAttribute('data-theme', 'light');
        }
    }

    static init() {
        // 初期テーマを適用
        const theme = ThemeManager.getCurrentTheme();
        ThemeManager.applyTheme(theme);

        // システムのダークモード設定変更を監視
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const currentTheme = ThemeManager.getCurrentTheme();
            if (currentTheme === ThemeManager.THEMES.AUTO) {
                ThemeManager.applyTheme(ThemeManager.THEMES.AUTO);
            }
        });
    }

    static toggleTheme() {
        const current = ThemeManager.getCurrentTheme();
        let next;

        if (current === ThemeManager.THEMES.LIGHT) {
            next = ThemeManager.THEMES.DARK;
        } else if (current === ThemeManager.THEMES.DARK) {
            next = ThemeManager.THEMES.AUTO;
        } else {
            next = ThemeManager.THEMES.LIGHT;
        }

        ThemeManager.setTheme(next);
        return next;
    }

    static getThemeIcon(theme) {
        switch (theme) {
            case ThemeManager.THEMES.LIGHT: return '☀️';
            case ThemeManager.THEMES.DARK: return '🌙';
            case ThemeManager.THEMES.AUTO: return '🔄';
            default: return '☀️';
        }
    }

    static getThemeName(theme) {
        switch (theme) {
            case ThemeManager.THEMES.LIGHT: return 'ライト';
            case ThemeManager.THEMES.DARK: return 'ダーク';
            case ThemeManager.THEMES.AUTO: return '自動';
            default: return 'ライト';
        }
    }
}

// ページ読み込み時にテーマを初期化
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
    } else {
        ThemeManager.init();
    }
}
