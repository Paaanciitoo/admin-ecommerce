"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [removingUrl, setRemovingUrl] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  const handleRemove = (url: string) => {
    setRemovingUrl(url);
    setTimeout(() => {
      onRemove(url);
      setRemovingUrl(null);
    }, 300);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
            style={
              removingUrl === url
                ? {
                    transform: "scale(0.5)",
                    opacity: 0,
                    transition:
                      "transform 0.3s ease-out, opacity 0.3s ease-out",
                  }
                : {}
            }
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => handleRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Imagen" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset="ph4fvemf">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
              className={`
                bg-blue-700 text-white
                transition-all duration-150 ease-in-out
                ${isPressed ? 'transform scale-95 bg-blue-800' : 'hover:bg-blue-600'}
              `}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Subir una imagen
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;