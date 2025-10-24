export class Comment {
    constructor(body, likes, username){
        this.body = body;
        this.likes = likes;
        this.username = username;
    }

    asHtml(){
        const article = document.createElement("article");
        const usernameHeader = document.createElement("h5");
        const body = document.createElement("p");
        const likes = document.createElement("small");

        usernameHeader.innerText = this.username;
        body.innerText = this.body;
        likes.innerText = `Likes: ${this.likes}`;

        article.appendChild(usernameHeader);
        article.appendChild(body);
        article.appendChild(likes);

        article.classList.add("comment");

        return article;
    }
}