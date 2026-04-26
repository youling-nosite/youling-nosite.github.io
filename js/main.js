// --- Supabase 配置 ---
const SUPABASE_URL = 'https://xknskqxghdcorwtwewsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbnNrcXhnaGRjb3J3dHdld3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjIwMzYsImV4cCI6MjA5MjQzODAzNn0.vwXgPbKQuJxjABdxkzr8TyJmX83Z7CN2Ri7Wei4xd4c';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 頁面加載中心控管
document.addEventListener("DOMContentLoaded", async () => {
    loadNavbar(); 
    initEmailCopy();
    initPasswordToggle(); // 新增：初始化密碼切換功能
    
    // 取得 Session
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    // 頁面路徑判斷
    const isUserPage = window.location.pathname.includes('/user/');
    
    if (isUserPage) {
        if (!session) {
            window.location.href = '/'; 
        } else {
            renderUserPage(session.user);
        }
    } else {
        initAuthTabs();
        initAuthActions();
    }

    // 全域狀態監聽：一旦狀態改變（如登入/登出），同步更新 UI
    supabaseClient.auth.onAuthStateChange((event, session) => {
        updateNavbarUserInfo(session?.user);
        if (event === 'SIGNED_OUT' && isUserPage) {
            window.location.href = '/';
        }
    });
});

// --- 1. UI 組件載入 ---
function loadNavbar() {
    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) return;

    fetch("/components/navbar.html")
        .then(res => res.text())
        .then(data => {
            navbarContainer.innerHTML = data;
            
            // 綁定選單開關
            const hamburger = document.getElementById("hamburger");
            const navLinks = document.getElementById("nav-links");
            if (hamburger && navLinks) {
                hamburger.onclick = () => navLinks.classList.toggle("active");
            }
            
            handleAuthEntry();
            // 初始載入時同步一次 Navbar 狀態
            supabaseClient.auth.getSession().then(({data}) => updateNavbarUserInfo(data.session?.user));
        });
}

// --- 2. 身份狀態與導航邏輯 ---
function handleAuthEntry() {
    const authEntry = document.getElementById('auth-entry');
    const authModal = document.getElementById('auth-modal');
    if (!authEntry) return;

    authEntry.onclick = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            window.location.href = '/user/'; 
        } else if (authModal) {
            authModal.classList.add('active'); 
        }
    };
}

function updateNavbarUserInfo(user) {
    const userNameEl = document.getElementById('user-name');
    const userIdEl = document.getElementById('user-id');
    const userAvatarEl = document.getElementById('user-avatar');

    if (user) {
        if (userNameEl) userNameEl.innerText = user.user_metadata.full_name || "使用者";
        if (userIdEl) userIdEl.innerText = `ID: ${user.id.substring(0, 8)}`;
        if (userAvatarEl) {
            if (user.user_metadata.avatar_url) {
                userAvatarEl.src = user.user_metadata.avatar_url;
                userAvatarEl.style.display = 'block';
            } else {
                userAvatarEl.style.display = 'none'; 
            }
        }
    } else {
        if (userNameEl) userNameEl.innerText = "訪客";
        if (userIdEl) userIdEl.innerText = "未登入";
        if (userAvatarEl) userAvatarEl.style.display = 'none';
    }
}

