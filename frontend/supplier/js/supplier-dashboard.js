// Supplier Dashboard JavaScript

let invoiceItems = [];
let customers = [];
let products = [];
let invoices = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadDashboardData();
    initializeDateInputs();
    loadCustomers();
    loadProducts();
    loadInvoices();
});

function checkAuth() {
    const currentUser = getFromLocalStorage('currentUser');
    if (!currentUser || currentUser.role !== 'supplier') {
        window.location.href = 'supplier-login.html';
        return;
    }
    document.getElementById('supplierUsername').textContent = currentUser.username;
}

function loadDashboardData() {
    customers = getFromLocalStorage('supplier_customers') || [];
    products = getFromLocalStorage('supplier_products') || [];
    invoices = getFromLocalStorage('supplier_invoices') || [];
}

function initializeDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const invoiceDate = document.getElementById('invoiceDate');
    const dueDate = document.getElementById('dueDate');
    const analyticsFromDate = document.getElementById('analyticsFromDate');
    const analyticsToDate = document.getElementById('analyticsToDate');
    
    if (invoiceDate) invoiceDate.value = today;
    if (dueDate) dueDate.value = tomorrow;
    if (analyticsFromDate) analyticsFromDate.value = today;
    if (analyticsToDate) analyticsToDate.value = today;
}

function showTab(tabName, event) {
    if (event) event.preventDefault();
    
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const tab = document.getElementById(tabName);
    if (tab) tab.classList.add('active');
    
    event.target.classList.add('active');
}

// Customer Management
function showAddCustomerForm() {
    document.getElementById('addCustomerForm').style.display = 'block';
}

function hideAddCustomerForm() {
    document.getElementById('addCustomerForm').style.display = 'none';
    document.getElementById('customerForm').reset();
}

function handleAddCustomer(event) {
    event.preventDefault();
    
    const customer = {
        id: generateId(),
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        gst: document.getElementById('customerGST').value,
        address: document.getElementById('customerAddress').value,
        createdAt: new Date().toISOString()
    };
    
    customers.push(customer);
    saveToLocalStorage('supplier_customers', customers);
    
    document.getElementById('customerForm').reset();
    hideAddCustomerForm();
    showAlert('Customer added successfully!', 'success');
    loadCustomers();
}

function loadCustomers() {
    const select = document.getElementById('customerSelect');
    const tbody = document.getElementById('customersTableBody');
    
    if (select) {
        select.innerHTML = '<option value="">Select Customer</option>';
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name;
            select.appendChild(option);
        });
    }
    
    if (tbody) {
        tbody.innerHTML = '';
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.gst || 'N/A'}</td>
                <td><button class="btn-secondary" onclick="deleteCustomer('${customer.id}')">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}

function deleteCustomer(customerId) {
    if (confirm('Are you sure?')) {
        customers = customers.filter(c => c.id !== customerId);
        saveToLocalStorage('supplier_customers', customers);
        loadCustomers();
        showAlert('Customer deleted', 'success');
    }
}

// Product Management
function handleAddProduct(event) {
    event.preventDefault();
    
    const product = {
        id: generateId(),
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSKU').value,
        price: parseFloat(document.getElementById('productPrice').value),
        gst: parseInt(document.getElementById('productGST').value),
        createdAt: new Date().toISOString()
    };
    
    products.push(product);
    saveToLocalStorage('supplier_products', products);
    
    document.getElementById('productForm').reset();
    showAlert('Product added successfully!', 'success');
    loadProducts();
}

function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.gst}%</td>
            <td><button class="btn-secondary" onclick="deleteProduct('${product.id}')">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteProduct(productId) {
    if (confirm('Are you sure?')) {
        products = products.filter(p => p.id !== productId);
        saveToLocalStorage('supplier_products', products);
        loadProducts();
        showAlert('Product deleted', 'success');
    }
}

