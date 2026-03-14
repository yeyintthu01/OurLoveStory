// Fetch timeline data from Notion public page
async function fetchTimeline() {
  try {
    // Using Notion's public API for published databases
    const response = await fetch(
      `https://notion-api.splitbee.io/v1/table/${NOTION_CONFIG.timelineDbId}`,
    );

    if (!response.ok) {
      console.error("Timeline fetch failed:", response.status);
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    console.log("Timeline data:", data);
    renderTimeline(data);
  } catch (error) {
    console.error("Error fetching timeline:", error);
    document.getElementById("timeline-container").innerHTML =
      '<p class="error">Unable to load timeline. Error: ' +
      error.message +
      "</p>";
  }
}

// Fetch gallery data from Notion public page
async function fetchGallery() {
  try {
    const response = await fetch(
      `https://notion-api.splitbee.io/v1/table/${NOTION_CONFIG.galleryDbId}`,
    );

    if (!response.ok) {
      console.error("Gallery fetch failed:", response.status);
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gallery data:", data);
    renderGallery(data);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    document.getElementById("gallery-container").innerHTML =
      '<p class="error">Unable to load gallery. Error: ' +
      error.message +
      "</p>";
  }
}

// Render timeline items
function renderTimeline(items) {
  const container = document.getElementById("timeline-container");

  console.log("Rendering timeline with items:", items);

  if (!items || items.length === 0) {
    container.innerHTML =
      '<p class="empty">No timeline items yet. Add some in Notion!</p>';
    return;
  }

  let html = "";
  items.forEach((item) => {
    const year = item.Year || "N/A";
    const title = item.Title || "Untitled";
    const description = item.Description || "";

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

  console.log("Rendering gallery with items:", items);

  if (!items || items.length === 0) {
    container.innerHTML =
      '<p class="empty">No gallery items yet. Add some in Notion!</p>';
    return;
  }

  let html = "";
  items.forEach((item) => {
    const title = item.Title || "Memory";
    const imageUrl =
      item.Image || "https://via.placeholder.com/300x300?text=No+Image";
    const description = item.Description || "";

    html += `
            <div class="gallery-item">
                <img src="${imageUrl}" alt="${title}" onerror="this.src='https://via.placeholder.com/300x300?text=Image+Error'">
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
  console.log("Page loaded, fetching data...");
  console.log("Timeline DB ID:", NOTION_CONFIG.timelineDbId);
  console.log("Gallery DB ID:", NOTION_CONFIG.galleryDbId);
  fetchTimeline();
  fetchGallery();
});
