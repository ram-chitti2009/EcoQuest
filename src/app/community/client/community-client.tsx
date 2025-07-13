"use client"

import { useState } from "react"
import { Search, Heart, Share, Repeat, MessageCircle, Edit3 } from "lucide-react"

export default function CommunityClient() {
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [newPost, setNewPost] = useState("")
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null)
  // Type definitions
  type Comment = {
    id: number;
    author: string;
    text: string;
    time: string;
  };

  type Post = {
    id: number;
    author: string;
    title: string;
    subtitle: string;
    avatar: string;
    time: string;
    content: string;
    likes: number;
    shares: number;
    reposts: number;
    comments: Comment[];
    liked: boolean;
    shared: boolean;
    reposted: boolean;
    repostedBy?: string;
  };

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Janie Dotny",
      title: "1st gen",
      subtitle: "Engineering Mgmt | CTO",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "2h",
      content:
        "Hi All, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation velit velit ut...",
      likes: 12,
      shares: 3,
      reposts: 5,
      comments: [],
      liked: false,
      shared: false,
      reposted: false,
    },
    {
      id: 2,
      author: "Janie Dotny",
      title: "1st gen",
      subtitle: "Engineering Mgmt | CTO",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "4h",
      content:
        "Hi All, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation velit velit ut...",
      likes: 8,
      shares: 2,
      reposts: 3,
      comments: [],
      liked: false,
      shared: false,
      reposted: false,
    },
  ])

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const handleShare = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, shared: !post.shared, shares: post.shared ? post.shares - 1 : post.shares + 1 }
          : post,
      ),
    )
  }

  const handleRepost = (postId: number) => {
    setPosts((prevPosts) => {
      const originalPost = prevPosts.find((post) => post.id === postId);
      if (!originalPost) return prevPosts;

      // Only allow repost if not already reposted by current user
      if (originalPost.reposted) return prevPosts;

      // Mark original as reposted
      const updatedPosts = prevPosts.map((post) =>
        post.id === postId
          ? { ...post, reposted: true, reposts: post.reposts + 1 }
          : post
      );

      // Create reposted post
      const repostedPost = {
        ...originalPost,
        id: prevPosts.length + 1,
        reposted: false,
        reposts: 0,
        likes: 0,
        shared: false,
        liked: false,
        comments: [],
        author: originalPost.author,
        repostedBy: "James Doss",
        time: "now",
      };
      return [repostedPost, ...updatedPosts];
    });
  }

  const [commentInputs, setCommentInputs] = useState<{ [postId: number]: string }>({});

  const handleAddComment = (postId: number) => {
    setPosts(posts =>
      posts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: post.comments.length + 1,
                  author: "James Doss",
                  text: commentInputs[postId] || "",
                  time: "now",
                },
              ],
            }
          : post
      )
    );
    setCommentInputs(inputs => ({ ...inputs, [postId]: "" }));
  };

  const handleNewPost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: "James Doss",
        title: "Sr. Mgr of IT",
        subtitle: "Austin, TX, USA",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "now",
        content: newPost,
        likes: 0,
        shares: 0,
        reposts: 0,
        comments: [],
        liked: false,
        shared: false,
        reposted: false,
      };
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  // --- MAIN RENDER ---
  const filteredPosts = showLikedOnly
    ? posts.filter((post) => post.liked)
    : posts.filter(
        (post) =>
          post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto flex gap-6 p-4">
        {/* Left Sidebar */}
        <div className="w-80 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="h-16 bg-teal-700"></div>
            <div className="px-4 pb-4 -mt-8">
              <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-300 mb-3">
                <img
                  src="/placeholder.svg?height=64&width=64"
                  alt="James Doss"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h2 className="font-semibold text-lg text-gray-900">James Doss</h2>
              <p className="text-sm text-gray-600 mb-1">Sr. Mgr of IT</p>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span>📍 Austin, TX, USA</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>🎓 University of Texas at Austin</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Connections</span>
                <span className="text-sm font-semibold text-gray-900">XXX</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Views</span>
                <span className="text-sm font-semibold text-gray-900">XX</span>
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="space-y-3">
              <button
                type="button"
                className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded-xl transition-colors ${showLikedOnly ? 'bg-blue-100' : ''}`}
                onClick={() => setShowLikedOnly((prev) => !prev)}
                aria-pressed={showLikedOnly}
              >
                <Heart className={`w-4 h-4 ${showLikedOnly ? 'text-blue-600' : 'text-gray-600'}`} />
                <span className={`text-sm ${showLikedOnly ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>Liked Posts</span>
              </button>
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Reposts</span>
              </div>
            </div>
          </div>

          {/* Speak with Stats */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-600">Speak with Slate</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search a post or topic"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                aria-label="Search a post or topic"
                autoComplete="off"
              />
            </div>
          </div>

          {/* New Post */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="Your avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Begin typing new post..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                  rows={3}
                />
                {newPost && (
                  <button
                    onClick={handleNewPost}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
                  >
                    Post
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Posts */}
          {filteredPosts.map((post: Post) => (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-200 p-4">
              {post.repostedBy && (
                <div className="text-xs text-blue-700 font-semibold mb-2">Reposted by {post.repostedBy}</div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300">
                    <img
                      src={post.avatar || "/placeholder.svg"}
                      alt={post.author}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{post.author}</h3>
                      <span className="text-sm text-gray-500">• {post.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{post.title}</p>
                    <p className="text-xs text-gray-500">{post.subtitle}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors">
                  <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">+</span>
                  </span>
                  Add Connection
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">
                  {post.content}
                  <button className="text-blue-600 hover:underline ml-1">more</button>
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-colors ${
                    post.liked ? "text-red-600 bg-red-50" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`} />
                  <span className="text-sm">Like</span>
                  {post.likes > 0 && <span className="text-xs">({post.likes})</span>}
                </button>

                <button
                  onClick={() => handleShare(post.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-colors ${
                    post.shared ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Share className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                  {post.shares > 0 && <span className="text-xs">({post.shares})</span>}
                </button>

                <button
                  onClick={() => handleRepost(post.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-colors ${
                    post.reposted ? "text-green-600 bg-green-50" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                  <span className="text-sm">Repost</span>
                  {post.reposts > 0 && <span className="text-xs">({post.reposts})</span>}
                </button>

                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Comment</span>
                  {post.comments.length > 0 && <span className="text-xs">({post.comments.length})</span>}
                </button>
              </div>
              {activeCommentPostId === post.id && (
                <div className="w-full bg-white pt-2 pb-3 px-4 animate-dropdown">
                  <div className="border-t border-gray-200 mb-2"></div>
                  <div className="font-semibold text-gray-800 text-base mb-2">Comments</div>
                  <div className="max-h-56 overflow-y-auto">
                    {post.comments.length > 0 ? (
                      post.comments.map((comment: Comment) => (
                        <div key={comment.id} className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-b-0">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                            {comment.author.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 text-sm">{comment.author}</span>
                              <span className="text-xs text-gray-400">{comment.time}</span>
                            </div>
                            <div className="text-gray-800 text-sm ml-1 mt-0.5">{comment.text}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 mb-2 px-2">No comments yet.</div>
                    )}
                  </div>
                  <form className="flex items-center gap-2 bg-gray-100 rounded-xl p-4 mt-3" onSubmit={e => { e.preventDefault(); handleAddComment(post.id); }}>
                    <input
                      type="text"
                      value={commentInputs[post.id] || ""}
                      onChange={e => setCommentInputs(inputs => ({ ...inputs, [post.id]: e.target.value }))}
                      placeholder="Add a comment..."
                      className="flex-1 border-none bg-transparent outline-none px-2 py-1 text-black placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white rounded-2xl font-semibold shadow hover:bg-blue-700 transition-colors"
                      disabled={!commentInputs[post.id]}
                    >
                      Post
                    </button>
                  </form>
                </div>
              )}
              </div>
          ))}
        </div>
      </div>
    </div>
    );
}


