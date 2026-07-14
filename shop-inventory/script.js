// Shared data
let items = JSON.parse(localStorage.getItem('items')) || [];
let stock = JSON.parse(localStorage.getItem('stock')) || [];
let logs = JSON.parse(localStorage.getItem('logs')) || [];

function saveData() {
  localStorage.setItem('items', JSON.stringify(items));
  localStorage.setItem('stock', JSON.stringify(stock));
  localStorage.setItem('logs', JSON.stringify(logs));
}

function addLog(text) {
  const timestamp = new Date().toLocaleString();
  logs.unshift(`${timestamp} — ${text}`);
  saveData();
}

// ---------- ADD ITEM PAGE ----------
const addItemForm = document.getElementById('addItemForm');
if (addItemForm) {
  const existingItemsList = document.getElementById('existingItemsList');
  const itemMessage = document.getElementById('itemMessage');

  function renderExistingItems() {
    existingItemsList.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} (${item.unit})`;
      existingItemsList.appendChild(li);
    });
  }

  addItemForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('itemName').value.trim();
    const unit = document.getElementById('itemUnit').value;

    const exists = items.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      itemMessage.textContent = `⚠️ "${name}" already exists with unit "${exists.unit}".`;
      itemMessage.style.color = 'orange';
      return;
    }

    items.push({ name, unit });
    saveData();
    itemMessage.textContent = `✅ "${name}" added successfully! Redirecting to Receive Material...`;
    itemMessage.style.color = 'green';

    setTimeout(() => {
      window.location.href = 'receive.html';
    }, 1200);
  });

  renderExistingItems();
}

// ---------- RECEIVE PAGE ----------
const rawMaterialForm = document.getElementById('rawMaterialForm');
if (rawMaterialForm) {
  const rmSelect = document.getElementById('rmSelect');
  const rmUnitDisplay = document.getElementById('rmUnitDisplay');
  const rmMessage = document.getElementById('rmMessage');

  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.name;
    opt.textContent = item.name;
    rmSelect.appendChild(opt);
  });

  rmSelect.addEventListener('change', function () {
    const selected = items.find(i => i.name === this.value);
    rmUnitDisplay.value = selected ? selected.unit : '';
  });

  rawMaterialForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = rmSelect.value;
    const qty = parseInt(document.getElementById('rmQty').value);
    const unit = rmUnitDisplay.value;

    if (!name) {
      rmMessage.textContent = '❌ Please select an item.';
      rmMessage.style.color = 'red';
      return;
    }

    const existingStock = stock.find(s => s.name === name);
    if (existingStock) {
      existingStock.qty += qty;
    } else {
      stock.push({ name, qty, unit });
    }

    addLog(`Received ${qty} ${unit} of ${name}`);
    saveData();

    rmMessage.textContent = `✅ Added ${qty} ${unit} of ${name} to stock. Redirecting to Stock page...`;
    rmMessage.style.color = 'green';

    setTimeout(() => {
      window.location.href = 'stock.html';
    }, 1200);
  });
}

// ---------- SALE PAGE ----------
const saleForm = document.getElementById('saleForm');
if (saleForm) {
  const saleSelect = document.getElementById('saleSelect');
  const saleUnitDisplay = document.getElementById('saleUnitDisplay');
  const saleMessage = document.getElementById('saleMessage');

  stock.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.name;
    opt.textContent = `${item.name} (${item.qty} ${item.unit} available)`;
    saleSelect.appendChild(opt);
  });

  saleSelect.addEventListener('change', function () {
    const selected = stock.find(s => s.name === this.value);
    saleUnitDisplay.value = selected ? selected.unit : '';
  });

  saleForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = saleSelect.value;
    const qty = parseInt(document.getElementById('saleQty').value);
    const item = stock.find(s => s.name === name);

    if (!item) {
      saleMessage.textContent = '❌ Item not found in stock.';
      saleMessage.style.color = 'red';
      return;
    }

    if (item.qty < qty) {
      saleMessage.textContent = `⚠️ Not enough stock! Only ${item.qty} ${item.unit} available.`;
      saleMessage.style.color = 'orange';
      return;
    }

    item.qty -= qty;
    addLog(`Sold ${qty} ${item.unit} of ${name}`);
    saveData();

    saleMessage.textContent = `✅ Sold ${qty} ${item.unit} of ${name}. Redirecting to Stock page...`;
    saleMessage.style.color = 'green';

    setTimeout(() => {
      window.location.href = 'stock.html';
    }, 1200);
  });
}

// ---------- STOCK PAGE ----------
const stockBody = document.getElementById('stockBody');
if (stockBody) {
  const logList = document.getElementById('logList');

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

    document.getElementById('totalItemsCount').textContent = stock.length;
    const totalQty = stock.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('totalQuantitySum').textContent = totalQty;
  }

  function renderLogs() {
    logList.innerHTML = '';
    logs.slice(0, 20).forEach(entry => {
      const li = document.createElement('li');
      li.textContent = entry;
      logList.appendChild(li);
    });
  }

  window.deleteItem = function (index) {
    const removed = stock[index];
    stock.splice(index, 1);
    addLog(`Removed item: ${removed.name}`);
    saveData();
    renderStock();
  };

  renderStock();
  renderLogs();
}