import {Post} from "./components/post.js";
import {showMyModal} from "./components/modal.js";

// Documentation: https://dummyjson.com/docs/posts

// Holds <UserId(int), Username(string)>
// We fill this once when we need it, when the first posts are loaded
const userIdUserNameMap = new Map();

let postsFetchedSoFar = 0;
let postsTotalAvailable = Number.MAX_SAFE_INTEGER; // We don't know the total yet. We will set it after the first response
const postsToFetchAtATime = 3;

const postsContainer = document.getElementById("posts-container");
const loadMoreBtn = document.getElementById('load-more-btn');

loadMoreBtn.addEventListener("click", (e) => {
    fetchPosts()
        .then(posts => showPosts(posts));
})


async function fetchPosts() {
    // Disabling the button so you can only click it once. It is enabled again at the end of the function.
    loadMoreBtn.disabled = true;

    // We have not pre-fetched the usernames. Let's do that.
    if (userIdUserNameMap.size === 0) {
        await fetchAllUsers();
    }

    try {
        const response = await fetch(`https://dummyjson.com/posts?limit=${postsToFetchAtATime}&skip=${postsFetchedSoFar}`);

        if (!response.ok) {
            showMyModal(`HTTP ${response.status} – ${response.statusText}`);
        }

        // response.json() returns the body of the HTTP response from the server. This is a promise, so we need to await that one also
        const {posts, total} = await response.json();
        postsFetchedSoFar += posts.length;
        postsTotalAvailable = total;

        // We have now fetched all posts. Hide the load-more button
        if (postsFetchedSoFar >= postsTotalAvailable) {
            loadMoreBtn.style.display = "none";
        }

        // Enable the load-more button again and return the fetched posts
        loadMoreBtn.disabled = false;
        return posts;

    } catch (error) {
        loadMoreBtn.disabled = false;
        showMyModal(`Error fetching posts: ${error}`)
    }
}

function showPosts(posts) {
    for (const post of posts) {
        const {id, title, body, reactions: {likes, dislikes}, tags, userId} = post;
        const postObject = new Post(id, title, body, likes, dislikes, tags, userId, userIdUserNameMap.get(userId))
        postsContainer.appendChild(postObject.asHtml())
    }
}


async function fetchAllUsers() {
    try {
        // Limit=0 to get all users.
        // select=username so that we only get the username. It's the only field we need, and it will speed up the response.
        const response = await fetch(`https://dummyjson.com/users?limit=0&select=username`);
        if (!response.ok) {
            showMyModal(`HTTP ${response.status} – ${response.statusText}`);
        }
        const usersResponse = await response.json();
        const {users} = usersResponse;
        for (const user of users) {
            const {id, username} = user;
            userIdUserNameMap.set(id, username)
        }
    } catch (error) {
        showMyModal(`Error fetching posts: ${error}`)
    }
}