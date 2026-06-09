import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articleService } from "@/services/article.service";

export const useArticles = (status?: "published" | "draft") => {
  return useQuery({
    queryKey: ["articles", status],
    queryFn: () => articleService.getArticles(status),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useArticle = (slug?: string) => {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => articleService.getArticleBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRelatedArticles = (slug?: string) => {
  return useQuery({
    queryKey: ["relatedArticles", slug],
    queryFn: () => articleService.getRelatedArticles(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchArticles = (searchQuery: string) => {
  return useQuery({
    queryKey: ["searchArticles", searchQuery],
    queryFn: () => articleService.searchArticles(searchQuery),
    enabled: !!searchQuery,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, image }: { id: number; image?: string }) => 
      articleService.deleteArticle(id, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};
