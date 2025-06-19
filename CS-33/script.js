class BMICalculator {
    constructor() {
        this.form = document.getElementById('bmi-form');
        this.weightInput = document.getElementById('weight');
        this.heightInput = document.getElementById('height');
        this.resultDiv = document.getElementById('result');
        this.bmiNumber = document.getElementById('bmi-number');
        this.categoryText = document.getElementById('category-text');
        this.detailsText = document.getElementById('details-text');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateBMI();
        });
        
        // Add input validation on keyup
        this.weightInput.addEventListener('keyup', () => this.validateInput());
        this.heightInput.addEventListener('keyup', () => this.validateInput());
    }
    
    validateInput() {
        const weight = parseFloat(this.weightInput.value);
        const height = parseFloat(this.heightInput.value);
        
        // Real-time validation feedback
        if (weight && weight < 1) {
            this.weightInput.style.borderColor = '#e74c3c';
        } else if (weight) {
            this.weightInput.style.borderColor = '#27ae60';
        } else {
            this.weightInput.style.borderColor = '#e0e0e0';
        }
        
        if (height && height < 50) {
            this.heightInput.style.borderColor = '#e74c3c';
        } else if (height) {
            this.heightInput.style.borderColor = '#27ae60';
        } else {
            this.heightInput.style.borderColor = '#e0e0e0';
        }
    }
    
    calculateBMI() {
        const weight = parseFloat(this.weightInput.value);
        const height = parseFloat(this.heightInput.value);
        
        // Input validation
        if (!this.isValidInput(weight, height)) {
            this.showError('Please enter valid weight and height values');
            return;
        }
        
        // Convert height from cm to meters
        const heightInMeters = height / 100;
        
        // Calculate BMI
        const bmi = weight / (heightInMeters * heightInMeters);
        
        // Display result
        this.displayResult(bmi);
    }
    
    isValidInput(weight, height) {
        return weight > 0 && height > 0 && weight <= 1000 && height <= 300;
    }
    
    showError(message) {
        alert(message);
    }
    
    displayResult(bmi) {
        const category = this.getBMICategory(bmi);
        const details = this.getBMIDetails(category);
        
        // Update BMI value
        this.bmiNumber.textContent = bmi.toFixed(1);
        
        // Update category
        this.categoryText.textContent = category.name;
        
        // Update details
        this.detailsText.textContent = details;
        
        // Remove existing category classes
        this.resultDiv.classList.remove('underweight', 'normal', 'overweight', 'obese');
        
        // Add appropriate category class for color coding
        this.resultDiv.classList.add(category.class);
        
        // Show result with animation
        this.resultDiv.classList.remove('hidden');
        
        // Scroll to result
        this.resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    getBMICategory(bmi) {
        if (bmi < 18.5) {
            return {
                name: 'Underweight',
                class: 'underweight'
            };
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            return {
                name: 'Normal Weight',
                class: 'normal'
            };
        } else if (bmi >= 25 && bmi <= 29.9) {
            return {
                name: 'Overweight',
                class: 'overweight'
            };
        } else {
            return {
                name: 'Obese',
                class: 'obese'
            };
        }
    }
    
    getBMIDetails(category) {
        const details = {
            'Underweight': 'You may need to gain weight. Consider consulting with a healthcare provider for personalized advice.',
            'Normal Weight': 'Great job! You have a healthy weight. Maintain your current lifestyle with balanced diet and regular exercise.',
            'Overweight': 'Consider adopting a healthier lifestyle with balanced nutrition and regular physical activity.',
            'Obese': 'It is recommended to consult with a healthcare provider for a comprehensive weight management plan.'
        };
        
        return details[category.name] || '';
    }
}

// Utility functions for additional features
const BMIUtils = {
    // Calculate ideal weight range
    getIdealWeightRange(heightCm) {
        const heightM = heightCm / 100;
        const minWeight = 18.5 * heightM * heightM;
        const maxWeight = 24.9 * heightM * heightM;
        
        return {
            min: Math.round(minWeight * 10) / 10,
            max: Math.round(maxWeight * 10) / 10
        };
    },
    
    // Format number with proper decimal places
    formatNumber(num, decimals = 1) {
        return Number(num).toFixed(decimals);
    },
    
    // Validate numeric input
    isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
};

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BMICalculator();
});

// Export for potential testing or module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BMICalculator, BMIUtils };
}
