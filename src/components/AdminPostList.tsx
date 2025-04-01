
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Post } from "@/hooks/usePosts";
import { formatDistanceToNow } from "date-fns";

interface PostItemProps {
  post: Post;
  onDelete: (id: string) => void;
}

export const PostItem = ({ post, onDelete }: PostItemProps) => {
  // Format the time
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <Card className="overflow-hidden border-border/40">
      <CardContent className="p-4">
        <div className="flex justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <span className="font-mono text-xs font-medium text-primary">{post.userId.substring(0, 8)}</span>
            </div>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
        <p className="whitespace-pre-line">{post.content}</p>
        <div className="mt-2 flex gap-2 text-sm text-muted-foreground">
          <span>👍 {post.upvotes}</span>
          <span>👎 {post.downvotes}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-accent/30 p-2 flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(post.id)}
          className="h-8"
        >
          <Trash2 size={16} className="mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
