import { initParallax } from "./parallax.js";
import { initEnquiry, renderEnquiryHistory } from "./enquiry.js";
import { initDarkMode } from "./darkmode.js";
import { initWishlist, toggleWishlist, isWishlisted, updateWishlistBadge } from "./wishlist.js";
import { trackView, renderRecentlyViewed } from "./recentlyviewed.js";

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  initDarkMode();
  initParallax();
  initEnquiry();
  initWishlist();
  renderRecentlyViewed();

  // Scroll reveal
  const revealEls = Array.from(document.querySelectorAll('[data-reveal="true"]'));
  const revealOnScroll = () => {
    const vh = window.innerHeight * 0.9;
    for (const el of revealEls) {
      if (el.getBoundingClientRect().top <= vh) el.classList.add('reveal-visible');
    }
  };
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll, { passive: true });

  // About content
  const aboutContentEl = document.getElementById('about-content');
  try {
    const md = await fetch('./content/content.md').then(r => r.text());
    aboutContentEl.innerHTML = marked.parse(md);
  } catch {
    aboutContentEl.innerHTML = "<p>Welcome to Ms Kathi Book Store, a sanctuary for readers and dreamers alike.</p>";
  }

  // Load books
  let allBooks = [];
  try {
    allBooks = await fetch('./data/books.json').then(r => r.json());
  } catch {
    console.warn('Could not load books.json');
  }

  // Render book cards
  function renderBooks(books) {
    const grid = document.getElementById('collection-grid');
    if (!grid) return;
    if (books.length === 0) {
      grid.innerHTML = `<div class="col-span-full text-center py-12" style="color:var(--muted)">
        <p class="text-4xl mb-3">📚</p><p>No books found. Try a different search.</p>
      </div>`;
      return;
    }
    grid.innerHTML = books.map(book => {
      const wished = isWishlisted(book.id);

      // Action button: Buy Now (available) vs Enquire (on request)
      const actionBtn = book.available
        ? `<button
              class="buy-now-btn text-xs font-semibold px-3 py-1.5 rounded transition-all duration-200 flex items-center gap-1"
              style="background: var(--primary); color: #fff;"
              data-book='${JSON.stringify({ id: book.id, title: book.title, author: book.author, price: book.price, image: book.image, year: book.year, category: book.category }).replace(/'/g, "&#39;")}'
              data-book-id="${book.id}">
              🛒 Buy Now
           </button>`
        : `<button
              class="enquire-btn text-xs font-semibold px-3 py-1.5 rounded transition-all duration-200"
              style="background: #78716c; color: #fff;"
              data-book-name="${book.title}"
              data-author="${book.author}">
              📩 Enquire
           </button>`;

      return `
        <article class="rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col" style="background: var(--card-bg);">
          <div class="relative h-44 bg-cover bg-center" style="background-image:url('${book.image}');">
            <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            <span class="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full
              ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}">
              ${book.available ? 'Available' : 'On Request'}
            </span>
            <button
              data-wishlist-id="${book.id}"
              data-book='${JSON.stringify({ id: book.id, title: book.title, author: book.author, price: book.price }).replace(/'/g, "&#39;")}'
              class="wishlist-btn absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow transition-colors ${wished ? 'wishlisted' : ''}"
              aria-label="Add to wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="${wished ? '#ef4444' : 'none'}" viewBox="0 0 24 24" stroke="${wished ? '#ef4444' : 'currentColor'}" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>
          <div class="p-4 flex flex-col flex-1">
            <h3 class="text-sm font-serif font-semibold mb-0.5 line-clamp-2" style="color: var(--text); font-family: 'Playfair Display', serif;">${book.title}</h3>
            <p class="text-xs mb-1" style="color: var(--muted);">${book.author} · ${book.year}</p>
            <p class="text-xs mb-3 flex-1 line-clamp-3" style="color: var(--text);">${book.description}</p>
            <div class="flex items-center justify-between mt-auto gap-2">
              <span class="text-sm font-bold" style="color: var(--accent);">${book.price}</span>
              ${actionBtn}
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Wishlist button events
    grid.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const book = JSON.parse(btn.getAttribute('data-book').replace(/&#39;/g, "'"));
        const nowWished = toggleWishlist(book);
        const svg = btn.querySelector('svg');
        svg.setAttribute('fill', nowWished ? '#ef4444' : 'none');
        svg.setAttribute('stroke', nowWished ? '#ef4444' : 'currentColor');
        btn.classList.toggle('wishlisted', nowWished);
      });
    });

    // Buy Now button → go to checkout page
    grid.querySelectorAll('.buy-now-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookData = JSON.parse(btn.getAttribute('data-book').replace(/&#39;/g, "'"));
        const bookId   = btn.getAttribute('data-book-id');
        const book     = allBooks.find(b => b.id === bookId);
        if (book) trackView(book);
        sessionStorage.setItem('mskathi-checkout-book', JSON.stringify(bookData));
        window.location.href = 'checkout.html';
      });
    });

    // Enquire button → scroll to form and prefill
    grid.querySelectorAll('.enquire-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.closest('article').querySelector('.wishlist-btn')?.dataset.wishlistId;
        const book   = allBooks.find(b => b.id === bookId);
        if (book) trackView(book);

        const bookName = btn.getAttribute('data-book-name');
        const author   = btn.getAttribute('data-author');
        document.getElementById('form-book-name').value   = bookName;
        document.getElementById('form-author-name').value = author;
        document.getElementById('enquiry').scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => document.getElementById('form-name').focus(), 600);
      });
    });
  }

  renderBooks(allBooks);

  // Search & filter
  const searchInput  = document.getElementById('search-input');
  const filterBtns   = document.querySelectorAll('.filter-btn');
  let activeCategory = 'all';

  function applyFilters() {
    const query    = (searchInput?.value || '').toLowerCase().trim();
    const filtered = allBooks.filter(b => {
      const matchCat = activeCategory === 'all' || b.category === activeCategory;
      const matchQ   = !query || b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
      return matchCat && matchQ;
    });
    renderBooks(filtered);
  }

  searchInput?.addEventListener('input', applyFilters);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('filter-active'));
      btn.classList.add('filter-active');
      activeCategory = btn.dataset.cat;
      applyFilters();
    });
  });

  // Testimonials
  const tContainer = document.getElementById('testimonials-container');
  try {
    const testimonials = await fetch('./data/testimonials.json').then(r => r.json());
    testimonials.forEach(t => {
      const slide = document.createElement('div');
      slide.className = "min-w-full rounded-md p-6 shadow-md";
      slide.style.cssText = "flex: 0 0 100%; background: var(--card-bg);";
      slide.innerHTML = `
        <p class="italic text-base" style="color: var(--text);">"${t.text}"</p>
        <p class="text-sm mt-3 font-medium" style="color: var(--muted);">— ${t.name}</p>
      `;
      tContainer.appendChild(slide);
    });
  } catch {
    tContainer.innerHTML = "<div class='p-4' style='color:var(--text)'>No testimonials at the moment.</div>";
  }

  const slides = tContainer.children;
  let idx = 0;
  const showSlide = (i) => {
    for (let s of slides) s.style.display = 'none';
    if (slides[i]) slides[i].style.display = 'block';
  };
  showSlide(idx);
  document.getElementById('next')?.addEventListener('click', () => { idx = (idx + 1) % slides.length; showSlide(idx); });
  document.getElementById('prev')?.addEventListener('click', () => { idx = (idx - 1 + slides.length) % slides.length; showSlide(idx); });
  setInterval(() => { idx = (idx + 1) % slides.length; showSlide(idx); }, 5000);
});

