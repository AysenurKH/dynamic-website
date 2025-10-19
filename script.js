import {Post} from "./components/post.js";
import {Reaction} from "./components/reaction.js";

const userIdUserNameMap = new Map();

let postsFetchedSoFar = 0;
let postsTotalAvailable = Number.MAX_SAFE_INTEGER;
const postsToFetchAtATime = 3;

const postsSection = document.getElementById("posts-container");
const homeBtn = document.getElementById('nav-home');
const postsBtn = document.getElementById('nav-posts');
const contactBtn = document.getElementById('nav-contact');
const loadMoreBtn = document.getElementById('load-more-btn');

homeBtn.addEventListener("click", (e) => {
    hideAllSections();
    showSectionById("content-home");
});

postsBtn.addEventListener("click", (e) => {
    hideAllSections();
    showSectionById("content-posts");
});

contactBtn.addEventListener("click", (e) => {
    hideAllSections();
    showSectionById("content-contact");
});

loadMoreBtn.addEventListener("click", (e) => {
    loadPosts()
        .then();
})

function hideAllSections() {
    let mainContent = document.getElementById("content-sections")
    for (const section of mainContent.children) {
        section.classList.add("hide-section");
    }
}

function showSectionById(id) {
    document.getElementById(id).classList.remove("hide-section");
}


async function loadPosts() {
    loadMoreBtn.disabled = true;

    if (postsFetchedSoFar >= postsTotalAvailable) return;

    if (userIdUserNameMap.size === 0) {
        await fetchAllUsers();
    }

    try {
        const response = await fetch(`https://dummyjson.com/posts?limit=${postsToFetchAtATime}&skip=${postsFetchedSoFar}`);

        if (!response.ok) {
            console.log(`HTTP ${response.status} – ${response.statusText}`);
        }

        const {posts, total} = await response.json();
        postsFetchedSoFar += posts.length;
        postsTotalAvailable = total;

        for (const post of posts) {
            const {id, title, body, reactions, tags, userId, views} = post;
            const {likes, dislikes} = reactions;
            const reactionsObj = new Reaction(likes, dislikes)
            const postObject = new Post(id, title, body, reactionsObj, tags, userIdUserNameMap.get(userId), views)
            postsSection.appendChild(postObject)
        }
    } catch (error) {
        console.log("Error fetching posts", error)
    }

    if (postsFetchedSoFar >= postsTotalAvailable) {
        loadMoreBtn.style.display = "none";
    }

    loadMoreBtn.disabled = false;
}


async function fetchAllUsers() {
    try {
        const res = await fetch(`https://dummyjson.com/users?limit=0&select=username`);
        const usersResponse = await res.json();
        const {users} = usersResponse;
        for (const user of users) {
            const {id, username} = user;
            userIdUserNameMap.set(id, username)
        }
    } catch (error) {
        console.log("Error fetching users", error)
    }
}