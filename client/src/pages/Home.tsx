import { useState, useEffect } from "react";
import api from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CreatePost } from "@/components/posts/CreatePost";
import { EditPost } from "@/components/posts/EditPost";
import { useToast } from "@/components/hooks/use-toast";

interface Post {
  id: number;
  title: string;
  description: string;
  user: { id: number; name: string };
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user: currentUser } = useAuth();
  const { toast } = useToast();

  const handleSoon = () => {
    toast({
      title: "✨ Coming Soon",
      description: "We're working hard on this feature. Stay tuned!",
      className: "bg-white/[0.03] border-white/10 backdrop-blur-xl text-white rounded-2xl shadow-2xl py-6 px-6",
    });
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      // Fallback to mock data for demonstration
      setPosts([
        { id: 1, title: "Welcome to BriefNest", description: "This is the first post on the platform!", user: { id: 1, name: "admin" }, createdAt: new Date().toISOString() },
        { id: 2, title: "Modern Web Design", description: "Exploring the beauty of Northern Lights theme and Shadcn UI.", user: { id: 2, name: "jules" }, createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      fetchPosts();
      toast({
        title: "🗑️ Post Deleted",
        description: "Your post has been removed successfully.",
        className: "bg-white/[0.03] border-white/10 backdrop-blur-xl text-white rounded-2xl shadow-2xl py-6 px-6",
      });
    } catch (error) {
      console.error("Failed to delete post", error);
      toast({
        title: "❌ Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
        className: "rounded-2xl py-6 px-6 shadow-2xl",
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main id="main-content" className="container max-w-4xl py-12 px-4 outline-none" tabIndex={-1}>
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Feed
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Explore the latest thoughts from the BriefNest community.
          </p>
        </div>
        {isAuthenticated && <CreatePost onPostCreated={fetchPosts} />}
      </header>

      <div className="grid gap-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
            <p className="text-slate-400 font-medium animate-pulse">Loading amazing stories...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-transparent py-20">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <p className="text-slate-400 text-lg">No posts yet. Be the first to share something!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card 
              key={post.id} 
              className="group border-white/10 bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-sm transition-all duration-500 rounded-2xl overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {post.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold group-hover:text-cyan-400 transition-colors">
                        {post.title}
                      </CardTitle>
                      <p className="text-xs text-slate-500 font-medium">
                        Posted by <span className="text-slate-300">@{post.user.name}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{post.description}</p>
              </CardContent>
              <CardFooter className="border-t border-white/5 pt-4 flex items-center justify-between">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSoon}
                    className="gap-2 hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Heart className="w-4 h-4" />
                    Like
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSoon}
                    className="gap-2 hover:text-cyan-400 hover:bg-cyan-400/10"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Comment
                  </Button>
                </div>

                {currentUser && currentUser.id === post.user.id && (
                  <div className="flex gap-2">
                    <EditPost post={post} onPostUpdated={fetchPosts} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
