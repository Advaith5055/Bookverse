import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  RefreshCw,
  Star,
  FileText,
  Target,
  Settings,
  LogOut,
  Edit,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  reading_goal: number;
  books_read: number;
  books_added: number;
  swaps_completed: number;
  reviews_written: number;
  member_since: string;
  followers_count: number;
  following_count: number;
}

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({
    full_name: "",
    username: "",
    bio: "",
    location: "",
    reading_goal: 12,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setEditData({
        full_name: data.full_name || "",
        username: data.username || "",
        bio: data.bio || "",
        location: data.location || "",
        reading_goal: data.reading_goal || 12,
      });
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(editData)
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-fade-in space-y-8">
            {/* Header Skeleton */}
            <Card className="card-premium">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="skeleton-pulse w-32 h-32 rounded-full bg-muted" />
                  <div className="flex-1 space-y-4">
                    <div className="skeleton-pulse h-8 w-48 bg-muted rounded" />
                    <div className="skeleton-pulse h-4 w-32 bg-muted rounded" />
                    <div className="skeleton-pulse h-20 w-full bg-muted rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="card-premium">
                  <CardContent className="p-6 space-y-2">
                    <div className="skeleton-pulse h-8 w-12 bg-muted rounded" />
                    <div className="skeleton-pulse h-4 w-24 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  const readingProgress = (profile.books_read / profile.reading_goal) * 100;
  const memberSinceDate = new Date(profile.member_since).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8 border-border">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-32 h-32 border-4 border-accent">
                  <AvatarImage src={profile.avatar_url || ""} />
                  <AvatarFallback className="text-3xl font-bold bg-accent text-accent-foreground">
                    {profile.full_name?.charAt(0) || profile.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 text-center md:text-left">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {memberSinceDate}</span>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-heading text-3xl font-bold text-foreground mb-1">
                      {profile.full_name || profile.username}
                    </h1>
                    <p className="text-muted-foreground">@{profile.username}</p>
                  </div>
                  <div className="flex gap-2">
                    {!editing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(true)}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(false)}
                          className="gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={saving}
                          className="gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {editing ? (
                  <div className="space-y-4 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={editData.full_name}
                          onChange={(e) =>
                            setEditData({ ...editData, full_name: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={editData.username}
                          onChange={(e) =>
                            setEditData({ ...editData, username: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editData.bio}
                        onChange={(e) =>
                          setEditData({ ...editData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={(e) =>
                          setEditData({ ...editData, location: e.target.value })
                        }
                        placeholder="City, Country"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reading_goal">Annual Reading Goal</Label>
                      <Input
                        id="reading_goal"
                        type="number"
                        value={editData.reading_goal}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            reading_goal: parseInt(e.target.value),
                          })
                        }
                        className="mt-1"
                        min="1"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {profile.bio && (
                      <p className="text-foreground mb-4">{profile.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {profile.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{user?.email}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
                  <div className="bg-accent/20 rounded-xl p-4 text-center">
                    <User className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{profile.followers_count}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="bg-accent/20 rounded-xl p-4 text-center">
                    <User className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{profile.following_count}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div className="bg-accent/20 rounded-xl p-4 text-center">
                    <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{profile.books_added}</p>
                    <p className="text-xs text-muted-foreground">Books</p>
                  </div>
                  <div className="bg-accent/20 rounded-xl p-4 text-center">
                    <RefreshCw className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{profile.swaps_completed}</p>
                    <p className="text-xs text-muted-foreground">Swaps</p>
                  </div>
                  <div className="bg-accent/20 rounded-xl p-4 text-center">
                    <Star className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{profile.reviews_written}</p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                  <div className="bg-accent/20 rounded-xl p-4 text-center">
                    <FileText className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{profile.books_read}</p>
                    <p className="text-xs text-muted-foreground">Read</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Goal Section */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {new Date().getFullYear()} Reading Goal
            </CardTitle>
            <CardDescription>
              Track your progress towards your annual reading goal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {profile.books_read} of {profile.reading_goal} books read
                </span>
                <span className="font-semibold text-foreground">
                  {Math.round(readingProgress)}%
                </span>
              </div>
              <Progress value={readingProgress} className="h-3" />
              {readingProgress >= 100 ? (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  🎉 Goal Completed!
                </Badge>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {profile.reading_goal - profile.books_read} more books to reach your goal
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="library">My Library</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions on BookVerse</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  No recent activity yet. Start adding books or join discussions!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>My Books</CardTitle>
                <CardDescription>Books you've added to BookVerse</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  You haven't added any books yet. 
                  <Button
                    variant="link"
                    onClick={() => navigate("/add-book")}
                    className="text-primary"
                  >
                    Add your first book
                  </Button>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="destructive"
                    onClick={handleSignOut}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
