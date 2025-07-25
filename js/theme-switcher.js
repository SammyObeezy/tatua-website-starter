
class IconBasedThemeController {
    constructor() {
        this.activePanel = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedSettings();
        this.setupOutsideClick();
    }

    setupEventListeners() {
        // Font Size Icon Click
        const fontSizeIcon = document.getElementById('fontSizeIcon');
        if (fontSizeIcon) {
            fontSizeIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePanel('fontSizePanel', 'fontSizeIcon');
            });
        }

        // Theme Icon Click - Quick Toggle
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.quickToggleTheme();
            });

            // Long press for theme panel (optional)
            let themeIconPressTimer;
            themeIcon.addEventListener('mousedown', () => {
                themeIconPressTimer = setTimeout(() => {
                    this.togglePanel('themePanel', 'themeIcon');
                }, 500);
            });
            
            themeIcon.addEventListener('mouseup', () => {
                clearTimeout(themeIconPressTimer);
            });

            themeIcon.addEventListener('mouseleave', () => {
                clearTimeout(themeIconPressTimer);
            });
        }

        const fontSizeSlider = document.getElementById('fontSizeSlider');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                this.updateFontSize(e.target.value);
            });

            fontSizeSlider.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    setTimeout(() => {
                        this.updateFontSize(e.target.value);
                    }, 0);
                }
            });
        }

        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.updateTheme(theme);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                if (e.key === 'f' || e.key === 'F') {
                    e.preventDefault();
                    this.togglePanel('fontSizePanel', 'fontSizeIcon');
                }
                if (e.key === 't' || e.key === 'T') {
                    e.preventDefault();
                    this.quickToggleTheme();
                }
            }
            if (e.key === 'Escape' && this.activePanel) {
                this.closePanel(this.activePanel);
            }
        });

        const controlIcons = [fontSizeIcon, themeIcon].filter(Boolean);
        controlIcons.forEach(icon => {
            icon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    icon.click();
                }
            });
        });

    
        document.querySelectorAll('.control-panel').forEach(panel => {
            panel.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    togglePanel(panelId, iconId) {
        const panel = document.getElementById(panelId);
        const icon = document.getElementById(iconId);
        
        if (!panel || !icon) return;

        if (this.activePanel && this.activePanel !== panelId) {
            this.closePanel(this.activePanel);
        }

        if (panel.classList.contains('active')) {
            this.closePanel(panelId);
        } else {
            this.openPanel(panelId, iconId);
        }
    }

    openPanel(panelId, iconId) {
        const panel = document.getElementById(panelId);
        const icon = document.getElementById(iconId);
        
        if (panel && icon) {
            panel.classList.add('active');
            icon.classList.add('active');
            this.activePanel = panelId;
        }
    }

    closePanel(panelId) {
        const panel = document.getElementById(panelId);
        const iconId = panelId.replace('Panel', 'Icon');
        const icon = document.getElementById(iconId);
        
        if (panel) panel.classList.remove('active');
        if (icon) icon.classList.remove('active');
        
        if (this.activePanel === panelId) {
            this.activePanel = null;
        }
    }

    setupOutsideClick() {
        document.addEventListener('click', (e) => {
            if (this.activePanel && !e.target.closest('.navbar-icon-controls')) {
                this.closePanel(this.activePanel);
            }
        });
    }

    quickToggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'purple';
        const newTheme = currentTheme === 'purple' ? 'brown' : 'purple';
        this.updateTheme(newTheme);
        
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeIcon.style.transform = '';
            }, 150);
        }
    }

    updateFontSize(size) {
        const fontSizeDisplay = document.getElementById('fontSizeDisplay');
        const htmlElement = document.documentElement;
        
        if (fontSizeDisplay) {
            fontSizeDisplay.textContent = size + 'px';
        }
        
        htmlElement.style.fontSize = size + 'px';
        
        localStorage.setItem('fontSize', size);
        
        const slider = document.getElementById('fontSizeSlider');
        if (slider) {
            const percentage = ((size - 12) / (24 - 12)) * 100;
            slider.style.background = `linear-gradient(to right, var(--gray-300) 0%, var(--primary-color) ${percentage}%, var(--primary-color) ${percentage}%, var(--gray-300) 100%)`;
        }
    }

    updateTheme(theme) {
        const body = document.body;
        const themeOptions = document.querySelectorAll('.theme-option');
        
        if (theme === 'brown') {
            body.setAttribute('data-theme', 'brown');
        } else {
            body.removeAttribute('data-theme');
        }
        
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === theme) {
                option.classList.add('active');
            }
        });
        
        localStorage.setItem('theme', theme);
        
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }

    loadSavedSettings() {
        const savedFontSize = localStorage.getItem('fontSize') || '16';
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        
        if (fontSizeSlider) {
            fontSizeSlider.value = savedFontSize;
            this.updateFontSize(savedFontSize);
        }
        const savedTheme = localStorage.getItem('theme') || 'purple';
        this.updateTheme(savedTheme);
    }

    setTheme(theme) {
        this.updateTheme(theme);
    }

    setFontSize(size) {
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        if (fontSizeSlider) {
            fontSizeSlider.value = size;
            this.updateFontSize(size);
        }
    }

    getCurrentTheme() {
        return localStorage.getItem('theme') || 'purple';
    }

    getCurrentFontSize() {
        return localStorage.getItem('fontSize') || '16';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.iconThemeController) {
        window.iconThemeController = new IconBasedThemeController();
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IconBasedThemeController;
}