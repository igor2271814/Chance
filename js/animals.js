const animalsList = document.querySelector("[data-animals-list]");
const filterButtons = document.querySelectorAll("[data-animal-filter]");

let animals = [];

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
      })[symbol],
  );

const getAnimalType = (type) => {
  return type === "cat" ? "🐈 Кошка" : "🐕 Собака";
};

/* ==============================
   ANIMAL CARD
   ============================== */

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
        <span>
          ${getAnimalType(animal.type)}
        </span>

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

/* ==============================
   ANIMAL LIST
   ============================== */

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

/* ==============================
   ANIMAL DETAIL
   ============================== */

const createAnimalSpecs = (animal) => {
  const specs = [];

  if (animal.sex) {
    specs.push(`
      <div class="animal-detail__spec">
        <dt>Пол</dt>
        <dd>${escapeHtml(animal.sex)}</dd>
      </div>
    `);
  }

  if (animal.age) {
    specs.push(`
      <div class="animal-detail__spec">
        <dt>Возраст</dt>
        <dd>${escapeHtml(animal.age)}</dd>
      </div>
    `);
  }

  if (animal.size) {
    specs.push(`
      <div class="animal-detail__spec">
        <dt>Размер</dt>
        <dd>${escapeHtml(animal.size)}</dd>
      </div>
    `);
  }

  if (!specs.length) {
    return "";
  }

  return `
    <dl class="animal-detail__specs">
      ${specs.join("")}
    </dl>
  `;
};

const createGallery = (animal) => {
  if (!Array.isArray(animal.gallery) || !animal.gallery.length) {
    return "";
  }

  return `
    <section class="animal-detail__section">
      <div class="container">
        <h2>Фотографии</h2>
      </div>

      <div class="animal-detail__gallery-grid">
        ${animal.gallery
          .map(
            (img) => `
              <img
                src="${escapeHtml(img)}"
                alt="Фотография ${escapeHtml(animal.name)}"
                loading="lazy"
              />
            `,
          )
          .join("")}
      </div>
    </section>
  `;
};

const createAnimalSection = (title, content) => {
  if (!content) {
    return "";
  }

  return `
    <section class="animal-detail__section">
      <div class="container">
        <h2>${title}</h2>
        <p>${escapeHtml(content)}</p>
      </div>
    </section>
  `;
};

const renderAnimalDetail = (animal) => {
  const galleryHtml =
    animal.gallery && animal.gallery.length
      ? `
        <section class="animal-detail__section">
          <h2>Фотографии</h2>

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
        </section>
      `
      : "";

  animalsList.innerHTML = `
    <article class="animal-detail">

      <a
        class="animal-detail__back text-link"
        href="./animals.html"
      >
        ← Все животные
      </a>

      <div class="animal-detail__header">

        <div class="animal-detail__main-image">
          <img
            src="${escapeHtml(animal.cover)}"
            alt="${escapeHtml(animal.name)}"
          />
        </div>

        <div class="animal-detail__info">

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

            ${
              animal.sex
                ? `
                  <div>
                    <dt>Пол:</dt>
                    <dd>${escapeHtml(animal.sex)}</dd>
                  </div>
                `
                : ""
            }

            ${
              animal.age
                ? `
                  <div>
                    <dt>Возраст:</dt>
                    <dd>${escapeHtml(animal.age)}</dd>
                  </div>
                `
                : ""
            }

            ${
              animal.size
                ? `
                  <div>
                    <dt>Размер:</dt>
                    <dd>${escapeHtml(animal.size)}</dd>
                  </div>
                `
                : ""
            }

          </dl>

          <a
            class="button button--primary"
            href="./index.html#contacts"
          >
            Хочу познакомиться
          </a>

        </div>
      </div>

      ${
        animal.description
          ? `
            <section class="animal-detail__section">
              <h2>О питомце</h2>
              <p>${escapeHtml(animal.description)}</p>
            </section>
          `
          : ""
      }

      ${
        animal.body
          ? `
            <section class="animal-detail__section">
              <h2>История</h2>
              <p>${escapeHtml(animal.body)}</p>
            </section>
          `
          : ""
      }

      ${galleryHtml}

      ${
        animal.character
          ? `
            <section class="animal-detail__section">
              <h2>Характер</h2>
              <p>${escapeHtml(animal.character)}</p>
            </section>
          `
          : ""
      }

      ${
        animal.health
          ? `
            <section class="animal-detail__section">
              <h2>Здоровье</h2>
              <p>${escapeHtml(animal.health)}</p>
            </section>
          `
          : ""
      }

    </article>
  `;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

/* ==============================
   FILTERS
   ============================== */

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

/* ==============================
   HASH / ROUTING
   ============================== */

const showAnimalBySlug = (slug) => {
  if (!slug) {
    renderAnimals(animals);
    return;
  }

  const decodedSlug = decodeURIComponent(slug);

  const animal = animals.find(
    (item) => item.slug === decodedSlug,
  );

  if (animal) {
    renderAnimalDetail(animal);
    return;
  }

  animalsList.innerHTML = `
    <p class="empty-state">
      Питомец не найден.
      <a
        href="./animals.html"
        class="text-link"
      >
        Вернуться к списку
      </a>
    </p>
  `;
};

const handleHashChange = () => {
  const hash = window.location.hash.slice(1);

  showAnimalBySlug(hash);
};

/* ==============================
   FILTER EVENTS
   ============================== */

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.animalFilter;

    setActiveFilter(button);
    filterAnimals(type);

    /*
     * Если пользователь был на странице
     * конкретного животного и нажал фильтр,
     * убираем hash.
     */
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  });
});

window.addEventListener(
  "hashchange",
  handleHashChange,
);

/* ==============================
   LOAD ANIMALS
   ============================== */

const loadAnimals = async () => {
  try {
    const response = await fetch("./data/animals.json");

    if (!response.ok) {
      throw new Error(
        `HTTP error: ${response.status}`,
      );
    }

    animals = await response.json();

    handleHashChange();
  } catch (error) {
    console.error(
      "Не удалось загрузить животных:",
      error,
    );

    animalsList.innerHTML = `
      <p class="empty-state">
        Не удалось загрузить информацию о животных.
        Попробуйте обновить страницу.
      </p>
    `;
  }
};

loadAnimals();