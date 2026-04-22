// ==========================================
// 1. Supabase 初始化
// ==========================================
const SUPABASE_URL = 'https://xknskqxghdcorwtwewsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbnNrcXhnaGRjb3J3dHdld3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjIwMzYsImV4cCI6MjA5MjQzODAzNn0.vwXgPbKQuJxjABdxkzr8TyJmX83Z7CN2Ri7Wei4xd4c';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 2. 載入 Navbar 與綁定所有功能
// ==========================================
fetch("/components/navbar.html")
    .then(res => res.text())
    .then(data => {
        // 先把 HTML 塞進網頁
        document.getElementById("navbar").innerHTML = data;
        
        // 抓取剛剛塞進去的元素
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userInfo = document.getElementById('user-info');
        const loginModal = document.getElementById('login-modal');
        const hamburger = document.getElementById("hamburger");
        const navLinks = document.getElementById("nav-links");

        // --- A. 監聽登入狀態切換 (搬到這裡，確保元素都存在了才執行) ---
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (session) {
                if(loginBtn) loginBtn.style.display = 'none';
                if(logoutBtn) logoutBtn.style.display = 'flex';
                if(userInfo) {
                    userInfo.style.display = 'inline';
                    userInfo.textContent = `嗨，${session.user.email.split('@')[0]}`;
                }
            } else {
                if(loginBtn) loginBtn.style.display = 'flex';
                if(logoutBtn) logoutBtn.style.display = 'none';
                if(userInfo) userInfo.style.display = 'none';
            }
        });
        
        // --- B. 漢堡選單 ---
        if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
                navLinks.classList.toggle("active");
            });
        }

        // --- C. 登入彈窗控制 ---
        if(loginBtn && loginModal) {
            loginBtn.onclick = () => loginModal.style.display = 'block';
        }
        const closeModalBtn = document.getElementById('close-modal');
        if(closeModalBtn && loginModal) {
            closeModalBtn.onclick = () => loginModal.style.display = 'none';
        }
        
        // --- D. 註冊功能 ---
        const btnSignup = document.getElementById('do-signup');
        if (btnSignup) {
            btnSignup.onclick = async () => {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const { error } = await supabaseClient.auth.signUp({ email, password });
                if (error) alert(error.message);
                else alert("請去信箱收取驗證信！");
            };
        }

        // --- E. 登入功能 (修改為登入成功後跳轉) ---
        const btnLogin = document.getElementById('do-login');
        if (btnLogin) {
            btnLogin.onclick = async () => {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
                
                if (error) {
                    alert("登入失敗：" + error.message);
                } else {
                    showToast("登入成功！正在跳轉...");
                    // 登入成功後，延遲 1 秒鐘跳轉回首頁
                    setTimeout(() => {
                        window.location.href = "/"; 
                    }, 1000);
                }
            };
        }

        // --- F. 登出功能 ---
        if(logoutBtn) {
            logoutBtn.onclick = async () => {
                await supabaseClient.auth.signOut();
                showToast("已成功登出");
            };
        }
    })
    .catch(error => console.error("Navbar 載入失敗:", error));


// ==========================================
// 3. Email 複製功能
// ==========================================
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

// ==========================================
// 4. 提示訊息功能 (Toast)
// ==========================================
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