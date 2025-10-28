const homeBtn = document.getElementById('nav-home');
const postsBtn = document.getElementById('nav-posts');
const contactBtn = document.getElementById('nav-contact');

homeBtn.addEventListener("click", (e) => {
    resetSelection();
    showSectionById("content-home");
    highlightNavButtonById("nav-home");
});

postsBtn.addEventListener("click", (e) => {
    resetSelection();
    showSectionById("content-posts");
    highlightNavButtonById("nav-posts");
});

contactBtn.addEventListener("click", (e) => {
    resetSelection();
    showSectionById("content-contact");
    highlightNavButtonById("nav-contact");
});

// Hides all sections, and removes the selected class from all nav buttons. Clean slate.
function resetSelection() {
    const mainContent = document.getElementById("content-sections")
    for (const section of mainContent.children) {
        section.classList.add("hide-section");
    }
    const nav = document.getElementById("navigation");
    for (const button of nav.children) {
        button.classList.remove("selected");
    }
}

function showSectionById(id) {
    document.getElementById(id).classList.remove("hide-section");
}

function highlightNavButtonById(navButtonId) {
    document.getElementById(navButtonId).classList.add("selected");
}