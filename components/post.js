export class Post extends HTMLElement {
    constructor(id, title, body, reactions, tags, userName, views) {
        super()
        this.id = id;
        this.title = title;
        this.body = body;
        this.reactions = reactions;
        this.tags = tags;
        this.userName = userName;
        this.views = views;
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const tags = this.tags.join(" ");
        this.shadow.innerHTML = `
            <style>
                .post {
                    background-color: yellow;
                    padding: 20px;
                    border: 1px solid black;
                }
            </style>
            <article class="post">
                <h3>${this.userName}: ${this.title}</h3>
                <p>${this.body}</p>
                <p>Likes: ${this.reactions.likes} | Dislikes: ${this.reactions.dislikes}</p>
                <p>${tags}</p>
                <div class="extra">
                    
                </div>
            </article>
        `;
    }


}
customElements.define('my-post', Post);