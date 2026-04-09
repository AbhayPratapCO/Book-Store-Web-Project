const STORAGE_KEY = 'mskathi-wishlist';

function getWishlist() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveWishlist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function isWishlisted(bookId) {
  return getWishlist().some(b => b.id === bookId);
}

export function toggleWishlist(book) {
  let list = getWishlist();
  const idx = list.findIndex(b => b.id === book.id);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.unshift({ id: book.id, title: book.title, author: book.author, price: book.price });
  }
  saveWishlist(list);
  renderWishlistPanel();
  updateWishlistBadge();
  return idx < 0; // returns true if now wishlisted
}

export function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  const count = getWishlist().length;
  if (badge) badge.textContent = count;
  if (badge) badge.classList.toggle('hidden', count === 0);
}

export function renderWishlistPanel() {
  const container = document.getElementById('wishlist-items');
  if (!container) return;
  const list = getWishlist();
  if (list.length === 0) {
    container.innerHTML = `<p class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">Your wishlist is empty.</p>`;
    return;
  }
  container.innerHTML = list.map(b => `
    <div class="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">${b.title}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">${b.author}</p>
        <p class="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-1">${b.price}</p>
      </div>
      <button onclick="removeFromWishlist('${b.id}')" class="text-gray-400 hover:text-red-500 transition-colors shrink-0" aria-label="Remove">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
      </button>
    </div>
  `).join('');
}

export function initWishlist() {
  // expose global for inline onclick
  window.removeFromWishlist = (id) => {
    let list = getWishlist().filter(b => b.id !== id);
    saveWishlist(list);
    renderWishlistPanel();
    updateWishlistBadge();
    // update heart icons on cards
    const btn = document.querySelector(`[data-wishlist-id="${id}"]`);
    if (btn) btn.classList.remove('wishlisted');
  };

  const toggle = document.getElementById('wishlist-toggle');
  const panel = document.getElementById('wishlist-panel');
  const overlay = document.getElementById('wishlist-overlay');
  const closeBtn = document.getElementById('wishlist-close');

  const open = () => { panel?.classList.remove('translate-x-full'); overlay?.classList.remove('hidden'); };
  const close = () => { panel?.classList.add('translate-x-full'); overlay?.classList.add('hidden'); };

  toggle?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);

  renderWishlistPanel();
  updateWishlistBadge();
}
