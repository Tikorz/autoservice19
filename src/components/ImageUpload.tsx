"use client";

import { useState, useRef, DragEvent, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus,
  X,
  Upload,
  ImageIcon,
  Link,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import {
  uploadCarImage,
  deleteCarImage,
  validateImageFile,
  compressImage,
} from "@/lib/storage";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  carId?: string;
  maxImages?: number;
}

export default function ImageUpload({
  images = [],
  onImagesChange,
  carId,
  maxImages = 10,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload
  const handleFileUpload = async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      setError(`Maximal ${maxImages} Bilder erlaubt`);
      return;
    }

    setIsUploading(true);
    setError("");
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validierung
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Ungültige Datei");
        continue;
      }

      try {
        // Progress update
        setUploadProgress((i / files.length) * 100);

        // Bild komprimieren
        const compressedFile = await compressImage(file);

        // Upload zu Supabase
        const url = await uploadCarImage(compressedFile, carId);

        if (url) {
          uploadedUrls.push(url);
        } else {
          setError(`Upload fehlgeschlagen für ${file.name}`);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setError(`Fehler beim Upload von ${file.name}`);
      }
    }

    if (uploadedUrls.length > 0) {
      onImagesChange([...images, ...uploadedUrls]);
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  // URL hinzufügen
  const addUrlImage = () => {
    const url = urlInput.trim();
    if (!url) return;

    if (images.includes(url)) {
      setError("Bild bereits hinzugefügt");
      return;
    }

    if (images.length >= maxImages) {
      setError(`Maximal ${maxImages} Bilder erlaubt`);
      return;
    }

    onImagesChange([...images, url]);
    setUrlInput("");
    setError("");
  };

  // Bild entfernen
  const removeImage = async (index: number) => {
    const imageUrl = images[index];

    // Versuche aus Storage zu löschen (nur bei Supabase URLs)
    if (imageUrl.includes("supabase")) {
      await deleteCarImage(imageUrl);
    }

    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  // Drag & Drop
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">
          Bilder ({images.length}/{maxImages})
        </Label>
        {error && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>

        {/* File Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
              ${isUploading ? "opacity-50" : "hover:border-gray-400"}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                <p className="text-sm text-gray-600">Upload läuft...</p>
                <Progress
                  value={uploadProgress}
                  className="w-full max-w-xs mx-auto"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <div>
                  <p className="text-sm font-medium">
                    Bilder hierher ziehen oder{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-blue-600"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      durchsuchen
                    </Button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG, PNG, WebP (max. 5MB pro Datei)
                  </p>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(e.target.files);
              }
            }}
          />
        </TabsContent>

        {/* URL Tab */}
        <TabsContent value="url" className="space-y-4">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setUrlInput(e.target.value)
              }
              placeholder="Bild-URL einfügen..."
              onKeyDown={(e: { key: string }) =>
                e.key === "Enter" && addUrlImage()
              }
            />
            <Button onClick={addUrlImage} disabled={!urlInput.trim()}>
              <Link className="h-4 w-4 mr-1" />
              Hinzufügen
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bildvorschau */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.length > 0 ? (
          images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img}
                alt={`Bild ${i + 1}`}
                className="w-full h-24 object-cover rounded border"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://via.placeholder.com/200x150?text=Nicht+verfügbar")
                }
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded flex items-center justify-center">
                <Button
                  size="sm"
                  variant="destructive"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(i)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                  Haupt
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-24 border-2 border-dashed rounded">
            <div className="text-center">
              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Noch keine Bilder</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
