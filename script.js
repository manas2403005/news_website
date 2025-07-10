const API_KEY = "7448422bf2014d3f86328339de2c648e";


// Map categories to NewsAPI country codes (lowercase)
const countryMap = {
  US: "us",
  India: "in",
  World: "",   // No direct country code, fallback to everything search
  Other: ""    // Fallback too
};

// Valid NewsAPI categories
const categorySet = new Set([
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology"
]);

const cardsContainer = document.getElementById("cards-container");
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");
const heroSection = document.getElementById("hero-section");
const latestList = document.getElementById("latest-list");

// Load default news on page load (India)
window.addEventListener("load", () => {
  fetchNews("India");
});

// Main fetch function with endpoint and params adjusted for categories and countries
async function fetchNews(query) {
  let apiUrl = "";

  // Check if query is a mapped country
  if (countryMap.hasOwnProperty(query)) {
    const countryCode = countryMap[query];
    if (countryCode) {
      // Use top-headlines with country code
      apiUrl = `https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${API_KEY}`;
    } else {
      // For "World" or "Other" fallback to everything endpoint
      apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;
    }
  }
  // Check if query is a known category
  else if (categorySet.has(query.toLowerCase())) {
    apiUrl = `https://newsapi.org/v2/top-headlines?category=${query.toLowerCase()}&apiKey=${API_KEY}`;
  } 
  // Otherwise search everything endpoint with query
  else {
    apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;
  }

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      displayNoNews();
    } else {
      renderHero(data.articles);
      renderCards(data.articles);
      renderSidebar(data.articles);
    }
  } catch (err) {
    cardsContainer.innerHTML = `<p style="color:red; font-size:1.1rem;">Error fetching news. Please try again.</p>`;
    heroSection.innerHTML = "";
    latestList.innerHTML = "";
  }
}

// Show message if no news found
function displayNoNews() {
  cardsContainer.innerHTML = `<p style="font-size:1.1rem;">No articles found. Try another search.</p>`;
  heroSection.innerHTML = "";
  latestList.innerHTML = "";
}

// Render main hero section with top article
function renderHero(articles) {
  heroSection.innerHTML = "";
  const top = articles.find(a => a.urlToImage && a.title);
  if (!top) return;

  const heroCard = document.createElement("div");
  heroCard.className = "hero-card";
  heroCard.innerHTML = `
    <img src="${top.urlToImage}" alt="headline" />
    <h2>${top.title}</h2>
  `;
  heroCard.addEventListener("click", () => window.open(top.url, "_blank"));
  heroSection.appendChild(heroCard);
}

// Render cards for news articles
function renderCards(articles) {
  cardsContainer.innerHTML = "";
  const filtered = articles.filter(a => a.urlToImage && a.title).slice(0, 12);

  filtered.forEach(article => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${article.urlToImage}" alt="news image"/>
      <h3>${article.title}</h3>
      <p>${article.description || "No description available."}</p>
      <div class="source">${article.source.name} &middot; ${formatDate(article.publishedAt)}</div>
    `;
    card.addEventListener("click", () => window.open(article.url, "_blank"));
    cardsContainer.appendChild(card);
  });
}

// Render sidebar with latest headlines
function renderSidebar(articles) {
  latestList.innerHTML = "";
  const topFive = articles.filter(a => a.title).slice(0, 6);

  topFive.forEach(article => {
    const li = document.createElement("li");
    li.textContent = article.title;
    li.addEventListener("click", () => window.open(article.url, "_blank"));
    latestList.appendChild(li);
  });
}

// Search button click handler
searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (!query) return;
  fetchNews(query);
});

// Enter key triggers search
searchText.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});

// Format published date nicely
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

// Category navigation click handling (bottom nav)
document.querySelectorAll(".nyt-nav-item").forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const category = item.getAttribute("data-category");
    if (!category) return;

    fetchNews(category);

    // Remove active class from all nav items
    document.querySelectorAll(".nyt-nav-item").forEach(nav => nav.classList.remove("active"));
    item.classList.add("active");
  });
});

// Top edition category click handling (U.S., India, World, Other)
document.querySelectorAll(".nyt-edition").forEach(item => {
  item.addEventListener("click", () => {
    const category = item.getAttribute("data-category");
    if (!category) return;

    fetchNews(category);

    // Also update active state for top editions if needed
    document.querySelectorAll(".nyt-edition").forEach(el => el.classList.remove("active"));
    item.classList.add("active");
  });
});
