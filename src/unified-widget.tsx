import React from "react";
import ReactDOM from "react-dom/client";
import DogNameGeneratorUnified from "./components/DogNameGeneratorUnified";

// Store roots to prevent re-initialization
const widgetRoots = new WeakMap();

// Function to initialize all unified widgets on the page
function initializeUnifiedWidgets() {
  console.log("Initializing Dog Name Unified Widgets...");

  const containers = document.querySelectorAll(".dog-name-unified-widget");

  containers.forEach((container) => {
    try {
      // Skip if already initialized
      if (widgetRoots.has(container)) {
        console.log("Widget already initialized, skipping...");
        return;
      }

      const ctaUrl = container.getAttribute("data-cta-url") || "/dog-names";
      const apiUrl = container.getAttribute("data-api-url") || "";
      const apiKey = container.getAttribute("data-api-key") || "";

      const root = ReactDOM.createRoot(container as HTMLElement);
      root.render(React.createElement(DogNameGeneratorUnified, { ctaUrl, apiUrl, apiKey }));

      // Store the root to prevent re-initialization
      widgetRoots.set(container, root);

      console.log("Unified widget initialized successfully");
    } catch (error) {
      console.error("Failed to initialize unified widget:", error);
    }
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeUnifiedWidgets);
} else {
  initializeUnifiedWidgets();
}

// Expose function globally for manual initialization
(window as any).renderDogNameUnifiedWidget = initializeUnifiedWidgets;

export { initializeUnifiedWidgets };
