import { useState } from "react";
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
import { Pencil, Loader2 } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";

interface EditPostProps {
  post: {
    id: number;
    title: string;
    description: string;
  };
  onPostUpdated: () => void;
}

export function EditPost({ post, onPostUpdated }: EditPostProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/posts/${post.id}`, {
        title,
        description,
      });
      setOpen(false);
      onPostUpdated();
      toast({
        title: "📝 Post Updated",
        description: "Your changes have been saved successfully.",
        className: "bg-white/[0.03] border-white/10 backdrop-blur-xl text-white rounded-2xl shadow-2xl py-6 px-6",
      });
    } catch (error: any) {
      console.error("Failed to update post", error);
      toast({
        title: "❌ Error",
        description: error.response?.data?.message || "Failed to update post.",
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
        <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all">
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-2xl shadow-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-purple-500/[0.05] pointer-events-none rounded-2xl" />
        <DialogHeader className="pt-6 px-2">
          <DialogTitle className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Edit Post
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-base">
            Modify your post details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-8 py-6 px-2">
          <div className="grid gap-3">
            <Label htmlFor="edit-title" className="text-sm font-semibold text-slate-200 ml-1">
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12 bg-white/[0.03] border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl transition-all"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="edit-description" className="text-sm font-semibold text-slate-200 ml-1">
              Content
            </Label>
            <Textarea
              id="edit-description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-white/[0.03] border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl transition-all resize-none py-4"
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
                  <span>Updating...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
