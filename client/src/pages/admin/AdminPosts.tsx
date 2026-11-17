import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Post, InsertPost } from "@shared/schema";
import { insertPostSchema } from "@shared/schema";
import { IMAGE_ACCEPT, uploadImage } from "@/lib/uploadImage";
import AdminBackButton from "@/components/AdminBackButton";


export default function AdminPosts() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

  const form = useForm<InsertPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "Novosti",
      imageSrc: "",
      publishedAt: new Date(),
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Potrebna prijava",
        description: "Prijavite se za pristup ovoj stranici",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  useEffect(() => {
    if (editingPost) {
      form.reset({
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        category: editingPost.category,
        imageSrc: editingPost.imageSrc || "",
        publishedAt: new Date(editingPost.publishedAt),
      });
    } else {
      form.reset({
        title: "",
        excerpt: "",
        content: "",
        category: "Novosti",
        imageSrc: "",
        publishedAt: new Date(),
      });
    }
  }, [editingPost, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      return await apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Spremljeno",
        description: "Vijest je objavljena",
      });
      setIsDialogOpen(false);
      setEditingPost(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sesija je istekla",
          description: "Prijavite se ponovno.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({
          title: "Greška",
          description: "Vijest nije spremljena",
          variant: "destructive",
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertPost> }) => {
      return await apiRequest("PATCH", `/api/posts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Spremljeno",
        description: "Promjene su spremljene",
      });
      setIsDialogOpen(false);
      setEditingPost(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sesija je istekla",
          description: "Prijavite se ponovno.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({
          title: "Greška",
          description: "Promjene nisu spremljene",
          variant: "destructive",
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Spremljeno",
        description: "Vijest je obrisana",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sesija je istekla",
          description: "Prijavite se ponovno.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({
          title: "Greška",
          description: "Vijest nije obrisana",
          variant: "destructive",
        });
      }
    },
  });

  const handleUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      return await uploadImage(file);
    } catch (error) {
      toast({ title: "Greška", description: (error as Error).message, variant: "destructive" });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data: InsertPost) => {
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Jeste li sigurni da želite obrisati ovu vijest?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenDialog = () => {
    setEditingPost(null);
    setIsDialogOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Učitavanje...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdminBackButton />
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Vijesti</h1>
            <p className="text-muted-foreground">Pisanje i uređivanje vijesti</p>
          </div>
          <Button onClick={handleOpenDialog} data-testid="button-create-post">
            <Plus className="mr-2 h-4 w-4" />
            Nova vijest
          </Button>
        </div>

        {postsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Učitavanje vijesti...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <Card key={post.id} data-testid={`card-post-${post.id}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <div className="flex-1">
                    <CardTitle className="text-xl" data-testid={`text-post-title-${post.id}`}>
                      {post.title}
                    </CardTitle>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span data-testid={`text-post-category-${post.id}`}>{post.category}</span>
                      <span data-testid={`text-post-date-${post.id}`}>
                        {new Date(post.publishedAt).toLocaleDateString("hr-HR")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(post)}
                      data-testid={`button-edit-post-${post.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                      data-testid={`button-delete-post-${post.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground" data-testid={`text-post-excerpt-${post.id}`}>
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Još nema vijesti. Napišite prvu!</p>
            </CardContent>
          </Card>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-post-form">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Uredi vijest" : "Nova vijest"}</DialogTitle>
              <DialogDescription>
                {editingPost ? "Izmijenite podatke vijesti" : "Ispunite podatke za novu vijest"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naslov</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-post-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sažetak</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} data-testid="input-post-excerpt" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tekst</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={6} data-testid="input-post-content" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategorija</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-post-category">
                            <SelectValue placeholder="Odaberite kategoriju" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Prva ekipa">Prva ekipa</SelectItem>
                          <SelectItem value="U15">U15</SelectItem>
                          <SelectItem value="U13">U13</SelectItem>
                          <SelectItem value="Novosti">Novosti</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageSrc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fotografija</FormLabel>
                      {field.value && (
                        <div className="relative">
                          <img
                            src={field.value}
                            alt=""
                            className="w-full max-h-48 object-cover rounded-md border"
                            data-testid="img-post-preview"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="absolute top-2 right-2"
                            onClick={() => field.onChange("")}
                            data-testid="button-remove-image"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <FormControl>
                        <Input
                          type="file"
                          accept={IMAGE_ACCEPT}
                          disabled={isUploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (file) {
                              const url = await handleUpload(file);
                              if (url) field.onChange(url);
                            }
                          }}
                          data-testid="input-post-image-file"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        {isUploading ? "Učitavanje fotografije..." : "JPG, PNG, WebP ili GIF, najviše 5 MB."}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingPost(null);
                    }}
                    data-testid="button-cancel-post"
                  >
                    Odustani
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit-post"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Spremanje..."
                      : editingPost
                      ? "Spremi promjene"
                      : "Objavi"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
