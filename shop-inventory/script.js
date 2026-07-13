// Load stock and logs from localStorage, or start empty
let stock = JSON.parse(localStorage.getItem('stock')) || [];
let logs = JSON.parse(localStorage.getItem('logs')) || [];

const stockBody = document.getElementById('stockBody');
const logList = document.getElementById('logList');
const saleMessage = document.getElementById('saleMessage');

// Save to localStorage
function saveData() {
  localStorage.setItem('stock', JSON.stringify(stock));
  localStorage.setItem('logs', JSON.stringify(logs));
}

// Add a log entry
function addLog(text) {
  const timestamp = new Date().toLocaleString();
  logs.unshift(`${timestamp} — ${text}`);
  saveData();
  renderLogs();
}

// Render stock table
function renderStock() {
  stockBody.innerHTML = '';
  stock.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.unit}</td>
      <td><button class="delete-btn" onclick="deleteItem(${index})">Remove</button></td>
    `;
    stockBody.appendChild(row);
  });
}

// Render transaction logs
function renderLogs() {
  logList.innerHTML = '';
  logs.slice(0, 20).forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry;
    logList.appendChild(li);
  });
}

// Delete an item entirely from stock
function deleteItem(index) {
  const removed = stock[index];
  stock.splice(index, 1);
  addLog(`Removed item: ${removed.name}`);
  saveData();
  renderStock();
}

// Handle Raw Material form (stock IN)
document.getElementById('rawMaterialForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('rmName').value.trim();
  const qty = parseInt(document.getElementById('rmQty').value);
  const unit = document.getElementById('rmUnit').value.trim();

  const existing = stock.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.qty += qty;
  } else {
    stock.push({ name, qty, unit });
  }

  addLog(`Received ${qty} ${unit} of ${name}`);
  saveData();
  renderStock();
  this.reset();
});

// Handle Sale form (stock OUT)
document.getElementById('saleForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('saleName').value.trim();
  const qty = parseInt(document.getElementById('saleQty').value);

  const item = stock.find(item => item.name.toLowerCase() === name.toLowerCase());

  if (!item) {
    saleMessage.textContent = `❌ "${name}" not found in stock.`;
    saleMessage.style.color = 'red';
    return;
  }

  if (item.qty < qty) {
    saleMessage.textContent = `⚠️ Not enough stock! Only ${item.qty} ${item.unit} available.`;
    saleMessage.style.color = 'orange';
    return;
  }

  item.qty -= qty;
  saleMessage.textContent = `✅ Sold ${qty} ${item.unit} of ${name}. Remaining: ${item.qty} ${item.unit}.`;
  saleMessage.style.color = 'green';

  addLog(`Sold ${qty} ${item.unit} of ${name}`);
  saveData();
  renderStock();
  this.reset();
});

// Initial render on page load
renderStock();
renderLogs();