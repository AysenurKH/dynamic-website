import {Post} from "./components/post.js";
import {Reaction} from "./components/reaction.js";

const userIdUserNameMap = new Map();

let postsFetchedSoFar = 0;
let postsTotalAvailable = Number.MAX_SAFE_INTEGER;
const postsToFetchAtATime = 3;

const postsContainer = document.getElementById("posts-container");
const homeBtn = document.getElementById('nav-home');
const postsBtn = document.getElementById('nav-posts');
const contactBtn = document.getElementById('nav-contact');
const loadMoreBtn = document.getElementById('load-more-btn');

homeBtn.addEventListener("click", (e) => {
    hideAllSections();
    showSectionById("content-home");
    highlightNavButtonById("nav-home");
});

postsBtn.addEventListener("click", (e) => {
    hideAllSections();
    showSectionById("content-posts");
    highlightNavButtonById("nav-posts");
});

contactBtn.addEventListener("click", (e) => {
    hideAllSections();
    showSectionById("content-contact");
    highlightNavButtonById("nav-contact");
});

loadMoreBtn.addEventListener("click", (e) => {
    loadPosts()
        .then();
})

function hideAllSections() {
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


async function loadPosts() {
    // Disabling the button so you can only click it once. It is enabled again at the end of the function.
    loadMoreBtn.disabled = true;

    // We have not pre-fetched the usernames. Let's do that.
    if (userIdUserNameMap.size === 0) {
        await fetchAllUsers();
    }

    try {
        const response = await fetch(`https://dummyjson.com/posts?limit=${postsToFetchAtATime}&skip=${postsFetchedSoFar}`);

        if (!response.ok) {
            alert(`HTTP ${response.status} – ${response.statusText}`);
        }

        const {posts, total} = await response.json();
        postsFetchedSoFar += posts.length;
        postsTotalAvailable = total;

        for (const post of posts) {
            const {id, title, body, reactions, tags, userId} = post;
            const {likes, dislikes} = reactions;
            const reactionsObj = new Reaction(likes, dislikes)
            const postObject = new Post(id, title, body, reactionsObj, tags, userId, userIdUserNameMap.get(userId))
            postsContainer.appendChild(postObject.asHtml())
        }
    } catch (error) {
        alert(`Error fetching posts: ${error}`)
    }

    // We have now fetched all posts. Hide the load-more button
    if (postsFetchedSoFar >= postsTotalAvailable) {
        loadMoreBtn.style.display = "none";
    }

    loadMoreBtn.disabled = false;
}


async function fetchAllUsers() {
    try {
        const response = await fetch(`https://dummyjson.com/users?limit=0&select=username`);
        if (!response.ok) {
            alert(`HTTP ${response.status} – ${response.statusText}`);
        }
        const usersResponse = await response.json();
        const {users} = usersResponse;
        for (const user of users) {
            const {id, username} = user;
            userIdUserNameMap.set(id, username)
        }
    } catch (error) {
        alert(`Error fetching posts: ${error}`)
    }
}