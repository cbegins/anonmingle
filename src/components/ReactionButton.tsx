
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ReactionType } from "@/hooks/usePosts";
import { Smile } from "lucide-react";

type ReactionOption = {
  type: ReactionType;
  emoji: string;
  label: string;
};

const reactionOptions: ReactionOption[] = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "haha", emoji: "😂", label: "Haha" },
  { type: "wow", emoji: "😮", label: "Wow" },
  { type: "sad", emoji: "😢", label: "Sad" },
  { type: "angry", emoji: "😠", label: "Angry" },
];

interface ReactionButtonProps {
  postId: string;
  reactions: Record<ReactionType, number>;
  selectedReaction: ReactionType | null;
  onReact: (reaction: ReactionType) => void;
}

const ReactionButton = ({ postId, reactions, selectedReaction, onReact }: ReactionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animating, setAnimating] = useState<ReactionType | null>(null);
  
  // Get total reactions
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
  
  // Find the most common reaction
  let topReaction: ReactionOption | null = null;
  let maxCount = 0;
  
  Object.entries(reactions).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topReaction = reactionOptions.find(r => r.type === type) || null;
    }
  });
  
  const handleReact = (reactionType: ReactionType) => {
    setAnimating(reactionType);
    onReact(reactionType);
    
    // Reset animation after it completes
    setTimeout(() => {
      setAnimating(null);
    }, 600);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`reaction-button flex items-center gap-1 h-8 rounded-full ${selectedReaction ? 'text-primary' : ''}`}
          aria-label="React to post"
        >
          {selectedReaction ? (
            reactionOptions.find(r => r.type === selectedReaction)?.emoji
          ) : totalReactions > 0 && topReaction ? (
            topReaction.emoji
          ) : (
            <Smile size={16} />
          )}
          {totalReactions > 0 && (
            <span className="text-xs font-medium">{totalReactions}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1" align="start">
        <div className="flex gap-1">
          {reactionOptions.map((option) => (
            <Button
              key={option.type}
              variant="ghost"
              size="sm"
              className={`reaction-button px-3 py-2 rounded-full ${
                selectedReaction === option.type ? "bg-primary/10" : ""
              } ${animating === option.type ? "animate-reaction" : ""}`}
              onClick={() => {
                handleReact(option.type);
                setIsOpen(false);
              }}
            >
              <span className="text-xl" role="img" aria-label={option.label}>
                {option.emoji}
              </span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReactionButton;
