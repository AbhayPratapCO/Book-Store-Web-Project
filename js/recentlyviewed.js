const STORAGE_KEY = 'mskathi-recently-viewed';
const MAX = 6;

export function trackView(book) {
  let list = getRecentlyViewed().filter(b => b.id !== book.id);
  list.unshift({ id: book.id, title: book.title, author: book.author, price: book.price, category: book.category, image: book.image });
  if (list.length > MAX) list = list.slice(0, MAX);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  renderRecentlyViewed();
}

export function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

export function renderRecentlyViewed() {
  const section = document.getElementById('recently-viewed-section');
  const container = document.getElementById('recently-viewed-grid');
  if (!section || !container) return;

  const list = getRecentlyViewed();
  if (list.length === 0) { section.classList.add('hidden'); return; }

  section.classList.remove('hidden');
  container.innerHTML = list.map(b => `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex gap-3 p-3 items-center">
      <img src="${b.image}" alt="${b.title}" class="w-14 h-14 object-cover rounded shrink-0">
      <div class="min-w-0">
        <p class="text-sm font-serif font-medium text-gray-900 dark:text-gray-100 truncate">${b.title}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${b.author}</p>
        <p class="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-0.5">${b.price}</p>
      </div>
    </div>
  `).join('');
}
