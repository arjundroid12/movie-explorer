# Movie Explorer

> Movie explorer with search, genre filters, sort, favorites, and detail modal. Uses 30 mock movies by default — easy to swap to live TMDB API.

![CI](https://github.com/arjundroid12/movie-explorer/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- **30 popular movies** included as mock data (Bollywood + Hollywood mix)
- **Search** by title or overview (debounced, 200ms)
- **Genre filter** dropdown
- **Sort** by rating, title, or year
- **Favorites** — click ☆ on any movie to add/remove; saved to localStorage
- **Detail modal** — click any card to see full overview, runtime, director, genres
- **Trending row** — top 10 by rating shown at top with horizontal scroll
- **Dark / light theme** with system preference detection

## 🔌 Using Live TMDB API (Optional)

The app currently uses mock data so it works without any setup. To use the live TMDB API:

1. Get a free API key from https://www.themoviedb.org/settings/api
2. Edit `assets/app.js` — replace `window.MOCK_MOVIES` references with `fetch()` calls:
   ```js
   const API_KEY = 'YOUR_KEY';  // or load from env var
   const r = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
   const data = await r.json();
   ```
3. **Never commit your API key** — use environment variables or a secrets manager

## 🚀 Live Demo

🟢 https://arjundroid12.github.io/movie-explorer/

## 📦 Run Locally

```bash
git clone https://github.com/arjundroid12/movie-explorer.git
cd movie-explorer
python3 -m http.server 8000
```

## 📄 License

MIT © Arjun Vashishtha
