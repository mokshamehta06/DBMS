// Main JavaScript for GST Billing System

function selectRole(role) {
    if (role === 'shopkeeper') {
        window.location.href = 'shopkeeper/shoplogin.html';
    } else if (role === 'supplier') {
        window.location.href = 'supplier/supplier-login.html';
    }
}

// Utility functions
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.alerts-container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(value);
}

function calculateGST(amount, gstRate) {
    return (amount * gstRate) / 100;
}

function calculateTotal(amount, gstRate) {
    return amount + calculateGST(amount, gstRate);
}

// Local Storage helpers
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

// Date formatting
function formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Generate unique ID
function generateId() {
    return 'ID_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate GST number (basic validation)
function validateGST(gst) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
}

// Print bill
function printBill(billContent) {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Bill</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
    printWindow.document.write('th { background-color: #f2f2f2; }');
    printWindow.document.write('.total { font-weight: bold; font-size: 1.2em; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(billContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Download as PDF (basic implementation)
function downloadPDF(content, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Logout function
function logout() {
    removeFromLocalStorage('currentUser');
    removeFromLocalStorage('userRole');
    window.location.href = '../../index.html';
}

// Initialize date input with today's date
function initializeDateInput(elementId) {
    const today = new Date().toISOString().split('T')[0];
    const element = document.getElementById(elementId);
    if (element) {
        element.value = today;
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format phone number
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
    }
    return phone;
}

// Calculate discount
function calculateDiscount(amount, discountPercent) {
    return (amount * discountPercent) / 100;
}

// Validate form fields
function validateFormFields(fields) {
    for (let field of fields) {
        if (!field.value || field.value.trim() === '') {
            showAlert(`${field.name} is required`, 'error');
            field.focus();
            return false;
        }
    }
    return true;
}

// Export data to CSV
function exportToCSV(data, filename) {
    let csv = '';
    
    // Add headers
    if (data.length > 0) {
        csv += Object.keys(data[0]).join(',') + '\n';
        
        // Add rows
        data.forEach(row => {
            csv += Object.values(row).join(',') + '\n';
        });
    }
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = getFromLocalStorage('currentUser');
    const userRole = getFromLocalStorage('userRole');
    
    // You can add logic here to redirect if not logged in
    // based on the current page
});

