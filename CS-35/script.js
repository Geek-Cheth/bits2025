const API_KEY = '23e7342c58ca52e1e3f467d2c869988b';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

class WeatherApp {
    constructor() {
        this.elements = this.getElements();
        this.init();
    }

    getElements() {
        return {
            form: document.getElementById('weather-form'),
            input: document.getElementById('city-input'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error-message'),
            errorText: document.getElementById('error-text'),
            result: document.getElementById('weather-result'),
            city: document.getElementById('city-name'),
            country: document.getElementById('country-name'),
            time: document.getElementById('current-time'),
            temp: document.getElementById('temperature'),
            feels: document.getElementById('feels-like'),
            icon: document.getElementById('weather-icon'),
            main: document.getElementById('weather-main'),
            desc: document.getElementById('weather-desc'),
            pressure: document.getElementById('pressure'),
            humidity: document.getElementById('humidity'),
            wind: document.getElementById('wind-speed'),
            visibility: document.getElementById('visibility')
        };
    }

    init() {
        this.elements.form.addEventListener('submit', e => this.handleSubmit(e));
        this.elements.input.addEventListener('input', () => this.hideError());
        this.updateTime();
        setInterval(() => this.updateTime(), 60000);
        this.fetchWeather('Colombo');
    }

    handleSubmit(e) {
        e.preventDefault();
        const city = this.elements.input.value.trim();
        if (city) {
            this.fetchWeather(city);
            this.elements.input.value = '';
        }
    }

    async fetchWeather(city) {
        try {
            this.showLoading();
            const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
            
            if (!response.ok) {
                throw new Error(this.getErrorMessage(response.status));
            }
            
            const data = await response.json();
            this.displayWeather(data);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    displayWeather(data) {
        this.elements.city.textContent = data.name;
        this.elements.country.textContent = this.getCountryName(data.sys.country);
        this.elements.temp.textContent = Math.round(data.main.temp);
        this.elements.feels.textContent = `${Math.round(data.main.feels_like)}°C`;
        this.elements.main.textContent = data.weather[0].main;
        this.elements.desc.textContent = data.weather[0].description;
        this.elements.icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        this.elements.pressure.textContent = `${data.main.pressure} hPa`;
        this.elements.humidity.textContent = `${data.main.humidity}%`;
        this.elements.wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        this.elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        this.showResult();
    }

    getErrorMessage(status) {
        const messages = {
            404: 'City not found. Please check spelling.',
            401: 'API error. Please try again.',
            429: 'Too many requests. Wait a moment.',
            500: 'Service unavailable. Try later.'
        };
        return messages[status] || 'Something went wrong.';
    }

    getCountryName(code) {
        const countries = {
            'US': 'United States', 'GB': 'United Kingdom', 'CA': 'Canada', 'AU': 'Australia',
            'DE': 'Germany', 'FR': 'France', 'IT': 'Italy', 'ES': 'Spain', 'JP': 'Japan',
            'CN': 'China', 'IN': 'India', 'BR': 'Brazil', 'RU': 'Russia', 'MX': 'Mexico',
            'LK': 'Sri Lanka', 'PK': 'Pakistan', 'BD': 'Bangladesh', 'TH': 'Thailand',
            'ID': 'Indonesia', 'MY': 'Malaysia', 'SG': 'Singapore', 'PH': 'Philippines',
            'TR': 'Turkey', 'GR': 'Greece', 'NL': 'Netherlands', 'CH': 'Switzerland',
            'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland'
        };
        return countries[code] || code;
    }

    updateTime() {
        const now = new Date();
        this.elements.time.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', 
            day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    showLoading() {
        this.elements.loading.classList.remove('hidden');
        this.hideError();
        this.hideResult();
    }

    hideLoading() {
        this.elements.loading.classList.add('hidden');
    }

    showError(message) {
        this.elements.errorText.textContent = message;
        this.elements.error.classList.remove('hidden');
        this.hideResult();
    }

    hideError() {
        this.elements.error.classList.add('hidden');
    }

    showResult() {
        this.elements.result.classList.remove('hidden');
        this.hideError();
    }

    hideResult() {
        this.elements.result.classList.add('hidden');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => new WeatherApp());

// Keyboard shortcuts
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('city-input').focus();
    }
});
