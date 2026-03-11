class Calculator {
    constructor() {
        this.expression = '';
        this.result = '0';
        this.expressionEl = document.getElementById('expression');
        this.resultEl = document.getElementById('result');
        this.init();
    }

    init() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleButton(btn.dataset.value));
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleButton(value) {
        switch(value) {
            case 'C':
                this.clear();
                break;
            case 'CE':
                this.clearEntry();
                break;
            case '=':
                this.calculate();
                break;
            default:
                this.appendValue(value);
        }
    }

    handleKeyboard(e) {
        const key = e.key;
        if (/[0-9+\-*/.%]/.test(key)) {
            this.appendValue(key);
        } else if (key === 'Enter') {
            e.preventDefault();
            this.calculate();
        } else if (key === 'Escape') {
            this.clear();
        } else if (key === 'Backspace') {
            this.clearEntry();
        }
    }

    appendValue(value) {
        // Prevent multiple operators in a row
        const operators = ['+', '-', '*', '/', '%'];
        const lastChar = this.expression.slice(-1);
        
        if (operators.includes(value) && operators.includes(lastChar)) {
            this.expression = this.expression.slice(0, -1) + value;
        } else {
            this.expression += value;
        }
        
        this.updateDisplay();
    }

    clear() {
        this.expression = '';
        this.result = '0';
        this.resultEl.classList.remove('error');
        this.updateDisplay();
    }

    clearEntry() {
        this.expression = this.expression.slice(0, -1);
        this.resultEl.classList.remove('error');
        this.updateDisplay();
    }

    async calculate() {
        if (!this.expression) return;

        try {
            const response = await fetch(`/api/calc?expression=${encodeURIComponent(this.expression)}`);
            const data = await response.json();

            if (data.error) {
                this.resultEl.classList.add('error');
                this.result = data.error;
            } else {
                this.resultEl.classList.remove('error');
                this.result = this.formatResult(data.result);
                // Keep expression for reference
            }
        } catch (error) {
            this.resultEl.classList.add('error');
            this.result = 'Error';
        }

        this.updateDisplay();
    }

    formatResult(num) {
        if (Number.isInteger(num)) {
            return num.toString();
        }
        // Round to 10 decimal places to avoid floating point issues
        return parseFloat(num.toFixed(10)).toString();
    }

    updateDisplay() {
        this.expressionEl.textContent = this.expression || '';
        this.resultEl.textContent = this.result;
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
