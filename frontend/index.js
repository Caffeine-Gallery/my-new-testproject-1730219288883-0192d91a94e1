import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let currentValue = '';
let operator = '';
let waitingForSecondOperand = false;

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

window.appendToDisplay = function(value) {
    if (waitingForSecondOperand) {
        display.value = value;
        waitingForSecondOperand = false;
    } else {
        display.value += value;
    }
    currentValue = display.value;
};

window.setOperation = function(op) {
    operator = op;
    waitingForSecondOperand = true;
};

window.clearDisplay = function() {
    display.value = '';
    currentValue = '';
    operator = '';
    waitingForSecondOperand = false;
};

window.calculate = async function() {
    if (!operator || !currentValue) return;

    const secondOperand = parseFloat(currentValue);
    const firstOperand = parseFloat(display.value);

    showLoading();

    try {
        let result;
        switch (operator) {
            case '+':
                result = await backend.add(firstOperand, secondOperand);
                break;
            case '-':
                result = await backend.subtract(firstOperand, secondOperand);
                break;
            case '*':
                result = await backend.multiply(firstOperand, secondOperand);
                break;
            case '/':
                const divisionResult = await backend.divide(firstOperand, secondOperand);
                if (divisionResult === null) {
                    display.value = 'Error: Division by zero';
                    hideLoading();
                    return;
                }
                result = divisionResult;
                break;
        }

        display.value = result.toString();
        currentValue = result.toString();
        operator = '';
        waitingForSecondOperand = false;
    } catch (error) {
        console.error('Calculation error:', error);
        display.value = 'Error';
    } finally {
        hideLoading();
    }
};
