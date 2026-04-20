const feed = document.getElementById("ig-feed");
const modal = document.getElementById("modal");
const modalComments = document.getElementById("modal-comments");
const closeBtn = document.getElementById("close");

async function loadPosts() {
  const res = await fetch("/data/posts.json");
  const posts = await res.json();

  posts.reverse().forEach(post => {
    const el = document.createElement("div");
    el.className = "ig-post";

    el.innerHTML = `
      <div class="ig-post-header">
        <img src="${post.avatar}">
        <span>${post.username}</span>
      </div>

      <img class="ig-post-img" src="${post.image}">

      <div class="ig-post-content">
        <p><strong>${post.username}</strong> ${post.text}</p>
      </div>

      <div class="comment-btn">查看留言 (${post.comments.length})</div>
    `;

    // 點擊留言
    el.querySelector(".comment-btn").onclick = () => {
      showComments(post.comments);
    };

    feed.appendChild(el);
  });
}

function showComments(comments) {
  modalComments.innerHTML = "";

  comments.forEach(c => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${c.user}</strong> ${c.text}`;
    modalComments.appendChild(p);
  });

  modal.style.display = "block";
}

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

loadPosts();