const newsList = document.querySelector("[data-news-list]");

let newsData = [];

/* ==============================
   HELPERS
   ============================== */

const escapeHtml = (text = "") =>
  String(text).replace(
    /[&<>"']/g,
    (symbol) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[symbol]
  );

const formatDate = (dateString) => {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "long",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

/* ==============================
   NEWS CARD (Список)
   ============================== */

const createNewsCard = (item) => `
  <article class="news-card">
    ${
      item.cover
        ? `<img src="${escapeHtml(item.cover)}" alt="" loading="lazy" />`
        : ""
    }
    
    <p class="eyebrow">${formatDate(item.date)}</p>
    
    <h2>
      <a href="#${encodeURIComponent(item.slug)}">
        ${escapeHtml(item.title)}
      </a>
    </h2>
    
    <p>${escapeHtml(item.excerpt)}</p>
  </article>
`;

const renderNewsList = (list) => {
  if (!list.length) {
    newsList.innerHTML = `
      <p class="empty-state">
        Пока нет опубликованных новостей. Загляните позже.
      </p>
    `;
    return;
  }

  newsList.innerHTML = list.map(createNewsCard).join("");
};

/* ==============================
   NEWS DETAIL (Детальная страница)
   ============================== */

const renderNewsDetail = (entry) => {
  // Разбиваем текст на абзацы по переносу строки, игнорируем пустые
  const paragraphs = entry.body
    ? entry.body
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join("")
    : "";

  newsList.innerHTML = `
    <article class="news-detail">
      <a class="text-link" href="./news.html" style="display: inline-block; margin-bottom: 24px;">
        ← Все новости
      </a>

      ${entry.cover ? `<img src="${escapeHtml(entry.cover)}" alt="" />` : ""}

      <p class="eyebrow">${formatDate(entry.date)}</p>
      
      <h1>${escapeHtml(entry.title)}</h1>
      
      <div class="news-detail__content">
        ${paragraphs}
      </div>
    </article>
  `;

  window.scrollTo({ top: 0, behavior: "smooth" });
};

/* ==============================
   HASH / ROUTING
   ============================== */

const showNewsBySlug = (slug) => {
  if (!slug) {
    renderNewsList(newsData);
    return;
  }

  const decodedSlug = decodeURIComponent(slug);
  const entry = newsData.find((item) => item.slug === decodedSlug);

  if (entry) {
    renderNewsDetail(entry);
  } else {
    newsList.innerHTML = `
      <p class="empty-state">
        Новость не найдена.
        <a href="./news.html" class="text-link">Вернуться к списку</a>
      </p>
    `;
  }
};

const handleHashChange = () => {
  const hash = window.location.hash.slice(1);
  showNewsBySlug(hash);
};

window.addEventListener("hashchange", handleHashChange);

/* ==============================
   LOAD NEWS
   ============================== */

const loadNews = async () => {
  try {
    const response = await fetch("./data/news.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    newsData = await response.json();
    
    // Проверяем хэш при загрузке
    handleHashChange();
    
  } catch (error) {
    console.error("Не удалось загрузить новости:", error);
    newsList.innerHTML = `
      <p class="empty-state">
        Не удалось загрузить новости. Попробуйте обновить страницу.
      </p>
    `;
  }
};

loadNews();