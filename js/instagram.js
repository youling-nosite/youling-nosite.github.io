const { useState } = React;

// --- 1. 內建 SVG 圖示元件 ---
const Heart = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill={className?.includes('fill-red') ? "currentColor" : "none"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);
const MessageCircle = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);
const Send = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);
const Bookmark = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);
const MoreHorizontal = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
);
const Home = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);
const Search = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const PlusSquare = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);
const Video = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
);
const Plus = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

// --- 2. 初始假資料 ---
const storiesData = [
    { id: 1, username: 'user_1', avatar: '[https://i.pravatar.cc/150?img=32](https://i.pravatar.cc/150?img=32)' },
    { id: 2, username: 'user_2', avatar: '[https://i.pravatar.cc/150?img=12](https://i.pravatar.cc/150?img=12)' },
    { id: 3, username: 'user_3', avatar: '[https://i.pravatar.cc/150?img=5](https://i.pravatar.cc/150?img=5)' },
    { id: 4, username: 'user_4', avatar: '[https://i.pravatar.cc/150?img=20](https://i.pravatar.cc/150?img=20)' }
];

const initialPosts = [
    {
        id: 1,
        author: 'chiulin_art',
        avatar: '[https://i.pravatar.cc/150?img=47](https://i.pravatar.cc/150?img=47)',
        image: 'post0.jpg',
        likes: 128,
        isLiked: false,
        caption: `好久沒好好畫了~\n貓看著的時候,好像整個人都變得柔軟了\n那表情連貓都看穿了૮꒰˶ฅ́˘ฅ̀˶꒱ა\n\n（今天要畫的時候訊息一直來 ヽ(#\`Д´)ノ`,
        date: '7月23日',
        comments: [
            { username: 'art_lover99', text: '貓咪的眼神畫得太棒了吧！😍' }
        ]
    },
    {
        id: 2,
        author: 'qingyu_1031',
        avatar: '[https://i.pravatar.cc/150?img=33](https://i.pravatar.cc/150?img=33)',
        image: 'post1.jpg',
        likes: 256,
        isLiked: false,
        caption: `10/31\n-\n-\n-\n我想自己發一個啦啦啦`,
        date: '11月1日',
        comments: []
    },
    {
        id: 3,
        author: 'chiulin_art',
        avatar: '[https://i.pravatar.cc/150?img=47](https://i.pravatar.cc/150?img=47)',
        image: 'post2.jpg',
        likes: 184,
        isLiked: false,
        caption: `想畫點帥帥的地雷系（？）\n結果不小心畫太順(σ°∀°)σ\n黑色好好塗,表情也意外地對味\n避難所就這樣\n多了一個不太好惹的傢伙ت\n\n（gpt說整體有一種「安靜但會咬人」的帥感🤣`,
        date: '7月31日',
        comments: [
            { username: 'anime_fan', text: '真的有一種很酷的氣質！' },
            { username: 'draw_daily', text: '黑色的層次處理得好好' }
        ]
    }
];

