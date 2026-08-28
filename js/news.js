const newsList = document.querySelector("[data-news-list]");
const escapeHtml = (text = "") => text.replace(/[&<>"']/g, (symbol) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[symbol]);
const formatDate = (date) => new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" }).format(new Date(date));

fetch("./data/news.json")
  .then((response) => response.ok ? response.json() : Promise.reject())
  .then((news) => {
    const selected = decodeURIComponent(location.hash.slice(1));
    const entry = news.find((item) => item.slug === selected);
    if (entry) {
      newsList.innerHTML = '<article class="news-detail"><a class="text-link" href="./news.html">← Все новости</a><p class="eyebrow">' + formatDate(entry.date) + '</p><h2>' + escapeHtml(entry.title) + '</h2>' + (entry.cover ? '<img src="' + escapeHtml(entry.cover) + '" alt="" />' : "") + '<p>' + escapeHtml(entry.body).replace(/\n/g, "</p><p>") + "</p></article>";
      return;
    }
    newsList.innerHTML = news.length ? news.map((item) => '<article class="news-card">' + (item.cover ? '<img src="' + escapeHtml(item.cover) + '" alt="" loading="lazy" />' : "") + '<p class="eyebrow">' + formatDate(item.date) + '</p><h2><a href="#' + encodeURIComponent(item.slug) + '">' + escapeHtml(item.title) + '</a></h2><p>' + escapeHtml(item.excerpt) + "</p></article>").join("") : '<p class="empty-state">Пока нет опубликованных новостей. Загляните позже.</p>';
  })
  .catch(() => { newsList.textContent = "Не удалось загрузить новости. Попробуйте обновить страницу."; });
