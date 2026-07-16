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

function eventCard(event) {
  const date = formatDate(event.date);

  const recurring = event.recurring
    ? `<p class="small"><b>Repeats:</b> ${event.recurring}</p>`
    : "";

  return `
    <div class="moment">
      <strong>
        ${date}<br>
        ${event.time || ""}
      </strong>

      <span>
        <b>${event.title || ""}</b><br>
        ${event.description || ""}

        ${
          event.location
            ? `<br><span class="small">${event.location}</span>`
            : ""
        }

        ${recurring}
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