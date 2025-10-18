

function homeClicked() {
    hideAllSections();
    showSectionById("content-home");
}

function postsClicked() {
    hideAllSections();
    showSectionById("content-posts");
}

function contactClicked() {
    hideAllSections();
    showSectionById("content-contact");
}

function hideAllSections() {
    let mainContent = document.getElementById("content-sections")
    for (const section of mainContent.children) {
        section.classList.add("hide-section");
    }
}

function showSectionById(id) {
    document.getElementById(id).classList.remove("hide-section");
}