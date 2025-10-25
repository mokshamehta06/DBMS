// Shopkeeper Authentication

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function goToSignup(e) {
    if (e) e.preventDefault();
    showPage('signupPage');
}

function goToLogin(e) {
    if (e) e.preventDefault();
    showPage('loginPage');
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showAlert('Please fill all fields', 'error');
        return;
    }
    
    // Demo credentials - replace with API call
    if (username === 'shop1' && password === '1234') {
        // Save user info to localStorage
        saveToLocalStorage('currentUser', {
            username: username,
            role: 'shopkeeper',
            loginTime: new Date().toISOString()
        });
        saveToLocalStorage('userRole', 'shopkeeper');
        
        showAlert('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'shopdashboard.html';
        }, 1000);
    } else {
        showAlert('Invalid username or password! (Demo: shop1 / 1234)', 'error');
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const shopName = document.getElementById('shopName').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const gstNumber = document.getElementById('gstNumber').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (!shopName || !username || !email || !gstNumber || !password || !confirmPassword) {
        showAlert('Please fill all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    if (!validateGST(gstNumber)) {
        showAlert('Please enter a valid GST number', 'error');
        return;
    }
    const shopData = {
        id: generateId(),
        shopName: shopName,
        username: username,
        email: email,
        gstNumber: gstNumber,
        password: password, // In real app, never store plain password
        createdAt: new Date().toISOString()
    };
    
    saveToLocalStorage('shopkeeper_' + username, shopData);
    
    showAlert('Account created successfully! You can now login.', 'success');
    setTimeout(() => {
        goToLogin();
    }, 1500);
}

// Utility functions (from main.js)
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateGST(gst) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
}

function generateId() {
    return 'ID_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

