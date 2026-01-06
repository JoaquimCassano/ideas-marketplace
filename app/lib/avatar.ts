import crypto from "crypto";

export function getGravatarUrl(email: string, size: number = 200): string {
  const hash = crypto
    .createHash("md5")
    .update(email.toLowerCase().trim())
    .digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

export function getUserAvatar(
  email: string,
  avatarBase64?: string | null
): string {
  if (avatarBase64) {
    return avatarBase64;
  }
  return getGravatarUrl(email);
}

export async function resizeImage(
  base64Image: string,
  maxWidth: number = 200,
  maxHeight: number = 200
): Promise<string> {
  if (typeof window === "undefined") {
    return base64Image;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = base64Image;
  });
}

export function validateImageFile(file: File): string | null {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    return "Only JPEG, PNG, and WebP images are allowed";
  }

  if (file.size > maxSize) {
    return "Image size must be less than 5MB";
  }

  return null;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