// --- 3. 單篇貼文元件 ---
const Post = ({ post, onLike, onComment }) => {
    const [commentText, setCommentText] = useState('');
    const [isLiking, setIsLiking] = useState(false);

    const handleLikeClick = () => {
        setIsLiking(true);
        onLike(post.id);
        setTimeout(() => setIsLiking(false), 200); 
    };

    const handleDoubleTap = (e) => {
        if (!post.isLiked) {
            handleLikeClick();
        }
    };

    const submitComment = () => {
        if (commentText.trim()) {
            onComment(post.id, commentText);
            setCommentText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            submitComment();
        }
    };

    return (
        <article className="mb-4 border-b border-gray-200 pb-2 bg-white">
            <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center">
                    <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[2px] rounded-full mr-2">
                        <div className="bg-white p-[2px] rounded-full">
                            <img src={post.avatar} alt="頭像" className="w-8 h-8 rounded-full object-cover" />
                        </div>
                    </div>
                    <span className="font-semibold text-sm">{post.author}</span>
                </div>
                <MoreHorizontal className="text-gray-900 w-5 h-5 cursor-pointer" />
            </div>

            <div className="relative w-full bg-gray-50 select-none cursor-pointer" onDoubleClick={handleDoubleTap}>
                <img 
                    src={post.image} 
                    alt="貼文圖片" 
                    className="w-full h-auto object-cover max-h-[600px]" 
                    onError={(e) => { e.target.src = '[https://via.placeholder.com/400x500?text=圖片載入失敗](https://via.placeholder.com/400x500?text=圖片載入失敗)'; }}
                />
            </div>

            <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center space-x-4">
                    <button onClick={handleLikeClick} className={`transition-transform ${isLiking ? 'scale-125' : 'scale-100'}`}>
                        <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
                    </button>
                    <button><MessageCircle className="w-6 h-6 text-gray-900" /></button>
                    <button><Send className="w-6 h-6 text-gray-900" /></button>
                </div>
                <button><Bookmark className="w-6 h-6 text-gray-900" /></button>
            </div>

            <div className="px-3 text-sm font-semibold mb-1">
                {post.likes.toLocaleString()} 個讚
            </div>

            <div className="px-3 text-sm mb-1">
                <span className="font-semibold mr-2">{post.author}</span>
                <span className="whitespace-pre-wrap">{post.caption}</span>
            </div>

            {post.comments.length > 0 && (
                <div className="px-3 mt-2 mb-1">
                    {post.comments.map((comment, index) => (
                        <div key={index} className="text-sm mb-1">
                            <span className="font-semibold mr-2">{comment.username}</span>
                            <span>{comment.text}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="px-3 text-[10px] text-gray-500 uppercase mt-2 mb-3 tracking-wide">
                {post.date}
            </div>

            <div className="flex items-center px-3 py-2 border-t border-gray-100">
                <img src="[https://i.pravatar.cc/150?img=11](https://i.pravatar.cc/150?img=11)" alt="我的頭像" className="w-7 h-7 rounded-full object-cover mr-3 flex-shrink-0" />
                <input
                    type="text"
                    placeholder="新增留言..."
                    className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button
                    className={`text-sm font-semibold ml-2 transition-colors ${commentText.trim() ? 'text-blue-500' : 'text-blue-200'}`}
                    disabled={!commentText.trim()}
                    onClick={submitComment}
                >
                    發佈
                </button>
            </div>
        </article>
    );
};

// --- 4. 主應用程式元件 ---
const App = () => {
    const [posts, setPosts] = useState(initialPosts);

    const handleLike = (postId) => {
        setPosts(currentPosts => 
            currentPosts.map(post => {
                if (post.id === postId) {
                    const isCurrentlyLiked = post.isLiked;
                    return {
                        ...post,
                        isLiked: !isCurrentlyLiked,
                        likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1
                    };
                }
                return post;
            })
        );
    };

    const handleComment = (postId, text) => {
        setPosts(currentPosts => 
            currentPosts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: [...post.comments, { username: 'my_account', text: text }]
                    };
                }
                return post;
            })
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center font-sans">
            <div className="w-full max-w-[414px] bg-white h-full min-h-screen relative shadow-sm flex flex-col pb-12 border-x border-gray-200">
                
                <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                    <div className="font-serif italic text-2xl font-bold tracking-tight pt-1">
                        Instagram
                    </div>
                    <div className="flex space-x-4">
                        <Heart className="w-6 h-6 text-gray-900 cursor-pointer" />
                        <MessageCircle className="w-6 h-6 text-gray-900 cursor-pointer" />
                    </div>
                </header>

                <div className="border-b border-gray-200 py-3 px-2 flex space-x-4 overflow-x-auto scrollbar-hide bg-white">
                    <div className="flex flex-col items-center space-y-1 ml-2">
                        <div className="relative cursor-pointer">
                            <img src="[https://i.pravatar.cc/150?img=11](https://i.pravatar.cc/150?img=11)" alt="我的限時動態" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center w-5 h-5">
                                <Plus className="w-3 h-3 text-white stroke-[3]" />
                            </div>
                        </div>
                        <span className="text-xs text-gray-600">你的限時動態</span>
                    </div>
                    {storiesData.map((story) => (
                        <div key={story.id} className="flex flex-col items-center space-y-1 cursor-pointer">
                            <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[2px] rounded-full">
                                <div className="bg-white p-[2px] rounded-full">
                                    <img src={story.avatar} alt={story.username} className="w-[58px] h-[58px] rounded-full object-cover" />
                                </div>
                            </div>
                            <span className="text-xs text-gray-600">{story.username}</span>
                        </div>
                    ))}
                </div>

                <main className="flex-1 overflow-y-auto bg-gray-100">
                    {posts.map(post => (
                        <Post key={post.id} post={post} onLike={handleLike} onComment={handleComment} />
                    ))}
                    
                    <div className="h-10 text-center text-gray-400 py-4 text-sm font-medium bg-gray-100">
                        ✔ 你已經看完全部貼文
                    </div>
                </main>

                <nav className="fixed bottom-0 w-full max-w-[414px] bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
                    <Home className="w-6 h-6 text-gray-900 cursor-pointer" />
                    <Search className="w-6 h-6 text-gray-900 cursor-pointer" />
                    <PlusSquare className="w-6 h-6 text-gray-900 cursor-pointer" />
                    <Video className="w-6 h-6 text-gray-900 cursor-pointer" />
                    <img src="[https://i.pravatar.cc/150?img=11](https://i.pravatar.cc/150?img=11)" alt="個人檔案" className="w-7 h-7 rounded-full object-cover border border-gray-300 p-[1px] cursor-pointer" />
                </nav>
                
            </div>
        </div>
    );
};

// --- 5. 渲染應用程式 ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
