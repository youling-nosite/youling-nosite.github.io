fetch("/components/navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;
        
        const hamburger = document.getElementById("hamburger");
        const navLinks = document.getElementById("nav-links");
        
        if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
                navLinks.classList.toggle("active");
            });
        }
    })
    .catch(error => console.error("Navbar 載入失敗:", error));

const emailBtn = document.getElementById("copy-email");
const email = "yoiyoi0905@email.com";

if (emailBtn) {
    emailBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        await navigator.clipboard.writeText(email);
        showToast("已成功複製到剪貼簿");
      } catch (err) {
        showToast("複製失敗 😢");
      }
    });
}

function showToast(message) {
  const toastContainer = document.getElementById("toast-container"); 
  if (!toastContainer) return; 

  const toast = document.createElement("div");
  toast.classList.add("toast-msg");
  toast.textContent = message;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });
  });

  setTimeout(() => {
    toast.classList.remove("show"); 
    
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}