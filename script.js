const repositoryList = document.querySelector("#repository-list");

function renderRepositories(repositories) {
  if (!Array.isArray(repositories)) {
    throw new TypeError("Repository data must be a list.");
  }

  const items = repositories.map((repository) => {
    if (
      typeof repository.full_name !== "string" ||
      typeof repository.html_url !== "string" ||
      typeof repository.description !== "string"
    ) {
      throw new TypeError("A repository is missing required fields.");
    }

    const item = document.createElement("li");
    item.className = "repository";

    const link = document.createElement("a");
    link.href = repository.html_url;
    link.textContent = repository.full_name;

    const description = document.createElement("p");
    description.textContent = repository.description;

    item.append(link, description);
    return item;
  });

  repositoryList.replaceChildren(...items);

  if (items.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "status";
    emptyMessage.textContent = "No starred repositories found.";
    repositoryList.append(emptyMessage);
  }
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load repository data (${response.status}).`);
    }

    renderRepositories(await response.json());
  } catch (error) {
    console.error("Failed to load starred repositories:", error);
    const message = document.createElement("li");
    message.className = "status";
    message.textContent = "Could not load starred repositories.";
    repositoryList.replaceChildren(message);
  }
}

loadRepositories();
