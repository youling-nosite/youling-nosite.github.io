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

const SUPABASE_URL = 'https://xknskqxghdcorwtwewsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbnNrcXhnaGRjb3J3dHdld3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjIwMzYsImV4cCI6MjA5MjQzODAzNn0.vwXgPbKQuJxjABdxkzr8TyJmX83Z7CN2Ri7Wei4xd4c';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


async function handleQueryGrade(e) {
    e.preventDefault(); 

    const subject = document.getElementById("subject").value;
    const inputAccount = document.getElementById("student-id").value.trim(); 
    const password = document.getElementById("password").value.trim();

    if (!inputAccount || !password) {
        showToast("請填寫帳號與密碼！");
        return;
    }

    showToast("驗證身分中，請稍候...");

    try {
        const { data: teacherData, error: teacherError } = await supabaseClient
            .from('teachers')
            .select('username') 
            .eq('username', inputAccount)
            .eq('password', password);

        if (teacherError) throw teacherError;

        if (teacherData && teacherData.length > 0) {
            showToast("老師您好！載入全班成績中... 📊");
            
            let query = supabaseClient
                .from('scores')
                .select('student_id, semester, subject, range, score')
                .order('student_id', { ascending: true })
                .order('semester', { ascending: true });
            
            if (subject !== "all") {
                query = query.eq('subject', subject);
            }

            const { data: allScores, error: scoreError } = await query;
            if (scoreError) throw scoreError;

            if (allScores && allScores.length > 0) {
                showToast("全班成績查詢成功！");
                displayAdminScores(allScores);
            } else {
                showToast(subject === "all" ? "目前資料庫無成績" : `目前沒有【${subject}】的成績`);
                document.getElementById("score-results").innerHTML = 
                    `<p style="text-align: center; color: rgba(255,255,255,0.7);">
                        ${subject === "all" ? "目前尚無成績紀錄。" : `目前尚無【${subject}】的成績紀錄。`}
                    </p>`;
            }
            
            return; 
        }

        const { data: userData, error: userError } = await supabaseClient
            .from('students')
            .select('student_id') 
            .eq('student_id', inputAccount)
            .eq('password', password);

        if (userError) throw userError;

        if (!userData || userData.length === 0) {
            showToast("驗證失敗，請檢查帳號或密碼！");
            document.getElementById("score-results").innerHTML = 
                '<p style="text-align: center; color: #ff6b6b;">驗證失敗，請確認資料輸入正確。</p>';
            return; 
        }

        let query = supabaseClient
            .from('scores')
            .select('semester, subject, range, score')
            .eq('student_id', inputAccount);

        if (subject !== "all") {
            query = query.eq('subject', subject);
        }

        const { data: scoreData, error: studentScoreError } = await query;
        if (studentScoreError) throw studentScoreError;

        if (scoreData && scoreData.length > 0) {
            showToast("查詢成功！");
            displayScores(scoreData);
        } else {
            showToast(subject === "all" ? "目前還沒有你的成績紀錄" : `目前沒有【${subject}】的成績紀錄`);
            document.getElementById("score-results").innerHTML = 
                `<p style="text-align: center; color: rgba(255,255,255,0.7);">
                    ${subject === "all" ? "目前尚無成績紀錄。" : `目前尚無【${subject}】的成績紀錄。`}
                </p>`;
        }

    } catch (err) {
        console.error("執行發生錯誤:", err.message);
        showToast("伺服器連線失敗...QAQ");
    }
}

function displayScores(scores) {
    const resultContainer = document.getElementById("score-results");
    if (!resultContainer) return;

    let html = `
        <table class="score-table">
            <thead>
                <tr>
                    <th>學期</th>
                    <th>科目</th>
                    <th>範圍</th>
                    <th>分數</th>
                </tr>
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
        </table>
    `;
    
    resultContainer.innerHTML = html;
}

const queryBtn = document.getElementById("query-btn");
if (queryBtn) {
    queryBtn.addEventListener("click", handleQueryGrade);
}

function displayAdminScores(scores) {
    const resultContainer = document.getElementById("admin-results");
    if (!resultContainer) return;

    let html = `
        <table class="score-table">
            <thead>
                <tr>
                    <th>學號</th>
                    <th>學期</th>
                    <th>科目</th>
                    <th>範圍</th>
                    <th>分數</th>
                </tr>
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
        </table>
    `;
    
    resultContainer.innerHTML = html;
}