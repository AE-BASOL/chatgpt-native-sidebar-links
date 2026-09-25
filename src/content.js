(() => {
  "use strict";

  const LINK_CLASS = "native-chat-sidebar-link";

  function getConversationRoute(row) {
    const fiberKey = Object.keys(row).find((key) =>
      key.startsWith("__reactFiber$")
    );

    if (!fiberKey) return null;

    let fiber = row[fiberKey];

    for (let depth = 0; fiber && depth < 40; depth += 1, fiber = fiber.return) {
      const propSets = [fiber.memoizedProps, fiber.pendingProps];

      for (const props of propSets) {
        if (!props) continue;

        if (typeof props.route === "string" && props.route.startsWith("/c/")) {
          return props.route;
        }

        if (typeof props.conversationId === "string") {
          return `/c/${props.conversationId}`;
        }

        if (
          props.conversation &&
          typeof props.conversation.id === "string"
        ) {
          return `/c/${props.conversation.id}`;
        }
      }
    }

    return null;
  }

  function findTitleSpan(row) {
    const title = row.getAttribute("aria-label");

    if (!title) return null;

    return (
      [...row.querySelectorAll("span")].find(
        (span) => span.textContent.trim() === title.trim()
      ) || null
    );
  }

  function decorateRow(row) {
    if (!(row instanceof HTMLElement)) return;
    if (!row.classList.contains("sidebar-item")) return;
    if (row.dataset.nativeSidebarLinkReady === "true") return;

    const route = getConversationRoute(row);
    if (!route) return;

    const titleSpan = findTitleSpan(row);
    if (!titleSpan) return;

    const existingLink = titleSpan.closest(`a.${LINK_CLASS}`);

    if (existingLink) {
      existingLink.href = route;
      row.dataset.nativeSidebarLinkReady = "true";
      return;
    }

    const link = document.createElement("a");
    link.className = LINK_CLASS;
    link.href = route;
    link.style.color = "inherit";
    link.style.textDecoration = "none";
    link.style.cursor = "pointer";

    titleSpan.parentNode.insertBefore(link, titleSpan);
    link.appendChild(titleSpan);

    row.dataset.nativeSidebarLinkReady = "true";
  }

  function decorateAll() {
    document
      .querySelectorAll('div.sidebar-item[role="button"][aria-label]')
      .forEach(decorateRow);
  }

  let scheduled = false;

  const observer = new MutationObserver(() => {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      decorateAll();
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  decorateAll();

  window.addEventListener(
    "contextmenu",
    (event) => {
      const link = event.target.closest?.(`a.${LINK_CLASS}`);
      if (!link) return;

      event.stopImmediatePropagation();
    },
    true
  );
})();
