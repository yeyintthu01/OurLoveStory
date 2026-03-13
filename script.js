// Notion API endpoint
const NOTION_API_URL = "https://api.notion.com/v1";

// Get the API token from environment or use a proxy
// For GitHub Pages, we'll use a CORS proxy approach
const NOTION_TOKEN =
  process.env.NOTION_TOKEN || localStorage.getItem("notionToken");

// Fetch timeline data from Notion
async function fetchTimeline() {
  try {
    const response = await fetch(
      `${NOTION_API_URL}/databases/${NOTION_CONFIG.timelineDbId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sorts: [
            {
              property: "Year",
              direction: "ascending",
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        showNotionSetupGuide();
        return;
      }
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    renderTimeline(data.results);
  } catch (error) {
    console.error("Error fetching timeline:", error);
    document.getElementById("timeline-container").innerHTML =
      '<p class="error">Unable to load timeline. Please configure your Notion token.</p>';
  }
}

// Fetch gallery data from Notion
async function fetchGallery() {
  try {
    const response = await fetch(
      `${NOTION_API_URL}/databases/${NOTION_CONFIG.galleryDbId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    renderGallery(data.results);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    document.getElementById("gallery-container").innerHTML =
      '<p class="error">Unable to load gallery. Please configure your Notion token.</p>';
  }
}

// Show setup guide if token is missing
function showNotionSetupGuide() {
  const token = prompt(
    "Enter your Notion Integration Token:\n\nYou can get this from https://www.notion.com/my-integrations",
  );
  if (token) {
    localStorage.setItem("notionToken", token);
    location.reload();
  }
}

// Render timeline items
function renderTimeline(items) {
  const container = document.getElementById("timeline-container");

  if (items.length === 0) {
    container.innerHTML =
      '<p class="empty">No timeline items yet. Add some in Notion!</p>';
    return;
  }

  let html = "";
  items.forEach((item) => {
    const props = item.properties;
    const year = props.Year?.title?.[0]?.plain_text || "N/A";
    const title = props.Title?.title?.[0]?.plain_text || "Untitled";
    const description = props.Description?.rich_text?.[0]?.plain_text || "";

    html += `
            <div class="timeline-item">
                <div class="timeline-date">${year}</div>
                <div class="timeline-content">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;
  });

  container.innerHTML = html;
  animateTimelineItems();
}

// Render gallery items
function renderGallery(items) {
  const container = document.getElementById("gallery-container");

  if (items.length === 0) {
    container.innerHTML =
      '<p class="empty">No gallery items yet. Add some in Notion!</p>';
    return;
  }

  let html = "";
  items.forEach((item) => {
    const props = item.properties;
    const title = props.Title?.title?.[0]?.plain_text || "Memory";
    const imageUrl =
      props.Image?.url || "https://via.placeholder.com/300x300?text=No+Image";
    const description = props.Description?.rich_text?.[0]?.plain_text || "";

    html += `
            <div class="gallery-item">
                <img src="${imageUrl}" alt="${title}">
                <p>${description || title}</p>
            </div>
        `;
  });

  container.innerHTML = html;
  animateGalleryItems();
}

// Animate timeline items on scroll
function animateTimelineItems() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll(".timeline-item").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// Animate gallery items on scroll
function animateGalleryItems() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll(".gallery-item").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Contact form handling
document
  .querySelector(".contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector("textarea").value;

    if (name && email && message) {
      alert(
        `Thank you ${name}! Your message has been received. We'll get back to you soon!`,
      );
      this.reset();
    } else {
      alert("Please fill in all fields");
    }
  });

// Load data when page loads
document.addEventListener("DOMContentLoaded", function () {
  if (!NOTION_TOKEN) {
    showNotionSetupGuide();
  } else {
    fetchTimeline();
    fetchGallery();
  }
});
