"use strict";
const postForm = document.getElementById("post-form");
const textArea = document.getElementById("display-text");
let postInput = document.getElementById("post-input");
const sendPostBtn = document.getElementById("send-post");
const postsUrl = "/api/posts/";
let editItem = null;

//Generates CSRFToken required for sending form data in django
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");
/* ==============================================================================*/
function randomUser() {
  //Generate random username to save to database
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let username = "";
  const length = 8;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    username += charset.charAt(randomIndex);
  }
  return username;
}

function getPosts() {
  //fetch posts from api and sends to frontend to be rendered
  fetch(postsUrl)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      listPosts(data);
    });
}

getPosts();

function listPosts(posts) {
  //Renders posts to frontend
  textArea.innerHTML = "";
  postInput.value = "";
  posts.forEach((el, i) => {
    const html = `
    <div class="card border-primary mb-3">
      <div class="card-body"
      
        <small>@${el.post_user}</small>
        <p>${el.post_name}</p>
        <button id="edit-post-btn" class="btn btn-warning"><i class="fa-regular fa-pen-to-square"></i></buttton>
        <button id="delete-post-btn" class="btn btn-danger"><i class="fa-solid fa-trash"></i></buttton>
      </div>
    </div>
    
    `;
    textArea.innerHTML += html;
  });
  const deleteBtn = document.querySelectorAll("#delete-post-btn");
  const editBtn = document.querySelectorAll("#edit-post-btn");

  deleteBtn.forEach((el, i) => {
    el.addEventListener("click", function () {
      deletePost(posts[i]);
    });
  });

  editBtn.forEach((el, i) => {
    el.addEventListener("click", function () {
      editPost(posts[i]);
    });
  });
}

postForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let user = randomUser();
  let post = postInput.value;
  let url = "/api/create-post/";

  if (editItem != null) {
    url = `/api/edit-post/${editItem.id}/`;
    user = editItem.post_user;
  }
  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-CSRFTOKEN": csrftoken,
    },
    body: JSON.stringify({
      "post_name": post,
      "post_user": user,
    }),
  }).then((res) => {
    getPosts();
  });
});

function editPost(post) {
  editItem = post;
  postInput.value = post.post_name;
  console.log(`Edit post ${post.id}`);
}

function deletePost(post) {
  let url = `/api/delete-post/${post.id}`;
  if (confirm(`Delete this post?`)) {
    console.log(`Delete post ${post.id}`);
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFTOKEN": csrftoken,
      },
    }).then((res) => getPosts());
  } else {
    alert("Delete canceled!");
  }
}
