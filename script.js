const userIdUserNameMap = new Map();

let postsFetchedSoFar = 0;
let postsTotalAvailable = Number.MAX_SAFE_INTEGER;
const postsToFetchAtATime = 3;

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

class Reaction {
    constructor(likes, dislikes) {
        this.likes = likes;
        this.dislikes = dislikes;
    }
}

async function loadPosts() {
    const loadMoreBtn = document.getElementById("load-more-btn");
    loadMoreBtn.disabled = true;

    if (postsFetchedSoFar >= postsTotalAvailable) return;

    if (userIdUserNameMap.size === 0) {
        await fetchAllUsers();
    }

    const postsSection = document.getElementById("posts-container");

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
        console.log("Error fetching posts")
    }




    if(postsFetchedSoFar >= postsTotalAvailable){
        loadMoreBtn.style.display = "none";
    }

    loadMoreBtn.disabled = false;
}




async function fetchAllUsers() {
    try {
        const res = await fetch(`https://dummyjson.com/users?limit=0&select=username`);
        const usersResponse = await res.json();
        for (const user of usersResponse["users"]) {
            userIdUserNameMap.set(user["id"], user["username"])
        }
    } catch (error) {
        console.log("Error fetching users", error)
    }
}