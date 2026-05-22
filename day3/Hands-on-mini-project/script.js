// Calculation history array
let history = [];

// Function to add to history
function addToHistory(operation, num1, num2, result) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] ${num1} ${operation} ${num2} = ${result}`;
    history.push(entry);
    
    // Keep only last 10 calculations
    if (history.length > 10) {
        history.shift();
    }
    
    updateHistory();
}

// Function to update history display
function updateHistory() {
    const historyDiv = document.getElementById("history");
    
    if (history.length === 0) {
        historyDiv.innerHTML = '<p style="color: #999;">No calculations yet</p>';
        return;
    }
    
    historyDiv.innerHTML = history.map(entry => `<div>${entry}</div>`).join('');
}

// Function to clear history
function clearHistory() {
    history = [];
    updateHistory();
    console.log("History cleared");
}

// Main calculate function
function calculate(operation) {
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const resultDiv = document.getElementById("result");
    
    const num1 = parseFloat(input1.value);
    const num2 = parseFloat(input2.value);
    
    // Validation
    if (isNaN(num1) || isNaN(num2)) {
        resultDiv.innerHTML = '<p style="color: red;">❌ Please enter valid numbers</p>';
        console.warn("Invalid input detected");
        return;
    }
    
    let result;
    let operationSymbol;
    let operationName;
    
    // Switch case for different operations
    switch(operation) {
        case 'add':
            result = num1 + num2;
            operationSymbol = '+';
            operationName = 'Addition';
            break;
        case 'subtract':
            result = num1 - num2;
            operationSymbol = '-';
            operationName = 'Subtraction';
            break;
        case 'multiply':
            result = num1 * num2;
            operationSymbol = '×';
            operationName = 'Multiplication';
            break;
        case 'divide':
            if (num2 === 0) {
                resultDiv.innerHTML = '<p style="color: red;">❌ Cannot divide by zero!</p>';
                console.error("Division by zero attempted");
                return;
            }
            result = (num1 / num2).toFixed(4);
            operationSymbol = '÷';
            operationName = 'Division';
            break;
        default:
            resultDiv.innerHTML = '<p style="color: red;">❌ Unknown operation</p>';
            return;
    }
    
    // Format result
    const formattedResult = Number.isInteger(result) ? result : parseFloat(result);
    
    // Display result
    resultDiv.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 18px; color: #666; margin-bottom: 10px;">${operationName}</div>
            <div style="font-size: 32px; color: #667eea; font-weight: bold;">
                ${num1} ${operationSymbol} ${num2} = ${formattedResult}
            </div>
        </div>
    `;
    
    // Add to history
    addToHistory(`${operationSymbol}`, num1, num2, formattedResult);
    
    // Console logging
    console.log(`%c${operationName}: ${num1} ${operationSymbol} ${num2} = ${formattedResult}`, "color: green; font-weight: bold;");
}

// Function to check if result is even or odd
function checkEvenOdd() {
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const resultDiv = document.getElementById("result");
    
    const num1 = parseInt(input1.value);
    const num2 = parseInt(input2.value);
    
    if (isNaN(num1) || isNaN(num2)) {
        resultDiv.innerHTML = '<p style="color: red;">❌ Please enter valid numbers</p>';
        return;
    }
    
    const num1Even = num1 % 2 === 0 ? "Even" : "Odd";
    const num2Even = num2 % 2 === 0 ? "Even" : "Odd";
    
    resultDiv.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 18px; color: #666; margin-bottom: 10px;">Even/Odd Check</div>
            <div style="font-size: 18px; color: #667eea; margin-bottom: 8px;">
                ${num1} is <strong>${num1Even}</strong>
            </div>
            <div style="font-size: 18px; color: #764ba2;">
                ${num2} is <strong>${num2Even}</strong>
            </div>
        </div>
    `;
    
    console.log(`${num1} is ${num1Even}, ${num2} is ${num2Even}`);
}

// Function to calculate power
function calculatePower() {
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const resultDiv = document.getElementById("result");
    
    const num1 = parseFloat(input1.value);
    const num2 = parseFloat(input2.value);
    
    if (isNaN(num1) || isNaN(num2)) {
        resultDiv.innerHTML = '<p style="color: red;">❌ Please enter valid numbers</p>';
        return;
    }
    
    const result = Math.pow(num1, num2);
    
    resultDiv.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 18px; color: #666; margin-bottom: 10px;">Power Calculation</div>
            <div style="font-size: 32px; color: #667eea; font-weight: bold;">
                ${num1}<sup style="font-size: 20px;">${num2}</sup> = ${result}
            </div>
        </div>
    `;
    
    addToHistory(`^`, num1, num2, result);
    console.log(`Power: ${num1} ^ ${num2} = ${result}`);
}

// Function to calculate modulo
function calculateModulo() {
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const resultDiv = document.getElementById("result");
    
    const num1 = parseInt(input1.value);
    const num2 = parseInt(input2.value);
    
    if (isNaN(num1) || isNaN(num2)) {
        resultDiv.innerHTML = '<p style="color: red;">❌ Please enter valid numbers</p>';
        return;
    }
    
    if (num2 === 0) {
        resultDiv.innerHTML = '<p style="color: red;">❌ Cannot divide by zero!</p>';
        console.error("Modulo by zero attempted");
        return;
    }
    
    const result = num1 % num2;
    
    resultDiv.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 18px; color: #666; margin-bottom: 10px;">Modulo Operation</div>
            <div style="font-size: 32px; color: #667eea; font-weight: bold;">
                ${num1} % ${num2} = ${result}
            </div>
            <div style="font-size: 14px; color: #999; margin-top: 10px;">
                (Remainder when ${num1} is divided by ${num2})
            </div>
        </div>
    `;
    
    addToHistory(`%`, num1, num2, result);
    console.log(`Modulo: ${num1} % ${num2} = ${result}`);
}

// Function to reset all
function reset() {
    document.getElementById("input1").value = "";
    document.getElementById("input2").value = "";
    document.getElementById("result").innerHTML = '<p>Enter numbers and select an operation</p>';
    console.log("Calculator reset");
}

// Console logging on page load
console.log("%cSimple Calculator Loaded ✓", "color: green; font-size: 16px; font-weight: bold;");
console.log("%cJavaScript Basics - Day 3 Mini Project", "color: blue; font-size: 12px;");
console.log("%cAvailable Functions:", "color: purple; font-weight: bold;");
console.log("- calculate(operation): Performs arithmetic operations");
console.log("- checkEvenOdd(): Checks if numbers are even or odd");
console.log("- calculatePower(): Calculates power (a^b)");
console.log("- calculateModulo(): Calculates remainder (a % b)");
console.log("- reset(): Resets the calculator");
