import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function Blog() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getArticles = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*");

      if (!error) {
        setArticles(data);
      }
    };

    getArticles();
  }, []);

  return (
    <div>
      {articles.map((article) => (
        <h2 key={article.id}>{article.title}</h2>
      ))}
    </div>
  );
}

export default Blog;