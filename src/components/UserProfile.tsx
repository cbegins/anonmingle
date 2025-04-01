
import { useState } from "react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfile = ({ open, onOpenChange }: UserProfileProps) => {
  const { user, updateBio } = useAuth();
  const [bioText, setBioText] = useState(user?.bio || "");
  
  const handleSave = () => {
    updateBio(bioText);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Profile</DialogTitle>
          <DialogDescription>
            Your anonymous profile information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Anonymous ID</Label>
            <div className="flex">
              <Input readOnly value={user?.id || ""} className="font-mono" />
            </div>
            <p className="text-xs text-muted-foreground">This ID is unique to you but reveals nothing about your identity.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              maxLength={150}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              placeholder="Add a short bio (optional)"
            />
            <p className="text-xs text-muted-foreground">{bioText.length}/150 characters</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
