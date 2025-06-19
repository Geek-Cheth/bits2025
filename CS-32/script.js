document.addEventListener('DOMContentLoaded', () => {
    const colorInput = document.getElementById('colorInput');
    const colorPreview = document.getElementById('colorPreview');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');
    const notification = document.getElementById('notification');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const container = document.querySelector('.container');

    let colorHistory = [];
    const MAX_HISTORY = 5;

    const updateColor = (hexColor) => {
        if (!hexColor) return;

        // Update preview background
        colorPreview.style.backgroundColor = hexColor;

        // Convert and display all color formats
        const rgb = hexToRgb(hexColor);
        if (!rgb) return;

        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        hexValue.textContent = hexColor.toUpperCase();
        rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        // Update CSS custom properties for dynamic theming
        document.documentElement.style.setProperty('--current-color', hexColor);
        addToHistory(hexColor);
    };

    const hexToRgb = (hex) => {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    };

    const copyColorCode = async (button) => {
        const type = button.getAttribute('data-type');
        let textToCopy = '';

        switch (type) {
            case 'hex':
                textToCopy = hexValue.textContent;
                break;
            case 'rgb':
                textToCopy = rgbValue.textContent;
                break;
            case 'hsl':
                textToCopy = hslValue.textContent;
                break;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            showNotification(`${type.toUpperCase()} color code copied!`);
            addCopyEffect(button);
        } catch (err) {
            fallbackCopyText(textToCopy, type, button);
        }
    };

    const fallbackCopyText = (text, type, button) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            showNotification(`${type.toUpperCase()} color code copied!`);
            addCopyEffect(button);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            showNotification('Failed to copy color code.');
        }

        document.body.removeChild(textArea);
    };

    const showNotification = (message) => {
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    };

    const addPulseEffect = () => {
        colorPreview.classList.remove('pulse');
        void colorPreview.offsetWidth;
        colorPreview.classList.add('pulse');
    };

    const addCopyEffect = (button) => {
        const originalContent = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
        `;
        button.style.color = '#10b981';

        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.color = '';
        }, 1000);
    };

    const generateRandomColor = () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        colorInput.value = randomColor;
        updateColor(randomColor);
        addPulseEffect();
    };

    const addRandomColorButton = () => {
        const randomBtn = document.createElement('button');
        randomBtn.className = 'random-color-btn';
        randomBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z"></path>
                <path d="M2 7L12 12L22 7"></path>
                <polyline points="12,22 12,12"></polyline>
            </svg>
            Random
        `;
        randomBtn.title = 'Generate Random Color (R)';

        const style = document.createElement('style');
        style.innerHTML = `
            .random-color-btn {
                background: linear-gradient(45deg, #8b5cf6, #3b82f6);
                border: none;
                color: white;
                padding: 10px 16px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 20px auto 0;
                transition: all 0.3s ease;
            }
            .random-color-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
            }
        `;
        document.head.appendChild(style);

        randomBtn.addEventListener('click', generateRandomColor);
        document.querySelector('.color-picker-section').appendChild(randomBtn);
    };

    const addColorHistory = () => {
        const historyContainer = document.createElement('div');
        historyContainer.className = 'color-history';
        historyContainer.innerHTML = '<h3>Recent Colors</h3><div class="history-colors"></div>';

        const style = document.createElement('style');
        style.innerHTML = `
            .color-history {
                margin-top: 30px;
                text-align: center;
            }
            .color-history h3 {
                font-size: 1rem;
                color: #94a3b8;
                margin-bottom: 15px;
                font-weight: 600;
            }
            .history-colors {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }
            .history-color-box {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                cursor: pointer;
                border: 2px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .history-color-box:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(style);

        document.querySelector('.color-info').appendChild(historyContainer);
    };

    const addToHistory = (color) => {
        if (colorHistory.includes(color)) {
            colorHistory = colorHistory.filter(c => c !== color);
        }
        colorHistory.unshift(color);
        if (colorHistory.length > MAX_HISTORY) {
            colorHistory.pop();
        }
        updateHistoryDisplay();
    };

    const updateHistoryDisplay = () => {
        const historyContainer = document.querySelector('.history-colors');
        if (!historyContainer) return;
        historyContainer.innerHTML = '';

        colorHistory.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.className = 'history-color-box';
            colorBox.style.backgroundColor = color;
            colorBox.title = color;

            colorBox.addEventListener('click', () => {
                colorInput.value = color;
                updateColor(color);
                addPulseEffect();
            });

            historyContainer.appendChild(colorBox);
        });
    };

    const setupKeyboardShortcuts = () => {
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
                if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    generateRandomColor();
                }
            }
        });
    };

    const setupParallaxEffect = () => {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xRotation = ((clientY / innerHeight) - 0.5) * 2;
            const yRotation = ((clientX / innerWidth) - 0.5) * 2;

            container.style.transform = `
                perspective(1000px)
                rotateX(${xRotation}deg) 
                rotateY(${yRotation}deg)
                translateZ(20px)
            `;
        });

        container.addEventListener('mouseleave', () => {
            container.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    };

    // Initial setup
    updateColor(colorInput.value);
    addRandomColorButton();
    addColorHistory();
    setupKeyboardShortcuts();
    setupParallaxEffect();

    colorInput.addEventListener('input', (e) => {
        updateColor(e.target.value);
        addPulseEffect();
    });

    copyButtons.forEach(button => {
        button.addEventListener('click', () => copyColorCode(button));
    });
});
