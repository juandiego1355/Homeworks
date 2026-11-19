const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const gifGrid = document.querySelector("#gif-grid");
const statusPanel = document.querySelector("#status-panel");
const statusTitle = document.querySelector("#status-title");
const statusMessage = document.querySelector("#status-message");
const resultCount = document.querySelector("#result-count");
const suggestionButtons = document.querySelectorAll(".suggestion");

function showStatus(title, message, state = "") {
  statusPanel.className = `status-panel${state ? ` is-${state}` : ""}`;
  statusTitle.textContent = title;
  statusMessage.textContent = message;
  statusPanel.hidden = false;
  gifGrid.hidden = true;
  resultCount.textContent = "";
}


function createGifCard(gif, index) {
  const card = document.createElement("article");
  card.className = "gif-card";
  card.style.animationDelay = `${index * 55}ms`;

  const artwork = document.createElement("div");
  artwork.className = "gif-art";

  const image = document.createElement("img");
  image.src = gif.url;
  image.alt = gif.title;
  image.loading = "lazy";

  artwork.append(image);

  const caption = document.createElement("div");
  caption.className = "gif-caption";

  const title = document.createElement("span");
  title.textContent = gif.title;

  const link = document.createElement("a");
  link.href = gif.originalUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "↗";
  link.setAttribute("aria-label", "Abrir GIF original");

  caption.append(title, link);
  card.append(artwork, caption);

  return card;
}


async function searchGifs(query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    searchInput.setCustomValidity("Escribe una palabra para buscar.");
    searchInput.reportValidity();
    searchInput.focus();
    return;
  }

  gifGrid.replaceChildren();
  showStatus("Buscando...", `Estamos preparando GIFs para “${normalizedQuery}”.`, "loading");

  try {
    const response = await fetch(`/api/gifs/search?q=${encodeURIComponent(normalizedQuery)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo completar la búsqueda.");
    }

    if (!Array.isArray(data.gifs) || data.gifs.length === 0) {
      showStatus("No encontramos resultados", "Prueba con otras palabras para encontrar más GIFs.");
      return;
    }

    const cards = data.gifs.map(createGifCard);
    gifGrid.replaceChildren(...cards);
    statusPanel.hidden = true;
    gifGrid.hidden = false;
    resultCount.textContent = `${data.gifs.length} resultados`;
  } catch (error) {
    const message = error instanceof TypeError
      ? "No pudimos conectar con el servidor. Inténtalo de nuevo."
      : error.message || "No pudimos conectar con el servidor. Inténtalo de nuevo.";
    showStatus("Algo salió mal", message, "error");
  }
}

searchInput.addEventListener("input", () => {
  searchInput.setCustomValidity("");
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchGifs(searchInput.value);
});

suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const query = button.dataset.query;
    searchInput.value = query;
    searchGifs(query);
  });
});
