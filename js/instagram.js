import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Home, 
  Search, 
  PlusSquare, 
  Video, 
  UserCircle,
  Plus 
} from 'lucide-react';

// 限時動態假資料
const storiesData = [
  { id: 1, username: 'user_1', avatar: 'https://i.pravatar.cc/150?img=32' },
  { id: 2, username: 'user_2', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 3, username: 'user_3', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 4, username: 'user_4', avatar: 'https://i.pravatar.cc/150?img=20' }
];

// 初始貼文資料
const initialPosts = [
  {
    id: 1,
    author: 'mystake_417',
    avatar: 'https://i.pravatar.cc/150?img=47',
    image: 'post0.jpg',
    likes: 128,
    isLiked: false,
    caption: `好久沒好好畫了~\n貓看著的時候,好像整個人都變得柔軟了\n那表情連貓都看穿了૮꒰˶ฅ́˘ฅ̀˶꒱ა\n\n（今天要畫的時候訊息一直來 ヽ(#\`Д´)ノ`,
    date: '7月23日',
    comments: [
    ]
  },
  {
    id: 2,
    author: '999561love',
    avatar: 'https://i.pravatar.cc/150?img=33',
    image: 'post1.jpg',
    likes: 256,
    isLiked: false,
    caption: `10/31\n-\n-\n-\n我想自己發一個啦啦啦`,
    date: '11月1日',
    comments: [
        { username: 'yms__0201', text: '第一張傳給我，媽爺拍得真好' }
    ]
  },
  {
    id: 3,
    author: 'mystake_417',
    avatar: 'https://i.pravatar.cc/150?img=47',
    image: 'post2.jpg',
    likes: 184,
    isLiked: false,
    caption: `想畫點帥帥的地雷系（？）\n結果不小心畫太順(σ°∀°)σ\n黑色好好塗,表情也意外地對味\n避難所就這樣\n多了一個不太好惹的傢伙ت\n\n（gpt說整體有一種「安靜但會咬人」的帥感🤣`,
    date: '7月31日',
    comments: [
    ]
  }
];

// 單篇貼文組件
const Post = ({ post, onLike, onComment }) => {
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeClick = () => {
    setIsLiking(true);
    onLike(post.id);
    setTimeout(() => setIsLiking(false), 200); // 移除動畫class
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
    <article className="mb-4 border-b border-gray-200 pb-2">
      {/* 標頭：頭像與帳號 */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center">
          <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[2px] rounded-full mr-2">
            <div className="bg-white p-[2px] rounded-full">
              <img 
                src={post.avatar} 
                alt={`${post.author} 的頭像`} 
                className="w-7 h-7 rounded-full object-cover" 
              />
            </div>
          </div>
          <span className="font-semibold text-sm">{post.author}</span>
        </div>
        <MoreHorizontal className="text-gray-900 w-5 h-5 cursor-pointer" />
      </div>

      {/* 圖片區塊 (支援雙擊點讚) */}
      <div className="relative w-full bg-gray-50" onDoubleClick={handleDoubleTap}>
        <img 
          src={post.image} 
          alt="Post content" 
          className="w-full h-auto object-cover max-h-[600px]" 
        />
      </div>

      {/* 互動按鈕列 */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center space-x-4">
          <button onClick={handleLikeClick} className={`transition-transform ${isLiking ? 'scale-125' : 'scale-100'}`}>
            <Heart 
              className={`w-6 h-6 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} 
            />
          </button>
          <button>
            <MessageCircle className="w-6 h-6 text-gray-900" />
          </button>
          <button>
            <Send className="w-6 h-6 text-gray-900" />
          </button>
        </div>
        <button>
          <Bookmark className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* 讚數 */}
      <div className="px-3 text-sm font-semibold mb-1">
        {post.likes.toLocaleString()} 個讚
      </div>

      {/* 內文 */}
      <div className="px-3 text-sm mb-1">
        <span className="font-semibold mr-2">{post.author}</span>
        <span className="whitespace-pre-wrap">{post.caption}</span>
      </div>

      {/* 留言列表 */}
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

      {/* 發布時間 */}
      <div className="px-3 text-[10px] text-gray-500 uppercase mt-2 mb-3 tracking-wide">
        {post.date}
      </div>

      {/* 新增留言輸入框 */}
      <div className="flex items-center px-3 py-2 border-t border-gray-100">
        <img 
          src="https://i.pravatar.cc/150?img=11" 
          alt="我的頭像" 
          className="w-7 h-7 rounded-full object-cover mr-3 flex-shrink-0"
        />
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

// 主應用程式
export default function App() {
  const [posts, setPosts] = useState(initialPosts);

  // 處理點讚邏輯
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

  // 處理新增留言邏輯
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
      {/* 模擬手機螢幕寬度 */}
      <div className="w-full max-w-[414px] bg-white h-full min-h-screen relative shadow-sm flex flex-col pb-12 border-x border-gray-200">
        
        {/* 頂部導航列 */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
          <div className="font-serif italic text-2xl font-bold tracking-tight pt-1">
            Instagram
          </div>
          <div className="flex space-x-4">
            <Heart className="w-6 h-6 text-gray-900" />
            <MessageCircle className="w-6 h-6 text-gray-900" />
          </div>
        </header>

        {/* 限時動態區 (靜態展示) */}
        <div className="border-b border-gray-200 py-3 px-2 flex space-x-4 overflow-x-auto scrollbar-hide">
          <div className="flex flex-col items-center space-y-1 ml-2">
            <div className="relative">
              <img 
                src="https://i.pravatar.cc/150?img=11" 
                alt="我的限時動態" 
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center w-5 h-5">
                <Plus className="w-3 h-3 text-white stroke-[3]" />
              </div>
            </div>
            <span className="text-xs text-gray-600">你的限時動態</span>
          </div>
          {storiesData.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1">
              <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[2px] rounded-full">
                <div className="bg-white p-[2px] rounded-full">
                  <img 
                    src={story.avatar} 
                    alt={story.username} 
                    className="w-[58px] h-[58px] rounded-full object-cover" 
                  />
                </div>
              </div>
              <span className="text-xs text-gray-600">{story.username}</span>
            </div>
          ))}
        </div>

        {/* 貼文列表區 */}
        <main className="flex-1 overflow-y-auto">
          {posts.map(post => (
            <Post 
              key={post.id} 
              post={post} 
              onLike={handleLike} 
              onComment={handleComment} 
            />
          ))}
          
          {/* 底部留白，避免被導航列遮擋 */}
          <div className="h-10 text-center text-gray-400 py-4 text-sm font-medium">
            ✔ 你已經看完全部貼文
          </div>
        </main>

        {/* 底部導航列 */}
        <nav className="fixed bottom-0 w-full max-w-[414px] bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
          <Home className="w-6 h-6 text-gray-900" />
          <Search className="w-6 h-6 text-gray-900" />
          <PlusSquare className="w-6 h-6 text-gray-900" />
          <Video className="w-6 h-6 text-gray-900" />
          <img 
            src="https://i.pravatar.cc/150?img=11" 
            alt="個人檔案" 
            className="w-7 h-7 rounded-full object-cover border border-gray-300 p-[1px]"
          />
        </nav>
        
      </div>
    </div>
  );
}