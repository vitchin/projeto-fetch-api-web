const url = "https://jsonplaceholder.typicode.com/posts";

const elementoLoading = document.querySelector("#loading");
const conteinerPosts = document.querySelector("#posts-conteiner");

const paginaPost = document.querySelector("#post");
const conteinerPost = document.querySelector("#post-conteiner");
const conteinerComentarios = document.querySelector("#comments-conteiner");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

// pegar id para url

const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

// pegar todos os posts

async function pegarTodosPosts(){

    const response = await fetch(url);

    console.log(response);

    const data = await response.json();
    console.log(data);

    elementoLoading.classList.add("hide");
    data.map((post)=>{
        const div = document.createElement("div");
        const title = document.createElement("h2");
        const body = document.createElement("p");
        const link = document.createElement("a");

        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = 'Ler'
        link.setAttribute("href", `/post.html?id=${post.id}`);

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        conteinerPosts.appendChild(div);

    });
}

// Pegar post individual
async function getPost(id){

    const [responsePost, responseComentarios] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ]);

    const dataPost = await responsePost.json();
    const dataComentarios = await responseComentarios.json();

    elementoLoading.classList.add("hide");
    paginaPost.classList.remove("hide");

    const title = document.createElement("h1");
    const body = document.createElement("p");

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    conteinerPost.appendChild(title);
    conteinerPost.appendChild(body);

    console.log(dataComentarios);

    dataComentarios.map((comment)=>{
        criarComentario(comment);
    });

}

function criarComentario(comment){
    const div = document.createElement("div");
    const email = document.createElement("h3");
    const comentarioBody = document.createElement("p");

    email.innerText = comment.email;
    comentarioBody.innerText = comment.body;

    div.appendChild(email);
    div.appendChild(comentarioBody);

    conteinerComentarios.appendChild(div);
}

// postar um comentario

async function postarComentario(comment){
    const response = await fetch(`${url}/${postId}/comments`, {
        method: "POST",
        body: comment,
        headers:{
            "Content-type":"application/json",
        },
    });

    const data = await response.json();
    criarComentario(data);

}

if(!postId){
    pegarTodosPosts();
}else {
    getPost(postId);

    // adicionar evento para comment form
    commentForm.addEventListener("submit", (e)=>{
        e.preventDefault();

        let comment = {
            email: emailInput.value,
            body: bodyInput.value
        };

        comment = JSON.stringify(comment);

        postarComentario(comment);
    })

}
