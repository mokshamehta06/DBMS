// Shopkeeper Dashboard JavaScript
let billItems = [];
let customers = [];
let inventory = [];
let bills = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadDashboardData();
    initializeDateInputs();
    loadCustomers();
    loadInventory();
    loadBills();
});

function checkAuth() {
    const currentUser = getFromLocalStorage('currentUser');
    if (!currentUser || currentUser.role !== 'shopkeeper') {
        window.location.href = 'shoplogin.html';
        return;
    }
    document.getElementById('shopkeeperUsername').textContent = currentUser.username;
}

function loadDashboardData() {
    customers = getFromLocalStorage('shopkeeper_customers') || [];
    inventory = getFromLocalStorage('shopkeeper_inventory') || [];
    bills = getFromLocalStorage('shopkeeper_bills') || [];
}

function initializeDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const billDate = document.getElementById('billDate');
    const reportFromDate = document.getElementById('reportFromDate');
    const reportToDate = document.getElementById('reportToDate');
    
    if (billDate) billDate.value = today;
    if (reportFromDate) reportFromDate.value = today;
    if (reportToDate) reportToDate.value = today;
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
    saveToLocalStorage('shopkeeper_customers', customers);
    
    document.getElementById('customerForm').reset();
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
        saveToLocalStorage('shopkeeper_customers', customers);
        loadCustomers();
        showAlert('Customer deleted', 'success');
    }
}

// Inventory Management
function handleAddInventory(event) {
    event.preventDefault();
    
    const product = {
        id: generateId(),
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        quantity: parseInt(document.getElementById('productQuantity').value),
        gst: parseInt(document.getElementById('productGST').value),
        createdAt: new Date().toISOString()
    };
    
    inventory.push(product);
    saveToLocalStorage('shopkeeper_inventory', inventory);
    
    document.getElementById('inventoryForm').reset();
    showAlert('Product added successfully!', 'success');
    loadInventory();
}

function loadInventory() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;
                
    
    tbody.innerHTML = '';
    inventory.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
           
            <td>${formatCurrency(product.price)}</td>
            <td>${product.quantity}</td>
            <td>${product.gst}%</td>
            <td><button class="btn-secondary" onclick="deleteProduct('${product.id}')">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteProduct(productId) {
    if (confirm('Are you sure?')) {
        inventory = inventory.filter(p => p.id !== productId);
        saveToLocalStorage('shopkeeper_inventory', inventory);
        loadInventory();
        showAlert('Product deleted', 'success');
    }
}

// Bill Generation
function addBillItem() {
    const itemsDiv = document.getElementById('billItems');
    const itemId = generateId();
    
    const itemHTML = `
        <div class="bill-item" id="item-${itemId}">
            <select onchange="updateBillItem('${itemId}')">
                <option value="">Select Product</option>
                ${inventory.map(p => `<option value="${p.id}" data-price="${p.price}" data-gst="${p.gst}">${p.name}</option>`).join('')}
            </select>
            <input type="number" placeholder="Qty" value="1" onchange="updateBillItem('${itemId}')">
            <input type="number" placeholder="Price" readonly>
            <input type="number" placeholder="GST" readonly>
            <button class="btn-secondary" onclick="removeBillItem('${itemId}')">Remove</button>
        </div>
    `;
    
    itemsDiv.innerHTML += itemHTML;
}

function updateBillItem(itemId) {
    // Update logic for bill items
}

function removeBillItem(itemId) {
    const item = document.getElementById(`item-${itemId}`);
    if (item) item.remove();
}

function generateBill() {
    const customerId = document.getElementById('customerSelect').value;
    const billDate = document.getElementById('billDate').value;
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    
    if (!customerId) {
        showAlert('Please select a customer', 'error');
        return;
    }
    
    const customer = customers.find(c => c.id === customerId);
    const bill = {
        id: generateId(),
        customerId: customerId,
        customerName: customer.name,
        date: billDate,
        items: billItems,
        discount: discountPercent,
        createdAt: new Date().toISOString()
    };
    
    bills.push(bill);
    saveToLocalStorage('shopkeeper_bills', bills);
    
    showAlert('Bill generated successfully!', 'success');
    displayBillPreview(bill);
}

function displayBillPreview(bill) {
    const preview = document.getElementById('billPreview');
    let totalAmount = 0;
    let totalGST = 0;
    
    let html = `
        <h4>Bill Preview</h4>
        <p><strong>Bill ID:</strong> ${bill.id}</p>
        <p><strong>Customer:</strong> ${bill.customerName}</p>
        <p><strong>Date:</strong> ${formatDate(bill.date)}</p>
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
    
    bill.items.forEach(item => {
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
    
    const discount = (totalAmount * bill.discount) / 100;
    const finalTotal = totalAmount + totalGST - discount;
    
    html += `
            </tbody>
        </table>
        <p><strong>Subtotal:</strong> ${formatCurrency(totalAmount)}</p>
        <p><strong>GST:</strong> ${formatCurrency(totalGST)}</p>
        <p><strong>Discount:</strong> ${formatCurrency(discount)}</p>
        <p class="total"><strong>Total:</strong> ${formatCurrency(finalTotal)}</p>
        <button class="btn-secondary" onclick="printBill()">Print</button>
        <button class="btn-secondary" onclick="downloadBillPDF()">Download PDF</button>
    `;
    
    preview.innerHTML = html;
}

function loadBills() {
    const tbody = document.getElementById('purchaseTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    bills.forEach(bill => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bill.id}</td>
            <td>${bill.customerName}</td>
            <td>${formatDate(bill.date)}</td>
            <td>${formatCurrency(0)}</td>
            <td>${formatCurrency(0)}</td>
            <td>${formatCurrency(0)}</td>
            <td><button class="btn-secondary" onclick="viewBill('${bill.id}')">View</button></td>
        `;
        tbody.appendChild(row);
    });
}

function generateSalesReport() {
    showAlert('Report generated', 'success');
}

function exportSalesReport() {
    showAlert('Report exported', 'success');
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
    window.location.href = 'shoplogin.html';
}