// =========================================
// GAMEVAULT - FRONTEND JAVASCRIPT
// =========================================

// Get the buttons from the page
const enterButtons = document.querySelectorAll(
    ".primary-button, .nav-button"
);

// Add click behavior
enterButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        const target = button.getAttribute("href");

        // Only handle buttons that don't already have a page target
        if (!target) {
            event.preventDefault();

            const dashboardSection =
                document.querySelector("#dashboard");

            if (dashboardSection) {
                dashboardSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    });
});

console.log("🎮 GameVault frontend loaded successfully!");