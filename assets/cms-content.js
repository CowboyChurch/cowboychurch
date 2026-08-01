async function loadJSON(path) {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load " + path);
  }

  return response.json();
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value + "T12:00:00");

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeWebUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";

  try {
    const url = new URL(value.trim(), window.location.href);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
      ? url.href
      : "";
  } catch (error) {
    return "";
  }
}

function linkifyText(value) {
  const escaped = escapeHTML(value);
  const urlPattern = /((?:https?:\/\/|www\.)[^\s<]+)/gi;

  return escaped.replace(urlPattern, (match) => {
    const trailing = match.match(/[.,!?;:)]+$/)?.[0] || "";
    const cleanMatch = trailing ? match.slice(0, -trailing.length) : match;
    const href = cleanMatch.toLowerCase().startsWith("www.")
      ? `https://${cleanMatch}`
      : cleanMatch;
    const safeHref = safeWebUrl(href);

    if (!safeHref) return match;

    return `<a href="${escapeHTML(safeHref)}" target="_blank" rel="noopener noreferrer">${cleanMatch}</a>${trailing}`;
  });
}

function eventCard(event) {
  const date = escapeHTML(formatDate(event.date));
  const imageUrl = safeWebUrl(event.image);
  const buttonUrl = safeWebUrl(event.button_url);
  const buttonText = typeof event.button_text === "string"
    ? event.button_text.trim()
    : "";

  const image = imageUrl
    ? `<img class="moment-image" src="${escapeHTML(imageUrl)}" alt="${escapeHTML(event.title || "Cowboy Church event")}">`
    : "";

  const repeatingSchedule = [event.recurring, event.recurring_details]
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => escapeHTML(value.trim()))
    .join(" — ");

  const recurring = repeatingSchedule
    ? `<p class="small">${repeatingSchedule}</p>`
    : "";

  const button = buttonUrl && buttonText
    ? `<p><a class="btn outline event-button" href="${escapeHTML(buttonUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(buttonText)}</a></p>`
    : "";

  return `
    <div class="moment${image ? " has-image" : ""}">
      ${image}

      <strong>
        ${date}<br>
        ${escapeHTML(event.time || "")}
      </strong>

      <span>
        <b>${escapeHTML(event.title || "")}</b><br>
        ${linkifyText(event.description || "")}

        ${
          event.location
            ? `<br><span class="small">${linkifyText(event.location)}</span>`
            : ""
        }

        ${recurring}
        ${button}
      </span>
    </div>
  `;
}

function storyCard(story) {
  const image = story.image
    ? `<img src="${story.image}" alt="${story.title || "Cowboy Church story"}">`
    : "";

  return `
    <article class="card">
      ${image}

      <div>
        <h3>${story.title || ""}</h3>
        <p>${story.summary || story.body || ""}</p>
      </div>
    </article>
  `;
}

async function renderEvents(targetId, featuredOnly = false) {
  const target = document.getElementById(targetId);

  if (!target) return;

  try {
    const data = await loadJSON("content/events.json");

    let events = (data.events || [])
      .slice()
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));

    if (featuredOnly) {
      events = events.filter((event) => event.featured);
    }

    target.innerHTML = events.length
      ? events.map(eventCard).join("")
      : `
        <p class="lead">
          No upcoming events are scheduled at this time.
          Please check back soon for new opportunities to worship,
          serve, and connect.
        </p>
      `;
  } catch (error) {
    console.error("Unable to load events:", error);

    target.innerHTML = `
      <p class="lead">
        No upcoming events are scheduled at this time.
        Please check back soon.
      </p>
    `;
  }
}

async function renderStories(targetId) {
  const target = document.getElementById(targetId);

  if (!target) return;

  try {
    const data = await loadJSON("content/stories.json");

    const stories = (data.stories || [])
      .slice()
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    target.innerHTML = stories.length
      ? stories.map(storyCard).join("")
      : `
        <p class="lead">
          New stories, testimonies, and photos will appear here as they
          are shared. Check back often to see what God is doing through
          Cowboy Church.
        </p>
      `;
  } catch (error) {
    console.error("Unable to load stories:", error);

    target.innerHTML = `
      <p class="lead">
        No stories have been published yet.
        Please check back soon.
      </p>
    `;
  }
}

async function renderChurchUpdate() {
  const section = document.getElementById("church-updates");

  if (!section) return;

  try {
    const data = await loadJSON(
      "content/church-updates/current.json"
    );

    const isPublished =
      data.published === true ||
      data.published === "true";

    const updateUrl =
      typeof data.url === "string"
        ? data.url.trim()
        : "";

    if (!isPublished || !updateUrl) {
      section.hidden = true;
      return;
    }

    const heading = document.getElementById(
      "church-update-heading"
    );

    const description = document.getElementById(
      "church-update-description"
    );

    const button = document.getElementById(
      "church-update-link"
    );

    if (heading) {
      heading.textContent =
        data.title || "Church Updates";
    }

    if (description) {
      description.textContent =
        data.description ||
        "Read the latest news, upcoming events, prayer requests, and ministry updates from Cowboy Church.";
    }

    if (button) {
      button.textContent =
        data.button_text ||
        "Read This Week's Update";

      button.href = updateUrl;
      button.target = "_blank";
      button.rel = "noopener noreferrer";
    }

    section.hidden = false;
  } catch (error) {
    console.error("Unable to load church update:", error);
    section.hidden = true;
  }
}

/* -------------------------------------------------- */
/* Mobile Navigation */
/* -------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("main-navigation");

  if (!menuButton || !navigation) return;

  const closeMenu = () => {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");

    navigation.querySelectorAll(".dropdown.is-open").forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      const button = dropdown.querySelector(".dropbtn");
      if (button) button.setAttribute("aria-expanded", "false");
    });
  };

  menuButton.addEventListener("click", () => {
    const willOpen = !navigation.classList.contains("is-open");
    navigation.classList.toggle("is-open", willOpen);
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute(
      "aria-label",
      willOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  navigation.querySelectorAll(".dropbtn").forEach((button) => {
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      if (window.innerWidth > 900) return;

      const dropdown = button.closest(".dropdown");
      const willOpen = !dropdown.classList.contains("is-open");

      navigation.querySelectorAll(".dropdown.is-open").forEach((openDropdown) => {
        if (openDropdown !== dropdown) {
          openDropdown.classList.remove("is-open");
          const openButton = openDropdown.querySelector(".dropbtn");
          if (openButton) openButton.setAttribute("aria-expanded", "false");
        }
      });

      dropdown.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 900) return;
    if (!navigation.classList.contains("is-open")) return;
    if (navigation.contains(event.target) || menuButton.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
});
