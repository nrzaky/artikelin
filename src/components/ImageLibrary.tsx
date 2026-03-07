import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  onSelect: (url: string) => void;
};

const ImageLibrary = ({ onSelect }: Props) => {

  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {

    const loadImages = async () => {

      const { data } = await supabase.storage
        .from("articles")
        .list();

      setImages(data || []);

    };

    loadImages();

  }, []);

  return (

    <div className="grid grid-cols-3 gap-3 mt-4">

      {images.map(img => {

        const url = supabase.storage
          .from("articles")
          .getPublicUrl(img.name).data.publicUrl;

        return (

          <img
            key={img.name}
            src={url}
            className="cursor-pointer rounded-md border hover:opacity-80"
            onClick={() => onSelect(url)}
          />

        );

      })}

    </div>

  );

};

export default ImageLibrary;