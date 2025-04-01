
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePosts, Post, ReactionType } from "@/hooks/usePosts";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import ReactionButton from "./ReactionButton";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { isAuthenticated } = useAuth();
  const { votePost, addReaction, getUserVoteAndReaction } = usePosts();
  const { vote: userVote, reaction: userReaction } = getUserVoteAndReaction(post.id);

  const handleVote = (voteType: "upvote" | "downvote") => {
    if (!isAuthenticated) return;
    votePost(post.id, voteType);
  };

  const handleReaction = (reactionType: ReactionType) => {
    if (!isAuthenticated) return;
    addReaction(post.id, reactionType);
  };

  // Format the time
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <Card className="mb-4 overflow-hidden animated-card">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <span className="font-mono text-xs font-medium text-primary">{post.userId.substring(0, 6)}</span>
          </div>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-3">
        <p className="whitespace-pre-line">{post.content}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${userVote === "upvote" ? "text-primary bg-primary/10" : ""}`}
            onClick={() => handleVote("upvote")}
            disabled={!isAuthenticated}
          >
            <ThumbsUp size={16} className="mr-1" />
            <span>{post.upvotes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${userVote === "downvote" ? "text-destructive bg-destructive/10" : ""}`}
            onClick={() => handleVote("downvote")}
            disabled={!isAuthenticated}
          >
            <ThumbsDown size={16} className="mr-1" />
            <span>{post.downvotes}</span>
          </Button>
        </div>
        
        <ReactionButton 
          postId={post.id}
          reactions={post.reactions}
          selectedReaction={userReaction}
          onReact={handleReaction}
        />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
