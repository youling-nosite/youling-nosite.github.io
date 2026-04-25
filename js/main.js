// --- Supabase 配置 ---
const SUPABASE_URL = 'https://xknskqxghdcorwtwewsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbnNrcXhnaGRjb3J3dHdld3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjIwMzYsImV4cCI6MjA5MjQzODAzNn0.vwXgPbKQuJxjABdxkzr8TyJmX83Z7CN2Ri7Wei4xd4c';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 頁面加載完成後執行
document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();     // 載入導航列
    initAuthTabs();   // 初始化彈窗切換
    initAuthActions(); // 初始化登入註冊按鈕
    initEmailCopy();  // 初始化郵件複製功能
});

// --- 1. Navbar 載入邏輯 ---
function loadNavbar() {
    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) return;

    fetch("/components/navbar.html")
        .then(res => {
            if (!res.ok) throw new Error("Navbar file not found");
            return res.text();
        })
        .then(data => {
            navbarContainer.innerHTML = data;
            
            // Navbar 載入後才綁定漢堡選單
            const hamburger = document.getElementById("hamburger");
            const navLinks = document.getElementById("nav-links");
            if (hamburger && navLinks) {
                hamburger.onclick = () => navLinks.classList.toggle("active");
            }

            // Navbar 載入後才初始化頭像區塊
            initAuthEntry();
        })
        .catch(err => console.error("Navbar 載入失敗:", err));
}

// --- 2. 使用者狀態與進入點 ---
function initAuthEntry() {
    const authEntry = document.getElementById('auth-entry');
    const authModal = document.getElementById('auth-modal');
    if (!authEntry || !authModal) return;

    // 點擊頭像區塊：已登入去用戶頁，未登入開彈窗
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

    // 監聽登入狀態改變
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
            const user = session.user;
            if (userNameEl) userNameEl.innerText = user.user_metadata.full_name || "使用者";
            if (userIdEl) userIdEl.innerText = `ID: ${user.id.substring(0, 8)}`;
            
            if (userAvatarEl) {
                if (user.user_metadata.avatar_url) {
                    userAvatarEl.src = user.user_metadata.avatar_url;
                    userAvatarEl.style.display = 'block';
                } else {
                    userAvatarEl.style.display = 'none'; // 顯示 CSS 預設背景色
                }
            }
        } else {
            if (userNameEl) userNameEl.innerText = "訪客";
            if (userIdEl) userIdEl.innerText = "未登入";
            if (userAvatarEl) userAvatarEl.style.display = 'none';
        }
    });
}

// --- 3. 彈窗 UI 切換 ---
function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.getElementById('close-modal');

    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const isLogin = tab.dataset.tab === 'login';
            
            const loginForm = document.getElementById('login-form-container');
            const regForm = document.getElementById('register-form-container');
            if (loginForm) loginForm.style.display = isLogin ? 'block' : 'none';
            if (regForm) regForm.style.display = isLogin ? 'none' : 'block';
        };
    });

    if (closeModal && authModal) {
        closeModal.onclick = () => authModal.classList.remove('active');
        // 點擊背景關閉
        authModal.onclick = (e) => {
            if (e.target === authModal) authModal.classList.remove('active');
        };
    }
}

// --- 4-1. 登入/註冊/Google 動作 ---
function initAuthActions() {
    const authModal = document.getElementById('auth-modal');

    // 註冊邏輯
    const regBtn = document.getElementById('register-submit-btn');
    if (regBtn) {
        regBtn.onclick = async () => {
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const name = document.getElementById('reg-name').value;
            
            if (!email || !password) return showToast("請填寫完整資訊");

            const { error } = await supabaseClient.auth.signUp({
                email, password, options: { data: { full_name: name } }
            });
            
            if (error) return showToast("註冊失敗: " + error.message);
            showToast("註冊成功！請檢查郵件驗證");
            authModal.classList.remove('active');
        };
    }

    // 密碼登入邏輯
    const loginBtn = document.getElementById('login-submit-btn');
    if (loginBtn) {
        loginBtn.onclick = async () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
            
            if (error) return showToast("登入失敗: " + error.message);
            showToast("歡迎回來！");
            authModal.classList.remove('active');
        };
    }

    // Google 登入邏輯
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

// 在 DOMContentLoaded 或 initAuthEntry 之後加入
async function checkUserSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session && window.location.pathname.includes('/user/')) {
        window.location.href = '/';
        return;
    }

    if (session) {
        const user = session.user;
        
        const nameEl = document.getElementById('display-name');
        const emailEl = document.getElementById('display-email');
        const idEl = document.getElementById('display-id');
        const createdEl = document.getElementById('display-created');
        const avatarEl = document.getElementById('big-avatar');

        if (nameEl) nameEl.innerText = user.user_metadata.full_name || "未設定暱稱";
        if (emailEl) emailEl.innerText = user.email;
        if (idEl) idEl.innerText = user.id;
        if (createdEl) createdEl.innerText = new Date(user.created_at).toLocaleString();
        
        if (avatarEl && user.user_metadata.avatar_url) {
            avatarEl.style.backgroundImage = `url('${user.user_metadata.avatar_url}')`;
        }
    }
}

// --- 4-2. 登出功能 ---
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.onclick = async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) showToast("登出失敗");
        else {
            showToast("已成功登出");
            setTimeout(() => window.location.href = '/', 1000);
        }
    };
}

// 記得執行檢查
checkUserSession();

// --- 5. 其他工具功能 ---
function initEmailCopy() {
    const emailBtn = document.getElementById("copy-email");
    const emailStr = "yoiyoi0905@email.com";
    if (emailBtn) {
        emailBtn.onclick = async (e) => {
            e.preventDefault();
            try {
                await navigator.clipboard.writeText(emailStr);
                showToast("已成功複製到剪貼簿");
            } catch (err) {
                showToast("複製失敗 😢");
            }
        };
    }
}

function showToast(message) {
    const toastContainer = document.getElementById("toast-container"); 
    if (!toastContainer) return; 

    const toast = document.createElement("div");
    toast.classList.add("toast-msg");
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // 強制重繪觸發動畫
    toast.offsetHeight; 
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show"); 
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}