
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  reactions: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
}

export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

// Initial mock posts
const initialPosts: Post[] = [
  {
    id: "1",
    userId: "anon123",
    content: "Just discovered this platform. Love the anonymity!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    upvotes: 15,
    downvotes: 2,
    reactions: { like: 5, love: 3, haha: 0, wow: 1, sad: 0, angry: 0 },
  },
  {
    id: "2",
    userId: "anon456",
    content: "Freedom of expression without judgment. Finally a place where thoughts matter more than identity.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    upvotes: 8,
    downvotes: 1,
    reactions: { like: 2, love: 4, haha: 0, wow: 0, sad: 0, angry: 0 },
  },
  {
    id: "3",
    userId: "anon789",
    content: "Is anyone else concerned about the state of privacy online? Even with anonymity, how secure are we really?",
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    upvotes: 4,
    downvotes: 0,
    reactions: { like: 1, love: 0, haha: 0, wow: 2, sad: 1, angry: 0 },
  },
];

// Create a singleton store to ensure all component instances access the same data
let globalPosts: Post[] = [];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(globalPosts);
  const [isLoading, setIsLoading] = useState(true);
  const [lastPostTime, setLastPostTime] = useState<Date | null>(null);
  
  // Subscribe to changes
  useEffect(() => {
    const updatePosts = () => {
      setPosts([...globalPosts]);
    };
    
    listeners.push(updatePosts);
    
    return () => {
      listeners = listeners.filter(l => l !== updatePosts);
    };
  }, []);
  
  // Initial load
  useEffect(() => {
    if (globalPosts.length === 0) {
      // Load posts from localStorage or use initial posts if none exist
      const storedPosts = localStorage.getItem("anonPosts");
      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts);
        // Convert string dates back to Date objects
        const postsWithDates = parsedPosts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
        }));
        globalPosts = postsWithDates;
      } else {
        globalPosts = initialPosts;
        localStorage.setItem("anonPosts", JSON.stringify(initialPosts));
      }
      setPosts([...globalPosts]);
    }
    
    setIsLoading(false);
    
    // Check for last post time for the current user
    if (user) {
      const userLastPostTime = localStorage.getItem(`lastPost_${user.id}`);
      if (userLastPostTime) {
        setLastPostTime(new Date(userLastPostTime));
      }
    }
  }, [user]);

  const addPost = (content: string) => {
    if (!user) return;
    
    // Check for cooldown (69 seconds)
    const now = new Date();
    if (lastPostTime && now.getTime() - lastPostTime.getTime() < 69000) {
      const remainingTime = Math.ceil((69000 - (now.getTime() - lastPostTime.getTime())) / 1000);
      throw new Error(`Please wait ${remainingTime} seconds before posting again.`);
    }
    
    const newPost: Post = {
      id: crypto.randomUUID(),
      userId: user.id,
      content,
      createdAt: now,
      upvotes: 0,
      downvotes: 0,
      reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
    };
    
    globalPosts = [newPost, ...globalPosts];
    
    // Save to localStorage
    localStorage.setItem("anonPosts", JSON.stringify(globalPosts));
    localStorage.setItem(`lastPost_${user.id}`, now.toISOString());
    
    setLastPostTime(now);
    notifyListeners();
    
    return newPost;
  };

  const deletePost = (postId: string) => {
    globalPosts = globalPosts.filter(post => post.id !== postId);
    localStorage.setItem("anonPosts", JSON.stringify(globalPosts));
    notifyListeners();
  };

  const votePost = (postId: string, voteType: "upvote" | "downvote") => {
    if (!user) return;
    
    const postIndex = globalPosts.findIndex(post => post.id === postId);
    if (postIndex === -1) return;
    
    // Check if user already voted (in a real app, this would be tracked properly)
    const voteKey = `vote_${user.id}_${postId}`;
    const existingVote = localStorage.getItem(voteKey);
    
    const post = { ...globalPosts[postIndex] };
    
    // If user already voted the same way, remove the vote
    if (existingVote === voteType) {
      if (voteType === "upvote") {
        post.upvotes = Math.max(0, post.upvotes - 1);
      } else {
        post.downvotes = Math.max(0, post.downvotes - 1);
      }
      localStorage.removeItem(voteKey);
    }
    // If user voted the opposite way, switch the vote
    else if (existingVote) {
      if (voteType === "upvote") {
        post.upvotes += 1;
        post.downvotes = Math.max(0, post.downvotes - 1);
      } else {
        post.downvotes += 1;
        post.upvotes = Math.max(0, post.upvotes - 1);
      }
      localStorage.setItem(voteKey, voteType);
    }
    // If user hasn't voted yet, add the vote
    else {
      if (voteType === "upvote") {
        post.upvotes += 1;
      } else {
        post.downvotes += 1;
      }
      localStorage.setItem(voteKey, voteType);
    }
    
    globalPosts[postIndex] = post;
    localStorage.setItem("anonPosts", JSON.stringify(globalPosts));
    notifyListeners();
  };

  const addReaction = (postId: string, reaction: ReactionType) => {
    if (!user) return;
    
    const postIndex = globalPosts.findIndex(post => post.id === postId);
    if (postIndex === -1) return;
    
    // Check if user already reacted
    const reactionKey = `reaction_${user.id}_${postId}`;
    const existingReaction = localStorage.getItem(reactionKey);
    
    const post = { ...globalPosts[postIndex] };
    const reactions = { ...post.reactions };
    
    // If user already reacted the same way, remove the reaction
    if (existingReaction === reaction) {
      reactions[reaction] = Math.max(0, reactions[reaction] - 1);
      localStorage.removeItem(reactionKey);
    }
    // If user reacted differently before, change the reaction
    else if (existingReaction) {
      reactions[existingReaction as ReactionType] = Math.max(0, reactions[existingReaction as ReactionType] - 1);
      reactions[reaction] += 1;
      localStorage.setItem(reactionKey, reaction);
    }
    // If user hasn't reacted yet, add the reaction
    else {
      reactions[reaction] += 1;
      localStorage.setItem(reactionKey, reaction);
    }
    
    post.reactions = reactions;
    globalPosts[postIndex] = post;
    localStorage.setItem("anonPosts", JSON.stringify(globalPosts));
    notifyListeners();
  };

  const getUserVoteAndReaction = (postId: string) => {
    if (!user) return { vote: null, reaction: null };
    
    const voteKey = `vote_${user.id}_${postId}`;
    const reactionKey = `reaction_${user.id}_${postId}`;
    
    return {
      vote: localStorage.getItem(voteKey) as "upvote" | "downvote" | null,
      reaction: localStorage.getItem(reactionKey) as ReactionType | null,
    };
  };

  return {
    posts,
    isLoading,
    addPost,
    deletePost,
    votePost,
    addReaction,
    getUserVoteAndReaction,
    cooldownRemaining: lastPostTime 
      ? Math.max(0, 69 - Math.floor((Date.now() - lastPostTime.getTime()) / 1000)) 
      : 0,
  };
};
