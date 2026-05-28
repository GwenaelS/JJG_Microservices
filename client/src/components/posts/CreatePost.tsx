import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";

interface CreatePostProps {
  onPostCreated: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await api.post("/posts", {
        title,
        description,
        userId: Number(user.id),
      });
      setTitle("");
      setDescription("");
      setOpen(false);
      onPostCreated();
      toast({
        title: "🚀 Post Created",
        description: "Your thought has been shared with the world!",
        className: "bg-white/[0.03] border-white/10 backdrop-blur-xl text-white rounded-2xl shadow-2xl py-6 px-6",
      });
    } catch (error: any) {
      console.error("Failed to create post", error);
      const message = error.response?.data?.message;
      toast({
        title: "❌ Error",
        description: Array.isArray(message) ? message.join(", ") : message || "Failed to create post.",
        variant: "destructive",
        className: "rounded-2xl py-6 px-6 shadow-2xl",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black hover:bg-slate-200 font-bold px-6 rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-2xl shadow-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-purple-500/[0.05] pointer-events-none rounded-2xl" />
        <DialogHeader className="pt-6 px-2">
          <DialogTitle className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Create Post
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-base">
            Share your thoughts with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-8 py-6 px-2">
          <div className="grid gap-3">
            <Label htmlFor="title" className="text-sm font-semibold text-slate-200 ml-1">
              Title
            </Label>
            <Input
              id="title"
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12 bg-white/[0.03] border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-200 ml-1">
              Content
            </Label>
            <Textarea
              id="description"
              placeholder="Tell us more about it..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-white/[0.03] border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl transition-all placeholder:text-slate-600 resize-none py-4"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-bold bg-white text-black hover:bg-slate-200 transition-all duration-300 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Publishing...</span>
                </div>
              ) : (
                "Post Now"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
