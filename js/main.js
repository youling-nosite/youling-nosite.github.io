const emailBtn = document.getElementById("copy-email");
const toast = document.getElementById("toast");

const email = "yoiyoi0905@email.com";

emailBtn.addEventListener("click", (e) => {
  e.preventDefault();

  navigator.clipboard.writeText(email);
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
});

fetch("\\components\\navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;
    }); 