// --- 3. 個人資料頁面邏輯 (/user/ 專用) ---
async function renderUserPage(user) {
    const avatarEl = document.getElementById('big-avatar');
    const nameInput = document.getElementById('edit-name');
    const avatarInput = document.getElementById('avatar-url-input');
    const emailEl = document.getElementById('display-email');
    const idEl = document.getElementById('display-id');
    const createdEl = document.getElementById('display-created');
    const bindBtn = document.getElementById('bind-google-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const metadata = user.user_metadata;
    if (nameInput) nameInput.value = metadata.full_name || "";
    if (emailEl) emailEl.innerText = user.email;
    if (idEl) idEl.innerText = user.id;
    if (createdEl) createdEl.innerText = new Date(user.created_at).toLocaleDateString();
    
    if (avatarEl && metadata.avatar_url) {
        avatarEl.style.backgroundImage = `url('${metadata.avatar_url}')`;
        if (avatarInput) avatarInput.value = metadata.avatar_url;
    }

    // Google 綁定邏輯
    const isGoogleLinked = user.identities?.some(id => id.provider === 'google');
    if (bindBtn) {
        if (isGoogleLinked) {
            bindBtn.innerText = "已連結 Google";
            bindBtn.classList.add('linked');
            bindBtn.disabled = true;
        } else {
            bindBtn.onclick = bindGoogleAccount;
        }
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            saveBtn.disabled = true;
            const originalText = saveBtn.innerText;
            saveBtn.innerText = "儲存中...";
            
            const { error } = await supabaseClient.auth.updateUser({
                data: { 
                    full_name: nameInput.value,
                    avatar_url: avatarInput.value 
                }
            });

            if (error) {
                showToast("更新失敗: " + error.message);
                saveBtn.disabled = false;
                saveBtn.innerText = originalText;
            } else {
                showToast("設定已儲存！");
                setTimeout(() => location.reload(), 800);
            }
        };
    }

    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            await supabaseClient.auth.signOut();
            window.location.href = '/';
        };
    }
}

async function bindGoogleAccount() {
    showToast("正在前往 Google 驗證...");
    const { error } = await supabaseClient.auth.linkIdentity({
        provider: 'google',
        options: { redirectTo: window.location.href }
    });
    if (error) showToast("連結失敗: " + error.message);
}

// --- 4. 彈窗 UI 與驗證邏輯 ---
function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.getElementById('close-modal');
    if (!authModal) return;

    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const isLogin = tab.dataset.tab === 'login';
            document.getElementById('login-form-container').style.display = isLogin ? 'block' : 'none';
            document.getElementById('register-form-container').style.display = isLogin ? 'none' : 'block';
        };
    });

    if (closeModal) {
        closeModal.onclick = () => authModal.classList.remove('active');
    }
}

// 新增：初始化密碼切換按鈕
function initPasswordToggle() {
    // 使用事件委託或直接綁定，確保彈窗內的眼睛按鈕有效
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-password')) {
            const btn = e.target;
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input.type === 'password') {
                input.type = 'text';
                btn.textContent = '🙈';
            } else {
                input.type = 'password';
                btn.textContent = '👁️';
            }
        }
    });
}

function initAuthActions() {
    const authModal = document.getElementById('auth-modal');
    if (!authModal) return;

    // 登入
    const loginBtn = document.getElementById('login-submit-btn');
    if (loginBtn) {
        loginBtn.onclick = async () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            if(!email || !password) return showToast("請填寫帳號密碼");
            
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) return showToast("登入失敗: " + error.message);
            authModal.classList.remove('active');
            showToast("歡迎回來！");
        };
    }

    // 註冊 (更新：包含二次密碼檢查)
    const regBtn = document.getElementById('register-submit-btn');
    if (regBtn) {
        regBtn.onclick = async () => {
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-password-confirm').value; // 新增
            const name = document.getElementById('reg-name').value;
            
            if(!email || !password || !name || !confirmPassword) return showToast("請完整填寫註冊資訊");

            // 密碼一致性檢查
            if (password !== confirmPassword) {
                return showToast("兩次輸入的密碼不一致！");
            }

            if (password.length < 6) {
                return showToast("密碼至少需要 6 位");
            }

            const { error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } }
            });
            if (error) return showToast("註冊失敗: " + error.message);
            showToast("註冊成功！請至信箱查收驗證信");
            authModal.classList.remove('active');
        };
    }

    // Google 快速登入
    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.onclick = async () => {
            showToast("跳轉至 Google...");
            await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
            });
        };
    }
}

// --- 5. 工具功能 ---
function showToast(message) {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.textContent = message;
    container.appendChild(toast);
    
    // 動態觸發
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function initEmailCopy() {
    const btn = document.getElementById("copy-email");
    if (btn) {
        btn.onclick = (e) => {
            e.preventDefault();
            navigator.clipboard.writeText("yoiyoi0905@email.com")
                .then(() => showToast("已複製郵件地址"))
                .catch(() => showToast("複製失敗"));
        };
    }
}