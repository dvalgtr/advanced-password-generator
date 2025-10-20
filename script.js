const hamburgerMenu = document.querySelector('.hamburger-menu');
const sidebar = document.querySelector('.sidebar');
const generateBtn = document.getElementById('generate-btn');
const passwordOutput = document.getElementById('password-output');
const copyBtn = document.getElementById('copy-btn');
const downloadSection = document.getElementById('download-section');
const downloadBtn = document.getElementById('download-btn');
const lengthInput = document.getElementById('length');
const levelSelect = document.getElementById('level');
const antiBruteforceCheckbox = document.getElementById('anti-bruteforce');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

const charSets = {
    easy: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    medium: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    hard: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
    impossible: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
};

hamburgerMenu.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !hamburgerMenu.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

function generatePassword() {
    const length = parseInt(lengthInput.value);
    const level = levelSelect.value;
    const useAntiBruteforce = antiBruteforceCheckbox.checked;
    
    if (length < 4 || length > 50) {
        alert('Password length must be between 4 and 50 characters!');
        return;
    }
    
    let charset = charSets[level];
    let password = '';
    
    if (useAntiBruteforce && level !== 'impossible') {
        const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
        
        for (let i = 1; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        password = shuffleString(password);
    } else {
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
    }
    
    passwordOutput.value = password;
    updateStrengthMeter(password, level);
    downloadSection.classList.remove('hidden');
    localStorage.setItem('generatedPassword', password);
}

function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function updateStrengthMeter(password, level) {
    let strength = 0;
    let width = 0;
    let color = '';
    let text = '';
    
    if (password.length < 8) {
        strength = 1;
        width = 25;
        color = '#ff4d4d';
        text = 'Weak';
    } else if (password.length < 12) {
        strength = 2;
        width = 50;
        color = '#ffa64d';
        text = 'Medium';
    } else if (password.length < 16) {
        strength = 3;
        width = 75;
        color = '#ffff4d';
        text = 'Strong';
    } else {
        strength = 4;
        width = 100;
        color = '#4dff4d';
        text = 'Very Strong';
    }
    
    if (level === 'easy') strength = Math.max(1, strength - 1);
    if (level === 'impossible') strength = 4;
    
    strengthBar.style.setProperty('--strength-width', `${width}%`);
    strengthBar.style.setProperty('--strength-color', color);
    strengthBar.querySelector('::after').style.width = `${width}%`;
    strengthBar.querySelector('::after').style.backgroundColor = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
    strengthText.style.textShadow = `0 0 5px ${color}`;
}

function copyPassword() {
    if (!passwordOutput.value) {
        alert('No password to copy!');
        return;
    }
    
    passwordOutput.select();
    passwordOutput.setSelectionRange(0, 99999);
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.backgroundColor = '#0f0';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.backgroundColor = '';
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback: unable to copy', err);
        navigator.clipboard.writeText(passwordOutput.value).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.backgroundColor = '#0f0';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.backgroundColor = '';
            }, 2000);
        });
    }
}

function downloadPassword() {
    const password = localStorage.getItem('generatedPassword');
    if (!password) {
        alert('No password to download!');
        return;
    }
    
    const blob = new Blob([`Your Password: ${password}\n\nGenerated by Password Generator by Dvalgtr\nDate: ${new Date().toLocaleString('en-US')}`], 
        { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `password-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);
downloadBtn.addEventListener('click', downloadPassword);

updateStrengthMeter('', 'easy');
