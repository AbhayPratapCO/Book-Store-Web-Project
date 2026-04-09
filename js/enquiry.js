const STORAGE_KEY = 'mskathi-enquiry-history';

function getHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveEnquiry(data) {
  const history = getHistory();
  history.unshift({ ...data, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
}

export function renderEnquiryHistory() {
  const container = document.getElementById('enquiry-history-list');
  const section = document.getElementById('enquiry-history-section');
  if (!container || !section) return;

  const history = getHistory();
  if (history.length === 0) { section.classList.add('hidden'); return; }

  section.classList.remove('hidden');
  container.innerHTML = history.map((e, i) => `
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="font-medium text-gray-900 dark:text-gray-100 text-sm">${e.book_name}</p>
          ${e.author_name ? `<p class="text-xs text-gray-500 dark:text-gray-400">by ${e.author_name}</p>` : ''}
        </div>
        <span class="text-xs text-gray-400 dark:text-gray-500 shrink-0">${e.date}</span>
      </div>
      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Sent by <span class="font-medium">${e.name}</span> · ${e.email}</p>
      ${e.message ? `<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 italic truncate">"${e.message}"</p>` : ''}
    </div>
  `).join('');
}

export function initEnquiry() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    saveEnquiry(data);
    renderEnquiryHistory();

    const toast = document.getElementById('toast');
    toast.textContent = "✓ Enquiry sent. We'll contact you shortly.";
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 4000);
    form.reset();
  });

  renderEnquiryHistory();
}
