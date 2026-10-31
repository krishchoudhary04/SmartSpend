// Base URL of your FastAPI server (local or deployed)
const API_BASE_URL =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000"
        : "https://smartspend-tswc.onrender.com";

// Supabase Configuration
const SUPABASE_URL = 'https://jstwjjrwatvzwccaoohj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_oV7O0LeN6iqCpL0sIycTDg_e6HzQIhr';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

let isLoginMode = true;

// Authenticated API request helper
async function apiFetch(url, options = {}) {
  const { data: { session }, error } =
    await supabaseClient.auth.getSession();

  if (error || !session) {
    throw new Error('Please login to continue.');
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.access_token}`
    }
  });
}

// Switch between Login and Signup
document.getElementById('authSwitch').addEventListener('click', () => {
  isLoginMode = !isLoginMode;

  document.getElementById('authTitle').textContent =
    isLoginMode ? 'Login' : 'Create Account';

  document.getElementById('authSubmit').textContent =
    isLoginMode ? 'Login' : 'Sign Up';

  document.getElementById('authSwitchText').textContent =
    isLoginMode ? "Don't have an account?" : 'Already have an account?';

  document.getElementById('authSwitch').textContent =
    isLoginMode ? 'Sign Up' : 'Login';

  document.getElementById('authMessage').textContent = '';
});

// Login / Signup
document.getElementById('authForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  const message = document.getElementById('authMessage');
  const submitBtn = document.getElementById('authSubmit');

  submitBtn.disabled = true;
  message.textContent = 'Please wait...';

  try {
    let result;

    if (isLoginMode) {
      result = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
    } else {
      result = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/index.html`
        }
      });
    }

    if (result.error) {
      throw result.error;
    }

    if (!isLoginMode && !result.data.session) {
      message.textContent = 'Account created! Please verify your email.';
    } else {
      message.textContent = isLoginMode
        ? 'Login successful! Authentication is working.'
        : 'Account created and authenticated successfully!';
    }

  } catch (error) {
    message.textContent = error.message;
  } finally {
    submitBtn.disabled = false;
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        alert(error.message);
        return;
    }

    showToast('Logged out successfully!');
});

// Global application state
let allExpenses = [];
let categoryChart = null;

// Currency symbol helper
const CURRENCY = '₹';

