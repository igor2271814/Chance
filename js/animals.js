const animalsList = document.querySelector("[data-animals-list]");
const filterButtons = document.querySelectorAll("[data-animal-filter]");

let animals = [];

const escapeHtml = (text = "") =>
  text.replace(
    /[&<>"']/g,
    (symbol) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[symbol],
  );

const createAnimalCard = (animal) => `
  <article class="animal-card">
    <a
      class="animal-card__image-link"
      href="#${encodeURIComponent(animal.slug)}"
      aria-label="Подробнее о питомце ${escapeHtml(animal.name)}"
    >
      <img
        class="animal-card__image"
        src="${escapeHtml(animal.cover)}"
        alt="${escapeHtml(animal.name)}"
        loading="lazy"
      />
    </a>

    <div class="animal-card__content">
      <div class="animal-card__meta">
        <span>${animal.type === "cat" ? " Кошка" : "🐕 Собака"}</span>

        <span class="animal-card__status">
          ${escapeHtml(animal.status)}
        </span>
      </div>

      <h2>
        <a href="#${encodeURIComponent(animal.slug)}">
          ${escapeHtml(animal.name)}
        </a>
      </h2>

      <p>
        ${escapeHtml(animal.excerpt)}
      </p>

      <a
        class="text-link"
        href="#${encodeURIComponent(animal.slug)}"
      >
        Узнать больше →
      </a>
    </div>
  </article>
`;

const renderAnimals = (list) => {
  if (!list.length) {
    animalsList.innerHTML = `
      <p class="empty-state">
        Пока здесь никого нет. Загляните позже.
      </p>
    `;

    return;
  }

  animalsList.innerHTML = list
    .map(createAnimalCard)
    .join("");
};

const renderAnimalDetail = (animal) => {
  const galleryHtml = animal.gallery && animal.gallery.length
    ? `
      <div class="animal-detail__gallery">
        <h3>Фотографии</h3>
        <div class="animal-detail__gallery-grid">
          ${animal.gallery
            .map(
              (img) => `
            <img
              src="${escapeHtml(img)}"
              alt="${escapeHtml(animal.name)}"
              loading="lazy"
            />
          `,
            )
            .join("")}
        </div>
      </div>
    `
    : "";

  animalsList.innerHTML = `
    <article class="animal-detail animal-detail--full">
      <div class="container">
        <a class="text-link" href="./animals.html">
          ← Все животные
        </a>
      </div>

      <div class="animal-detail__header">
        <div class="animal-detail__main-image">
          <img
            src="${escapeHtml(animal.cover)}"
            alt="${escapeHtml(animal.name)}"
          />
        </div>

        <div class="animal-detail__info">
          <div class="container">
            <div class="animal-detail__meta">
              <span class="animal-detail__type">
                ${animal.type === "cat" ? "🐈 Кошка" : "🐕 Собака"}
              </span>

              <span class="animal-detail__status">
                ${escapeHtml(animal.status)}
              </span>
            </div>

            <h1>${escapeHtml(animal.name)}</h1>

            <dl class="animal-detail__specs">
              ${animal.sex ? `
                <dt>Пол:</dt>
                <dd>${escapeHtml(animal.sex)}</dd>
              ` : ""}

              ${animal.age ? `
                <dt>Возраст:</dt>
                <dd>${escapeHtml(animal.age)}</dd>
              ` : ""}

              ${animal.size ? `
                <dt>Размер:</dt>
                <dd>${escapeHtml(animal.size)}</dd>
              ` : ""}
            </dl>

            <a
              class="button button--primary"
              href="./index.html#contacts"
            >
              Хочу познакомиться
            </a>
          </div>
        </div>
      </div>

      ${animal.description ? `
        <div class="animal-detail__section">
          <div class="container">
            <h2>О питомце</h2>
            <p>${escapeHtml(animal.description)}</p>
          </div>
        </div>
      ` : ""}

      ${animal.body ? `
        <div class="animal-detail__section">
          <div class="container">
            <h2>История</h2>
            <p>${escapeHtml(animal.body)}</p>
          </div>
        </div>
      ` : ""}

      ${galleryHtml ? `
        <div class="animal-detail__section animal-detail__section--full">
          <div class="container">
            <h2>Фотографии</h2>
          </div>
          <div class="animal-detail__gallery-grid">
            ${animal.gallery
              .map(
                (img) => `
              <img
                src="${escapeHtml(img)}"
                alt="${escapeHtml(animal.name)}"
                loading="lazy"
              />
            `,
              )
              .join("")}
          </div>
        </div>
      ` : ""}

      ${animal.character ? `
        <div class="animal-detail__section">
          <div class="container">
            <h2>Характер</h2>
            <p>${escapeHtml(animal.character)}</p>
          </div>
        </div>
      ` : ""}

      ${animal.health ? `
        <div class="animal-detail__section">
          <div class="container">
            <h2>Здоровье</h2>
            <p>${escapeHtml(animal.health)}</p>
          </div>
        </div>
      ` : ""}
    </article>
  `;

  // Прокрутка к началу страницы
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const filterAnimals = (type) => {
  if (type === "all") {
    renderAnimals(animals);
    return;
  }

  const filteredAnimals = animals.filter(
    (animal) => animal.type === type,
  );

  renderAnimals(filteredAnimals);
};

const setActiveFilter = (activeButton) => {
  filterButtons.forEach((button) => {
    button.classList.remove("animals-filter--active");
  });

  activeButton.classList.add("animals-filter--active");
};

const showAnimalBySlug = (slug) => {
  if (!slug) {
    renderAnimals(animals);
    return;
  }

  const decodedSlug = decodeURIComponent(slug);
  const animal = animals.find((a) => a.slug === decodedSlug);

  if (animal) {
    renderAnimalDetail(animal);
  } else {
    animalsList.innerHTML = `
      <p class="empty-state">
        Питомец не найден. 
        <a href="./animals.html" class="text-link">Вернуться к списку</a>
      </p>
    `;
  }
};

const handleHashChange = () => {
  const hash = window.location.hash.slice(1);
  showAnimalBySlug(hash);
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.animalFilter;

    setActiveFilter(button);
    filterAnimals(type);
  });
});

// Обработка изменения hash в URL
window.addEventListener("hashchange", handleHashChange);

const loadAnimals = async () => {
  try {
    const response = await fetch("./data/animals.json");

    if (!response.ok) {
      throw new Error("Не удалось загрузить животных");
    }

    animals = await response.json();

    // Проверяем hash при загрузке страницы
    handleHashChange();
  } catch (error) {
    console.error(error);

    animalsList.innerHTML = `
      <p class="empty-state">
        Не удалось загрузить информацию о животных.
        Попробуйте обновить страницу.
      </p>
    `;
  }
};

loadAnimals();