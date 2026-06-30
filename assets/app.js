/* Movie Explorer — vanilla JS */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const all = window.MOCK_MOVIES;
  const FAV_KEY = "movies.favorites";
  const THEME_KEY = "movies.theme";
  let favorites = new Set();
  try { favorites = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")); } catch {}

  const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function populateGenres() {
    const genres = new Set();
    all.forEach((m) => m.genres.forEach((g) => genres.add(g)));
    const sel = $("#genreFilter");
    [...genres].sort().forEach((g) => {
      const opt = document.createElement("option");
      opt.value = g; opt.textContent = g;
      sel.appendChild(opt);
    });
  }

  function renderCard(movie) {
    const isFav = favorites.has(movie.id);
    const div = document.createElement("div");
    div.className = `movie-card${isFav ? " is-fav" : ""}`;
    div.innerHTML = `
      <div class="movie-card__poster">${movie.poster}</div>
      <div class="movie-card__body">
        <div class="movie-card__title">${escape(movie.title)}</div>
        <div class="movie-card__meta">
          <span>${movie.year}</span>
          <span class="movie-card__rating">★ ${movie.rating}</span>
        </div>
      </div>`;
    div.addEventListener("click", () => openModal(movie));
    return div;
  }

  function renderAll() {
    const query = $("#searchInput").value.toLowerCase().trim();
    const genre = $("#genreFilter").value;
    const sort = $("#sortBy").value;

    let list = [...all];
    if (query) list = list.filter((m) => m.title.toLowerCase().includes(query) || m.overview.toLowerCase().includes(query));
    if (genre) list = list.filter((m) => m.genres.includes(genre));
    list.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "year") return b.year - a.year;
      return 0;
    });

    const grid = $("#movieGrid");
    grid.innerHTML = "";
    if (list.length === 0) {
      grid.innerHTML = '<div class="empty">No movies found</div>';
    } else {
      list.forEach((m) => grid.appendChild(renderCard(m)));
    }
    $("#resultsTitle").textContent = query ? `Search: "${query}" (${list.length})` : `All Movies (${list.length})`;
  }

  function renderTrending() {
    const trending = [...all].sort((a, b) => b.rating - a.rating).slice(0, 10);
    const row = $("#trendingRow");
    row.innerHTML = "";
    trending.forEach((m) => row.appendChild(renderCard(m)));
  }

  function renderFavorites() {
    const favs = all.filter((m) => favorites.has(m.id));
    const grid = $("#favGrid");
    grid.innerHTML = "";
    if (favs.length === 0) {
      grid.innerHTML = '<div class="empty">No favorites yet. Click ★ on a movie to add.</div>';
      return;
    }
    favs.forEach((m) => grid.appendChild(renderCard(m)));
  }

  function openModal(movie) {
    const isFav = favorites.has(movie.id);
    $("#modalBody").innerHTML = `
      <h2>${escape(movie.title)}</h2>
      <div class="modal__meta">
        <span>${movie.year}</span> ·
        <span>${movie.runtime} min</span> ·
        <span class="movie-card__rating">★ ${movie.rating}</span> ·
        <span>Dir: ${escape(movie.director)}</span>
      </div>
      <p class="modal__overview">${escape(movie.overview)}</p>
      <div class="modal__genres">
        ${movie.genres.map((g) => `<span class="modal__genre">${escape(g)}</span>`).join("")}
      </div>
      <p style="margin-top:16px"><button class="fav-btn ${isFav ? "is-fav" : ""}" id="favToggle">${isFav ? "★ Remove from favorites" : "☆ Add to favorites"}</button></p>
    `;
    $("#modal").hidden = false;
    $("#favToggle").addEventListener("click", () => {
      if (favorites.has(movie.id)) favorites.delete(movie.id);
      else favorites.add(movie.id);
      localStorage.setItem(FAV_KEY, JSON.stringify([...favorites]));
      renderAll(); renderFavorites(); openModal(movie);
    });
  }

  document.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", () => $("#modal").hidden = true));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("#modal").hidden = true; });

  // Debounced search
  let timer;
  $("#searchInput").addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(renderAll, 200); });
  $("#genreFilter").addEventListener("change", renderAll);
  $("#sortBy").addEventListener("change", renderAll);

  // Theme
  const applyTheme = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    $("#themeToggle").textContent = t === "light" ? "☀️" : "🌙";
  };
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  $("#themeToggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // Init
  populateGenres();
  renderTrending();
  renderAll();
  renderFavorites();
})();
