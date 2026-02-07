// Get elements
const loginScreen = document.getElementById('loginScreen');
const messageScreen = document.getElementById('messageScreen');
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const unlockBtn = document.getElementById('unlockBtn');
const errorMessage = document.getElementById('errorMessage');

// Correct date
const CORRECT_DAY = 26;
const CORRECT_MONTH = 6;
const CORRECT_YEAR = 2005;

// Auto-focus first input
dayInput.focus();

// Handle Enter key navigation between inputs
dayInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        monthInput.focus();
    }
});

monthInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        yearInput.focus();
    }
});

yearInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkDate();
    }
});



// Check date function
function checkDate() {
    // Helper to convert Arabic/Eastern numerals to English
    const toEnglishDigits = (str) => {
        return str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    }

    // Get raw values
    let dayVal = toEnglishDigits(dayInput.value.trim());
    let monthVal = toEnglishDigits(monthInput.value.trim());
    let yearVal = toEnglishDigits(yearInput.value.trim());

    // Hide error message first
    errorMessage.classList.remove('show');

    // Debugging (remove in production)
    console.log(`Checking: Day=${dayVal}, Month=${monthVal}, Year=${yearVal}`);

    // Simple validation (must not be empty)
    if (!dayVal || !monthVal || !yearVal) {
        showError();
        return;
    }

    // Convert to numbers for comparison to handle leading zeros (e.g., "06" == 6)
    const day = parseInt(dayVal, 10);
    const month = parseInt(monthVal, 10);
    const year = parseInt(yearVal, 10);

    // Check against correct values
    if (day === CORRECT_DAY && month === CORRECT_MONTH && year === CORRECT_YEAR) {
        unlockMessage();
    } else {
        console.log('Wrong date entered');
        showError();
        shakeInputs();
    }
}

// Show error message
function showError() {
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

// Shake inputs animation
function shakeInputs() {
    const inputs = [dayInput, monthInput, yearInput];
    inputs.forEach(input => {
        input.style.animation = 'shake 0.5s';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    });
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Unlock message
function unlockMessage() {
    // Add success animation to button
    unlockBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    unlockBtn.innerHTML = '<span class="btn-text">✓ صحيح!</span>';

    // Wait a bit then transition
    setTimeout(() => {
        loginScreen.style.animation = 'fadeOut 0.8s ease-out forwards';

        setTimeout(() => {
            loginScreen.style.display = 'none';
            messageScreen.classList.add('show');

            // Create confetti effect
            createConfetti();
        }, 800);
    }, 500);
}

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
`;
document.head.appendChild(fadeOutStyle);

// Create confetti effect
function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4CAF50', '#2196F3', '#ff69b4'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear forwards`;

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 30);
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Button click handler
unlockBtn.addEventListener('click', checkDate);

// Handle input sanitization (allow numbers only)
function setupInput(input, maxLength) {
    input.addEventListener('input', (e) => {
        // Remove any non-numeric characters
        e.target.value = e.target.value.replace(/[^0-9]/g, '');

        // Limit length
        if (e.target.value.length > maxLength) {
            e.target.value = e.target.value.slice(0, maxLength);
        }
    });
}

setupInput(dayInput, 2);
setupInput(monthInput, 2);
setupInput(yearInput, 4);

// Add placeholder animation
const inputs = [dayInput, monthInput, yearInput];
inputs.forEach((input, index) => {
    input.addEventListener('focus', () => {
        input.style.transform = 'scale(1.05)';
    });

    input.addEventListener('blur', () => {
        input.style.transform = 'scale(1)';
    });
});