// Format currency
function formatCurrency(num) {
  const value = parseFloat(num) || 0;
  return `${CURRENCY}${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// Category color and badge mapper
const CATEGORY_COLORS = {
  'food': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', hex: '#10b981' },
  'groceries': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', hex: '#22c55e' },
  'rent': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', hex: '#3b82f6' },
  'travel': { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200', hex: '#06b6d4' },
  'shopping': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', hex: '#a855f7' },
  'utilities': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', hex: '#f59e0b' },
  'entertainment': { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', hex: '#ec4899' },
  'healthcare': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', hex: '#ef4444' },
  'default': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', hex: '#6366f1' }
};

function getCategoryColor(categoryName = '') {
  const lower = (categoryName || '').toLowerCase();

  for (const key of Object.keys(CATEGORY_COLORS)) {
    if (lower.includes(key)) return CATEGORY_COLORS[key];
  }

  return CATEGORY_COLORS['default'];
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  const isSuccess = type === 'success';

  toast.className = `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 transform translate-y-2 opacity-0 text-white ${
    isSuccess ? 'bg-slate-900' : 'bg-red-600'
  }`;

  toast.innerHTML = `
    <i class="fa-solid ${isSuccess ? 'fa-circle-check text-emerald-400' : 'fa-circle-exclamation text-white'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ----------------------------------------------------
// API Communication
// ----------------------------------------------------

async function checkApiHealth() {
  const statusEl = document.getElementById('apiStatus');

  try {
    const res = await apiFetch(`${API_BASE_URL}/expenses`, {
      method: 'GET'
    });

    if (res.ok) {
      statusEl.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200';
      statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500"></span> Backend Connected';
      return true;
    }
  } catch (err) {
    statusEl.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200';
    statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-rose-500"></span> Backend Offline (Port 8000)';
  }

  return false;
}

// Fetch total spend and category summaries
async function fetchSummaries() {
  try {
    const [totalRes, categoryRes] = await Promise.all([
      apiFetch(`${API_BASE_URL}/expenses/summary/total`),
      apiFetch(`${API_BASE_URL}/expenses/summary/category`)
    ]);

    let total = 0;

    if (totalRes.ok) {
      const data = await totalRes.json();
      total = parseFloat(data.total_spending) || 0;
      document.getElementById('totalSpendingDisplay').textContent = formatCurrency(total);
    }

    if (categoryRes.ok) {
      const catData = await categoryRes.json();
      updateCategoryAnalytics(catData, total);
      updateCategoryFilterDropdown(catData);
    }

  } catch (error) {
    console.error('Error fetching summaries:', error);
  }
}

// Fetch all expenses
async function fetchAllExpenses() {
  const tbody = document.getElementById('expensesTableBody');

  try {
    const res = await apiFetch(`${API_BASE_URL}/expenses`);

    if (!res.ok) throw new Error('Failed to load expenses');

    allExpenses = await res.json();

    // Update KPI counters
    document.getElementById('totalTransactionsDisplay').textContent = allExpenses.length;

    const avg = allExpenses.length > 0
      ? (allExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0) / allExpenses.length)
      : 0;

    document.getElementById('avgExpenseDisplay').textContent = formatCurrency(avg);

    renderExpensesTable(allExpenses);

  } catch (error) {
    console.error('Error:', error);

    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="py-8 text-center text-red-500 text-sm">
          <i class="fa-solid fa-triangle-exclamation mr-1"></i>
          Failed to connect to server at <code>${API_BASE_URL}</code>
        </td>
      </tr>
    `;
  }
}

// Master refresh
async function fetchAllData() {
  await checkApiHealth();
  await Promise.all([fetchSummaries(), fetchAllExpenses()]);
}

// ----------------------------------------------------
// UI Rendering
// ----------------------------------------------------

function renderExpensesTable(expenses) {
  const tbody = document.getElementById('expensesTableBody');

  if (!expenses || expenses.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="py-12 text-center text-slate-400">
          <i class="fa-regular fa-folder-open text-3xl mb-2 block text-slate-300"></i>
          No expenses found. Click <strong>"Add Expense"</strong> to log your first spend!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = expenses.map(expense => {
    const catStyle = getCategoryColor(expense.category);

    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3 px-5">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${catStyle.bg} ${catStyle.text} border ${catStyle.border}">
            ${escapeHtml(expense.category)}
          </span>
        </td>
        <td class="py-3 px-5 text-slate-700 font-medium">
          ${escapeHtml(expense.description || '—')}
        </td>
        <td class="py-3 px-5 text-right font-bold text-slate-900">
          ${formatCurrency(expense.amount)}
        </td>
        <td class="py-3 px-5 text-center">
          <div class="inline-flex items-center gap-1.5">
            <button
              onclick="editExpense(${expense.id})"
              title="Edit"
              class="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors text-xs"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              onclick="deleteExpense(${expense.id})"
              title="Delete"
              class="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateCategoryAnalytics(categoryData, totalSpend) {
  const progressContainer = document.getElementById('categoryProgressList');
  const noChart = document.getElementById('noChartData');

  if (!categoryData || categoryData.length === 0 || totalSpend === 0) {
    progressContainer.innerHTML = '<p class="text-xs text-slate-400">No category breakdown available yet.</p>';
    document.getElementById('topCategoryDisplay').textContent = '—';
    document.getElementById('topCategoryAmount').textContent = 'Highest expenditure';

    if (categoryChart) categoryChart.destroy();

    noChart.classList.remove('hidden');
    return;
  }

  noChart.classList.add('hidden');

  // Sort descending by total_spending
  const sorted = [...categoryData].sort(
    (a, b) => parseFloat(b.total_spending) - parseFloat(a.total_spending)
  );

  // Top category card
  const top = sorted[0];

  document.getElementById('topCategoryDisplay').textContent = top.category;
  document.getElementById('topCategoryAmount').textContent =
    `${formatCurrency(top.total_spending)} spent`;

  // Progress bars
  progressContainer.innerHTML = sorted.map(item => {
    const itemTotal = parseFloat(item.total_spending) || 0;
    const percentage = totalSpend > 0
      ? ((itemTotal / totalSpend) * 100).toFixed(1)
      : 0;

    const color = getCategoryColor(item.category).hex;

    return `
      <div>
        <div class="flex justify-between items-center text-xs mb-1">
          <span class="font-medium text-slate-700">${escapeHtml(item.category)}</span>
          <span class="font-semibold text-slate-900">
            ${formatCurrency(itemTotal)}
            <span class="text-slate-400 font-normal">(${percentage}%)</span>
          </span>
        </div>
        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500" style="width: ${percentage}%; background-color: ${color};"></div>
        </div>
      </div>
    `;
  }).join('');

  // Update Doughnut Chart
  const ctx = document.getElementById('categoryChart').getContext('2d');
  const labels = sorted.map(s => s.category);
  const dataValues = sorted.map(s => parseFloat(s.total_spending));
  const backgroundColors = sorted.map(s => getCategoryColor(s.category).hex);

  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: '#ffffff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      cutout: '72%'
    }
  });
}

function updateCategoryFilterDropdown(categories) {
  const select = document.getElementById('categoryFilter');
  const currentVal = select.value;

  select.innerHTML = '<option value="ALL">All Categories</option>';

  categories.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.category;
    opt.textContent = item.category;
    select.appendChild(opt);
  });

  select.value = currentVal;
}

// ----------------------------------------------------
// Filter & Search Logic
// ----------------------------------------------------

async function handleFilterCategory() {
  const selected = document.getElementById('categoryFilter').value;

  if (selected === 'ALL') {
    renderExpensesTable(allExpenses);
    return;
  }

  try {
    const res = await apiFetch(
      `${API_BASE_URL}/expenses/category/${encodeURIComponent(selected)}`
    );

    if (res.ok) {
      const filtered = await res.json();
      renderExpensesTable(filtered);
    }

  } catch (err) {
    console.error('Filter error:', err);
  }
}

function handleSearch() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();

  if (!query) {
    renderExpensesTable(allExpenses);
    return;
  }

  const filtered = allExpenses.filter(exp =>
    (exp.description && exp.description.toLowerCase().includes(query)) ||
    (exp.category && exp.category.toLowerCase().includes(query))
  );

  renderExpensesTable(filtered);
}

// ----------------------------------------------------
// Add / Edit / Delete Handlers
// ----------------------------------------------------

function openModal(isEdit = false) {
  const modal = document.getElementById('expenseModal');
  const title = document.getElementById('modalTitle');

  if (!isEdit) {
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseId').value = '';
    title.textContent = 'Add New Expense';
  } else {
    title.textContent = 'Edit Expense';
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('expenseModal').classList.add('hidden');
}

function editExpense(id) {
  const expense = allExpenses.find(e => e.id === id);

  if (!expense) return;

  document.getElementById('expenseId').value = expense.id;
  document.getElementById('formAmount').value = expense.amount;
  document.getElementById('formCategory').value = expense.category;
  document.getElementById('formDescription').value = expense.description || '';

  openModal(true);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('expenseId').value;
  const amount = parseFloat(document.getElementById('formAmount').value);
  const category = document.getElementById('formCategory').value.trim();
  const description = document.getElementById('formDescription').value.trim() || null;

  const payload = { amount, category, description };

  const isEdit = Boolean(id);
  const url = isEdit
    ? `${API_BASE_URL}/expenses/${id}`
    : `${API_BASE_URL}/expenses`;

  const method = isEdit ? 'PUT' : 'POST';

  try {
    const res = await apiFetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to save expense');
    }

    closeModal();

    showToast(
      isEdit
        ? 'Expense updated successfully!'
        : 'Expense added successfully!'
    );

    await fetchAllData();

  } catch (error) {
    alert(error.message);
  }
}

async function deleteExpense(id) {
  if (!confirm('Are you sure you want to delete this expense?')) return;

  try {
    // Calling singular /expense/{id} as defined in api.py
    const res = await apiFetch(`${API_BASE_URL}/expense/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('Failed to delete expense');

    showToast('Expense removed successfully');

    await fetchAllData();

  } catch (error) {
    alert(error.message);
  }
}

// Security: Escape HTML to avoid XSS
function escapeHtml(text) {
  if (!text) return '';

  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Show the correct screen based on authentication
function updateAuthScreen(session) {
  const authScreen = document.getElementById('authScreen');
  const appContent = document.getElementById('appContent');

  if (session) {
    authScreen.classList.add('hidden');
    appContent.classList.remove('hidden');
  } else {
    authScreen.classList.remove('hidden');
    appContent.classList.add('hidden');
  }
}

// Restore session and listen for login/logout changes
window.addEventListener('DOMContentLoaded', async () => {
  const { data: { session }, error } =
    await supabaseClient.auth.getSession();

  if (error) {
    console.error('Session error:', error.message);
  }

  updateAuthScreen(session);

  if (session) {
    fetchAllData();
  }

  supabaseClient.auth.onAuthStateChange((event, session) => {
    updateAuthScreen(session);

    if (event === 'SIGNED_IN') {
      fetchAllData();
    }
  });
});
