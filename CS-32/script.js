class ColorPicker {
    constructor() {
        this.colorInput = document.getElementById('colorInput');
        this.colorPreview = document.getElementById('colorPreview');
        this.hexValue = document.getElementById('hexValue');
        this.rgbValue = document.getElementById('rgbValue');
        this.hslValue = document.getElementById('hslValue');
        this.notification = document.getElementById('notification');
        this.copyButtons = document.querySelectorAll('.copy-btn');
        
        this.init();
    }
    
    init() {
        // Set initial color
        this.updateColor(this.colorInput.value);
        
        // Event listeners
        this.colorInput.addEventListener('input', (e) => {
            this.updateColor(e.target.value);
            this.addPulseEffect();
        });
        
        this.copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.copyColorCode(e.target.closest('.copy-btn'));
            });
        });
        
        // Keyboard accessibility
        this.colorInput.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                this.colorInput.click();
            }
        });
    }
    
    updateColor(hexColor) {
        // Update preview background
        this.colorPreview.style.backgroundColor = hexColor;
        
        // Convert and display all color formats
        const rgb = this.hexToRgb(hexColor);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        this.hexValue.textContent = hexColor.toUpperCase();
        this.rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        this.hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        
        // Update CSS custom properties for dynamic theming
        document.documentElement.style.setProperty('--current-color', hexColor);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    rgbToHsl(r, g, b) {
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
    }
    
    async copyColorCode(button) {
        const type = button.getAttribute('data-type');
        let textToCopy = '';
        
        switch (type) {
            case 'hex':
                textToCopy = this.hexValue.textContent;
                break;
            case 'rgb':
                textToCopy = this.rgbValue.textContent;
                break;
            case 'hsl':
                textToCopy = this.hslValue.textContent;
                break;
        }
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            this.showNotification(`${type.toUpperCase()} color code copied!`);
            this.addCopyEffect(button);
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyText(textToCopy);
            this.showNotification(`${type.toUpperCase()} color code copied!`);
            this.addCopyEffect(button);
        }
    }
    
    fallbackCopyText(text) {
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
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    showNotification(message) {
        this.notification.textContent = message;
        this.notification.classList.add('show');
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 2000);
    }
    
    addPulseEffect() {
        this.colorPreview.classList.remove('pulse');
        // Force reflow
        void this.colorPreview.offsetWidth;
        this.colorPreview.classList.add('pulse');
        
        setTimeout(() => {
            this.colorPreview.classList.remove('pulse');
        }, 600);
    }
    
    addCopyEffect(button) {
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
    }
}

// Enhanced features
class ColorPickerEnhanced extends ColorPicker {
    constructor() {
        super();
        this.setupEnhancedFeatures();
    }
    
    setupEnhancedFeatures() {
        // Add random color generator
        this.addRandomColorButton();
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Add color history (last 5 colors)
        this.colorHistory = [];
        this.addColorHistory();
    }
    
    addRandomColorButton() {
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
        
        // Add styles
        randomBtn.style.cssText = `
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
        `;
        
        randomBtn.addEventListener('click', () => this.generateRandomColor());
        randomBtn.addEventListener('mouseenter', () => {
            randomBtn.style.transform = 'scale(1.05)';
            randomBtn.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
        });
        randomBtn.addEventListener('mouseleave', () => {
            randomBtn.style.transform = 'scale(1)';
            randomBtn.style.boxShadow = 'none';
        });
        
        document.querySelector('.color-picker-section').appendChild(randomBtn);
    }
    
    generateRandomColor() {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        this.colorInput.value = randomColor;
        this.updateColor(randomColor);
        this.addPulseEffect();
        this.addToHistory(randomColor);
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
                if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    this.generateRandomColor();
                }
            }
        });
    }
    
    addColorHistory() {
        const historyContainer = document.createElement('div');
        historyContainer.className = 'color-history';
        historyContainer.innerHTML = '<h3>Recent Colors</h3><div class="history-colors"></div>';
        
        // Add styles
        historyContainer.style.cssText = `
            margin-top: 30px;
            text-align: center;
        `;
        
        const historyTitle = historyContainer.querySelector('h3');
        historyTitle.style.cssText = `
            font-size: 1rem;
            color: #94a3b8;
            margin-bottom: 15px;
            font-weight: 600;
        `;
        
        const historyColors = historyContainer.querySelector('.history-colors');
        historyColors.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        `;
        
        document.querySelector('.color-info').appendChild(historyContainer);
        this.historyContainer = historyColors;
    }
    
    addToHistory(color) {
        if (this.colorHistory.includes(color)) return;
        
        this.colorHistory.unshift(color);
        if (this.colorHistory.length > 5) {
            this.colorHistory.pop();
        }
        
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        this.historyContainer.innerHTML = '';
        
        this.colorHistory.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.style.cssText = `
                width: 40px;
                height: 40px;
                background-color: ${color};
                border-radius: 8px;
                cursor: pointer;
                border: 2px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            `;
            
            colorBox.addEventListener('click', () => {
                this.colorInput.value = color;
                this.updateColor(color);
                this.addPulseEffect();
            });
            
            colorBox.addEventListener('mouseenter', () => {
                colorBox.style.transform = 'scale(1.1)';
                colorBox.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.3)';
            });
            
            colorBox.addEventListener('mouseleave', () => {
                colorBox.style.transform = 'scale(1)';
                colorBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            });
            
            this.historyContainer.appendChild(colorBox);
        });
    }
    
    updateColor(hexColor) {
        super.updateColor(hexColor);
        this.addToHistory(hexColor);
    }
}

// Initialize the enhanced color picker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ColorPickerEnhanced();
});

// Add some easter eggs and smooth interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add subtle parallax effect to container
    const container = document.querySelector('.container');
    
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xRotation = ((clientY / innerHeight) - 0.5) * 2;
        const yRotation = ((clientX / innerWidth) - 0.5) * 2;
        
        container.style.transform = `
            translateY(-5px) 
            rotateX(${xRotation}deg) 
            rotateY(${yRotation}deg)
        `;
    });
    
    container.addEventListener('mouseleave', () => {
        container.style.transform = 'translateY(-5px) rotateX(0deg) rotateY(0deg)';
    });
});
