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

// --- Supabase 配置 ---
const SUPABASE_URL = 'https://xknskqxghdcorwtwewsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbnNrcXhnaGRjb3J3dHdld3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjIwMzYsImV4cCI6MjA5MjQzODAzNn0.vwXgPbKQuJxjABdxkzr8TyJmX83Z7CN2Ri7Wei4xd4c';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 全域變數：儲存當前登入者的個人資訊
let currentUserProfile = null;

// ==========================================
// 1. 登入功能 (使用 Supabase Auth)
// ==========================================
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showToast("請填寫 Email 與密碼！");
        return;
    }

    showToast("登入中...");

    try {
        // 呼叫內建登入 API
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        showToast("登入成功！");
        
        // 登入後立即獲取使用者詳細資料 (Role, Account)
        await checkUserStatus();
        
        // 如果你有做頁面切換，可以在這裡跳轉
        // document.getElementById("login-section").style.display = "none";
        // document.getElementById("query-section").style.display = "block";

    } catch (error) {
        showToast("登入失敗：" + error.message);
        console.error("Login Error:", error);
    }
}

// ==========================================
// 2. 檢查登入狀態與獲取 Profile
// ==========================================
async function checkUserStatus() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (user) {
        // 去 profiles 表抓取該 UUID 對應的角色與學號
        const { data: profile, error } = await supabaseClient
            .from('profiles')
            .select('role, account')
            .eq('id', user.id)
            .single();

        if (profile) {
            currentUserProfile = profile;
            
            // 🔥 解開封印：隱藏登入區塊，顯示查詢區塊
            document.getElementById("login-section").classList.add("hidden");
            document.getElementById("query-section").classList.remove("hidden");
            
            // 顯示歡迎文字
            const roleName = profile.role === 'teacher' ? '老師' : '同學';
            document.getElementById("user-greeting").innerText = `歡迎回來，${profile.account} ${roleName}！`;
        }
    } else {
        currentUserProfile = null;
        // 如果沒有登入：顯示登入區塊，隱藏查詢區塊和成績表
        document.getElementById("login-section").classList.remove("hidden");
        document.getElementById("query-section").classList.add("hidden");
        document.getElementById("score-results").innerHTML = "";
    }
}

// ==========================================
// 3. 查詢成績 (整合 RLS 防護)
// ==========================================
async function handleQueryGrade(e) {
    e.preventDefault(); 

    // 先確認是否有登入
    if (!currentUserProfile) {
        showToast("請先登入系統！");
        return;
    }

    const subject = document.getElementById("subject").value;
    const semester = document.getElementById("semester") ? document.getElementById("semester").value : "all";

    showToast("正在檢索資料...");

    try {
        // 開始建立查詢 (RLS 會自動過濾：學生只能看到自己的，老師能看到全部)
        let query = supabaseClient.from('scores').select('student_id, semester, subject, range, score');

        // 篩選條件
        if (subject !== "all") {
            query = query.eq('subject', subject);
        }
        if (semester !== "all") {
            query = query.eq('semester', semester);
        }

        // 排序邏輯
        if (currentUserProfile.role === 'teacher') {
            showToast("老師您好！載入全班成績中...");
            query = query.order('student_id', { ascending: true }).order('semester', { ascending: true });
        } else {
            // 學生端排序
            query = query.order('semester', { ascending: true });
        }

        const { data: scoreData, error: scoreError } = await query;
        if (scoreError) throw scoreError;

        // 渲染畫面
        if (scoreData && scoreData.length > 0) {
            showToast("查詢成功！");
            if (currentUserProfile.role === 'teacher') {
                displayAdminScores(scoreData);
            } else {
                displayScores(scoreData);
            }
        } else {
            showToast("查無資料");
            document.getElementById("score-results").innerHTML = 
                `<p style="text-align: center; color: rgba(255,255,255,0.7);">目前尚無符合條件的成績紀錄。</p>`;
        }

    } catch (err) {
        console.error("查詢發生錯誤:", err.message);
        showToast("存取失敗，請確認權限。");
    }
}

// ==========================================
// 4. 畫面渲染函數 (保持不變)
// ==========================================
function displayScores(scores) {
    const resultContainer = document.getElementById("score-results");
    if (!resultContainer) return;

    let html = `
        <table class="score-table">
            <thead>
                <tr><th>學期</th><th>科目</th><th>範圍</th><th>分數</th></tr>
            </thead>
            <tbody>
                ${scores.map(s => `
                    <tr>
                        <td>${s.semester}</td>
                        <td>${s.subject}</td>
                        <td>${s.range}</td>
                        <td style="font-weight: bold; color: ${s.score < 60 ? '#ff6b6b' : '#69db7c'};">
                            ${Number(s.score).toFixed(1)} 
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
    resultContainer.innerHTML = html;
}

function displayAdminScores(scores) {
    const resultContainer = document.getElementById("score-results");
    if (!resultContainer) return;

    let html = `
        <table class="score-table">
            <thead>
                <tr><th>學號</th><th>學期</th><th>科目</th><th>範圍</th><th>分數</th></tr>
            </thead>
            <tbody>
                ${scores.map(s => `
                    <tr>
                        <td style="color: #4dabf7; font-weight: bold;">${s.student_id}</td>
                        <td>${s.semester}</td>
                        <td>${s.subject}</td>
                        <td>${s.range}</td>
                        <td style="font-weight: bold; color: ${s.score < 60 ? '#ff6b6b' : '#69db7c'};">
                            ${Number(s.score).toFixed(1)} 
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
    resultContainer.innerHTML = html;
}

// ==========================================
// 5. 事件監聽
// ==========================================
const loginBtn = document.getElementById("login-btn"); // 假設你的登入按鈕 ID
if (loginBtn) {
    loginBtn.addEventListener("click", handleLogin);
}

const queryBtn = document.getElementById("query-btn");
if (queryBtn) {
    queryBtn.addEventListener("click", handleQueryGrade);
}

// 頁面載入時自動檢查一次登入狀態
window.onload = checkUserStatus;