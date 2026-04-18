const emailBtn = document.getElementById("copy-email");
const toast = document.getElementById("toast");

const email = "yoiyoi0905@email.com";

fetch("\\components\\navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;
    }); 

emailBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    await navigator.clipboard.writeText(email);

    showToast("已成功複製到剪貼簿");
  } catch (err) {
    showToast("複製失敗 😢");
  }
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

