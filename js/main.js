const SUPABASE_URL = 'https://xknskqxghdcorwtwewsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbnNrcXhnaGRjb3J3dHdld3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjIwMzYsImV4cCI6MjA5MjQzODAzNn0.vwXgPbKQuJxjABdxkzr8TyJmX83Z7CN2Ri7Wei4xd4c';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    initAuthTabs();
    initAuthActions();
});

function loadNavbar() {
    fetch("/components/navbar.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;
            
            const hamburger = document.getElementById("hamburger");
            const navLinks = document.getElementById("nav-links");
            if (hamburger && navLinks) {
                hamburger.onclick = () => navLinks.classList.toggle("active");
            }

            initAuthEntry();
        })
        .catch(err => console.error("Navbar 載入失敗:", err));
}

function initAuthEntry() {
    const authEntry = document.getElementById('auth-entry');
    const authModal = document.getElementById('auth-modal');

    if (!authEntry) return;

    authEntry.onclick = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            window.location.href = '/user/index.html'; 
        } else {
            authModal.classList.add('active'); 
        }
    };

    const userNameEl = document.getElementById('user-name');
    const userIdEl = document.getElementById('user-id');
    const userAvatarEl = document.getElementById('user-avatar');

    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
            const user = session.user;
            userNameEl.innerText = user.user_metadata.full_name || "使用者";
            userIdEl.innerText = `ID: ${user.id.substring(0, 8)}`;
            if (user.user_metadata.avatar_url) {
                userAvatarEl.src = user.user_metadata.avatar_url;
                userAvatarEl.style.display = 'block';
            } else {
                userAvatarEl.style.display = 'none';
            }
        } else {
            userNameEl.innerText = "訪客";
            userIdEl.innerText = "未登入";
            userAvatarEl.style.display = 'none';
        }
    });
}

function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const isLogin = tab.dataset.tab === 'login';
            document.getElementById('login-form-container').style.display = isLogin ? 'block' : 'none';
            document.getElementById('register-form-container').style.display = isLogin ? 'none' : 'block';
        };
    });

    const closeModal = document.getElementById('close-modal');
    const authModal = document.getElementById('auth-modal');
    if (closeModal) closeModal.onclick = () => authModal.classList.remove('active');
}

function initAuthActions() {
    // 註冊
    const regBtn = document.getElementById('register-submit-btn');
    if (regBtn) {
        regBtn.onclick = async () => {
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const name = document.getElementById('reg-name').value;
            const { error } = await supabaseClient.auth.signUp({
                email, password, options: { data: { full_name: name } }
            });
            if (error) return showToast("註冊失敗: " + error.message);
            showToast("註冊成功！請檢查郵件驗證");
            document.getElementById('auth-modal').classList.remove('active');
        };
    }

    const loginBtn = document.getElementById('login-submit-btn');
    if (loginBtn) {
        loginBtn.onclick = async () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) return showToast("登入失敗: " + error.message);
            showToast("歡迎回來！");
            document.getElementById('auth-modal').classList.remove('active');
        };
    }

    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.onclick = async () => {
            await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
            });
        };
    }
}

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
