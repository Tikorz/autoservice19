import supabase, { isSupabaseConfigured } from "./supabaseClient";

export const STORAGE_BUCKET = "car-images";

// Upload ein Bild zu Supabase Storage
export async function uploadCarImage(
  file: File,
  carId?: string
): Promise<string | null> {
  // Prüfe ob Supabase konfiguriert ist
  if (!isSupabaseConfigured() || !supabase) {
    console.warn(
      "⚠️ Supabase Storage nicht verfügbar. Verwende URL-Upload stattdessen."
    );
    return null;
  }

  try {
    // Dateiname mit Timestamp und carId für Eindeutigkeit
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = carId
      ? `${carId}/${timestamp}.${fileExt}`
      : `temp/${timestamp}.${fileExt}`;

    // Upload zu Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    // Public URL generieren
    const { data: publicUrl } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

// Bild aus Storage löschen
export async function deleteCarImage(imageUrl: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return true; // Fallback: tue so als ob es funktioniert hat
  }

  try {
    // Dateipath aus URL extrahieren
    const fileName = imageUrl.split(`/${STORAGE_BUCKET}/`)[1];
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([fileName]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}

// Bilder zu neuem Auto-Ordner verschieben
export async function moveImagesToCarFolder(
  tempImages: string[],
  carId: string
): Promise<string[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return tempImages; // Fallback: gib Bilder unverändert zurück
  }

  const movedImages: string[] = [];

  for (const imageUrl of tempImages) {
    try {
      // Prüfe ob es ein temp-Bild ist
      if (!imageUrl.includes("/temp/")) {
        movedImages.push(imageUrl);
        continue;
      }

      // Extrahiere Dateiname
      const fileName = imageUrl.split("/temp/")[1];
      const oldPath = `temp/${fileName}`;
      const newPath = `${carId}/${fileName}`;

      // Verschiebe Datei
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .move(oldPath, newPath);

      if (error) {
        console.error("Move error:", error);
        movedImages.push(imageUrl); // Fallback: behalte alte URL
        continue;
      }

      // Neue URL generieren
      const { data: publicUrl } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(newPath);

      movedImages.push(publicUrl.publicUrl);
    } catch (error) {
      console.error("Move error:", error);
      movedImages.push(imageUrl); // Fallback
    }
  }

  return movedImages;
}

// Bildgröße validieren
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Dateigröße prüfen (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: "Datei zu groß (max. 5MB)" };
  }

  // Dateityp prüfen
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Nur Bilddateien erlaubt" };
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Nur JPEG, PNG und WebP Dateien erlaubt" };
  }

  return { valid: true };
}

// Bild komprimieren/resizen (optional)
export function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Proportionales Resizing
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Bild auf Canvas zeichnen
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Zu Blob konvertieren
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback: Original-Datei
          }
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
}
