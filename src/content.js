(() => {
  "use strict";

  const LINK_CLASS = "native-chat-sidebar-link";

  function getConversationMeta(element) {
    const fiberKey = Object.keys(element).find((key) =>
      key.startsWith("__reactFiber$")
    );

    if (!fiberKey) return null;

    let fiber = element[fiberKey];
    let route = null;
    let title = null;

    for (let depth = 0; fiber && depth < 60; depth += 1, fiber = fiber.return) {
      const propSets = [fiber.memoizedProps, fiber.pendingProps];

      for (const props of propSets) {
        if (!props) continue;

        if (!route && typeof props.route === "string" && props.route.startsWith("/c/")) {
          route = props.route;
        }

        if (!route && typeof props.conversationId === "string") {
          route = `/c/${props.conversationId}`;
        }

        if (props.conversation && typeof props.conversation === "object") {
          if (!route && typeof props.conversation.id === "string") {
            route = `/c/${props.conversation.id}`;
          }

          if (!title && typeof props.conversation.title === "string") {
            title = props.conversation.title.trim();
          }
        }

        if (!title && typeof props.title === "string" && props.title.trim()) {
          title = props.title.trim();
        }
      }

      if (route && title) break;
    }

    return route ? { route, title } : null;
  }

  function isSafeTitleSpan(span, meta) {
    if (!(span instanceof HTMLSpanElement)) return false;
    if (span.closest(`a.${LINK_CLASS}`)) return false;
    if (span.closest("button,[aria-haspopup='menu']")) return false;

    const text = span.textContent.trim();
    if (!text || text.length > 300) return false;

    if (meta.title) {
      return text === meta.title;
    }

    return span.children.length === 0;
  }

  function decorateSpan(span) {
    const meta = getConversationMeta(span);
    if (!meta || !isSafeTitleSpan(span, meta)) return;

    const link = document.createElement("a");
    link.className = LINK_CLASS;
    link.href = meta.route;
    link.style.color = "inherit";
    link.style.textDecoration = "none";
    link.style.cursor = "pointer";

    span.parentNode.insertBefore(link, span);
    link.appendChild(span);
  }

  function decorateAll() {
    const root =
      document.querySelector("#app-shell-sidebar") ||
      document.querySelector("aside") ||
      document;

    root.querySelectorAll("span").forEach(decorateSpan);
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
