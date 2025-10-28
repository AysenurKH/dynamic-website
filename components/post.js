import {Comment} from "./comment.js";
import {showMyModal} from "./modal.js";

export class Post {
    
    constructor(id, title, body, likes, dislikes, tags, userId, userName) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.likes = likes;
        this.dislikes = dislikes;
        this.tags = tags;
        this.userId = userId;
        this.userName = userName;
        this.commentsFetched = false;
    }


    asHtml() {
        const article = document.createElement("article");
        const usernameHeader = document.createElement("h3");
        const titleHeader = document.createElement("h4");
        const body = document.createElement("p");
        const likes = document.createElement("small");
        const tags = document.createElement("small");
        const details = document.createElement("details");
        const summary = document.createElement("summary")
        const commentsContainer = document.createElement("section");
        article.classList.add("post")
        usernameHeader.classList.add("username");
        commentsContainer.classList.add("comments-container");

        usernameHeader.innerText = this.userName;
        titleHeader.innerText = this.title;
        body.innerText = this.body;
        likes.innerText = `Likes: ${this.likes} | Dislikes: ${this.dislikes}`;
        tags.innerText = `Tags: ${this.tags.join(" ")}`;
        summary.innerText = "Comments";

        usernameHeader.addEventListener("click", (e) => {
            this.getUserData()
                .then(userData => this.showUserData(userData));
        });

        details.addEventListener("toggle", (event) => {
            if (!this.commentsFetched && details.open) {
                this.getCommentData()
                    .then(commentData => this.showCommentData(commentsContainer, commentData));
            }
        });

        // The summary tag defines the text of the expandable details-container. In this case, we want the text "Comments".
        details.appendChild(summary);
        // The comments are not placed directly inside the <details> tag. Instead, let's add a section in there, which is where we add the comments
        details.appendChild(commentsContainer)
        article.appendChild(usernameHeader);
        article.appendChild(titleHeader);
        article.appendChild(body);
        article.appendChild(likes);
        article.appendChild(tags);
        article.appendChild(details);
        return article;
    }

    async getCommentData() {
        try {
            const response = await fetch(`https://dummyjson.com/comments/post/${this.id}?limit=0`);

            if (!response.ok) {
                showMyModal(`HTTP ${response.status} – ${response.statusText}`);
            }


            return await response.json();
        } catch (error) {
            showMyModal(`Error fetching posts: ${error}`)
        }
    }

    showCommentData(commentsContainer, commentData) {
        const {comments} = commentData;
        if (comments.length) {
            for (const comment of comments) {
                const { body, likes, user: {username} } = comment;
                const commentObject = new Comment(body, likes, username);
                commentsContainer.appendChild(commentObject.asHtml());
            }
        } else {
            const noCommentsParagraph = document.createElement("p");
            noCommentsParagraph.innerText = "No comments available";
            commentsContainer.appendChild(noCommentsParagraph);
        }
        this.commentsFetched = true;
    }

    async getUserData() {
        try {
            const response = await fetch(`https://dummyjson.com/users/${this.userId}`);

            if (!response.ok) {
                showMyModal(`HTTP ${response.status} – ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            showMyModal(`Error fetching posts: ${error}`)
        }
    }

    showUserData(userData) {
        const {firstName, address, ip} = userData;
        const addr = address["address"];
        const textToShow = `
            Name: ${firstName}
            IP: ${ip}
            Address: ${addr}`;
        showMyModal(textToShow)
    }
}
