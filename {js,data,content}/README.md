# Ms Kathi Book Store

A fully-featured static website for Ms Kathi Book Store, Khan Market, New Delhi.  
Books can be enquired about and shipped worldwide.

## Features

- 📚 **22+ Book Database** — Fiction, Classic Literature, Non-Fiction, and Rare Books
- 🔍 **Search & Filter** — Real-time search by title/author, filter by category
- 🌙 **Dark Mode** — Toggleable, respects system preference, persists across sessions
- ❤️ **Wishlist** — Add/remove books, stored in browser localStorage
- 🕐 **Recently Viewed** — Tracks last 6 books you browsed
- 📋 **Enquiry History** — Stores all past enquiries locally in browser
- 📬 **Enquiry Form** — Pre-fills book/author when clicking "Enquire" on a card
- 📱 **Responsive** — Works on all screen sizes

## Project Structure

```
├── index.html
├── styles.css
├── js/
│   ├── main.js           # Core app logic
│   ├── darkmode.js       # Dark mode toggle
│   ├── enquiry.js        # Enquiry form + local history
│   ├── wishlist.js       # Wishlist panel
│   ├── recentlyviewed.js # Recently viewed tracker
│   └── parallax.js       # Hero parallax effect
├── data/
│   ├── books.json        # Book database (22 titles)
│   ├── categories.json   # Category metadata
│   └── testimonials.json # Reader testimonials
└── content/
    └── content.md        # About section copy
```

## Running Locally

Because the site uses ES modules and fetches JSON files, you need a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .
```

Then open `http://localhost:8000` in your browser.

## Deploying to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, root `/`
4. Your site will be live at `https://<username>.github.io/<repo-name>/`

## Tech Stack

- Vanilla HTML / CSS / JavaScript (ES Modules)
- Tailwind CSS (CDN)
- marked.js for Markdown rendering
- All data stored in JSON files — no backend required
- localStorage for wishlist, history, dark mode preference