// Invoice Management
function addInvoiceItem() {
    const itemsDiv = document.getElementById('invoiceItems');
    const itemId = generateId();
    
    const itemHTML = `
        <div class="bill-item" id="item-${itemId}">
            <select onchange="updateInvoiceItem('${itemId}')">
                <option value="">Select Product</option>
                ${products.map(p => `<option value="${p.id}" data-price="${p.price}" data-gst="${p.gst}">${p.name}</option>`).join('')}
            </select>
            <input type="number" placeholder="Qty" value="1" onchange="updateInvoiceItem('${itemId}')">
            <input type="number" placeholder="Price" readonly>
            <input type="number" placeholder="GST" readonly>
            <button class="btn-secondary" onclick="removeInvoiceItem('${itemId}')">Remove</button>
        </div>
    `;
    
    itemsDiv.innerHTML += itemHTML;
}

function updateInvoiceItem(itemId) {
    // Update logic for invoice items
}

function removeInvoiceItem(itemId) {
    const item = document.getElementById(`item-${itemId}`);
    if (item) item.remove();
}

function createInvoice() {
    const customerId = document.getElementById('customerSelect').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const dueDate = document.getElementById('dueDate').value;
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    const notes = document.getElementById('invoiceNotes').value;
    
    if (!customerId) {
        showAlert('Please select a customer', 'error');
        return;
    }
    
    const customer = customers.find(c => c.id === customerId);
    const invoice = {
        id: generateId(),
        customerId: customerId,
        customerName: customer.name,
        invoiceDate: invoiceDate,
        dueDate: dueDate,
        items: invoiceItems,
        discount: discountPercent,
        notes: notes,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    invoices.push(invoice);
    saveToLocalStorage('supplier_invoices', invoices);
    
    showAlert('Invoice created successfully!', 'success');
    displayInvoicePreview(invoice);
}

function displayInvoicePreview(invoice) {
    const preview = document.getElementById('invoicePreview');
    let totalAmount = 0;
    let totalGST = 0;
    
    let html = `
        <h4>Invoice Preview</h4>
        <p><strong>Invoice ID:</strong> ${invoice.id}</p>
        <p><strong>Customer:</strong> ${invoice.customerName}</p>
        <p><strong>Invoice Date:</strong> ${formatDate(invoice.invoiceDate)}</p>
        <p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>GST</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    invoice.items.forEach(item => {
        const gst = calculateGST(item.price * item.quantity, item.gstRate);
        totalAmount += item.price * item.quantity;
        totalGST += gst;
        
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${formatCurrency(gst)}</td>
                <td>${formatCurrency(item.price * item.quantity + gst)}</td>
            </tr>
        `;
    });
    
    const discount = (totalAmount * invoice.discount) / 100;
    const finalTotal = totalAmount + totalGST - discount;
    
    html += `
            </tbody>
        </table>
        <p><strong>Subtotal:</strong> ${formatCurrency(totalAmount)}</p>
        <p><strong>GST:</strong> ${formatCurrency(totalGST)}</p>
        <p><strong>Discount:</strong> ${formatCurrency(discount)}</p>
        <p class="total"><strong>Total:</strong> ${formatCurrency(finalTotal)}</p>
        ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
        <button class="btn-secondary" onclick="printInvoice()">Print</button>
        <button class="btn-secondary" onclick="downloadInvoicePDF()">Download PDF</button>
    `;
    
    preview.innerHTML = html;
}

function loadInvoices() {
    const tbody = document.getElementById('invoiceTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    invoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${invoice.id}</td>
            <td>${invoice.customerName}</td>
            <td>${formatDate(invoice.invoiceDate)}</td>
            <td>${formatCurrency(0)}</td>
            <td><span class="badge">${invoice.status}</span></td>
            <td><button class="btn-secondary" onclick="viewInvoice('${invoice.id}')">View</button></td>
        `;
        tbody.appendChild(row);
    });
}

function generateAnalytics() {
    showAlert('Analytics generated', 'success');
}

function handleProfileUpdate(event) {
    event.preventDefault();
    showAlert('Profile updated successfully!', 'success');
}

// Utility functions
function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.alerts-container');
    if (container) {
        container.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(value);
}

function formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function generateId() {
    return 'ID_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function calculateGST(amount, gstRate) {
    return (amount * gstRate) / 100;
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    window.location.href = 'supplier-login.html';
}

