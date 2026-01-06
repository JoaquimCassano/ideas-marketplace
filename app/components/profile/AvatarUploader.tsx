"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui";
import { fileToBase64, resizeImage, validateImageFile } from "@/app/lib/avatar";

interface AvatarUploaderProps {
  currentAvatar: string;
  onAvatarUpdate: (avatarBase64: string) => void;
  onAvatarRemove: () => void;
}

export default function AvatarUploader({
  currentAvatar,
  onAvatarUpdate,
  onAvatarRemove,
}: AvatarUploaderProps) {
  const { update } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsUploading(true);

      const base64 = await fileToBase64(file);
      const resized = await resizeImage(base64, 200, 200);

      const response = await fetch("/api/profile/avatar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarBase64: resized }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload avatar");
      }

      onAvatarUpdate(data.avatarBase64);
      await update({ image: data.avatarBase64 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    try {
      setIsUploading(true);
      setError(null);

      const response = await fetch("/api/profile/avatar", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove avatar");
      }

      onAvatarRemove();
      await update({ image: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentAvatar}
            alt="Avatar"
            className="w-32 h-32 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] object-cover"
          />
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            id="avatar-upload"
            disabled={isUploading}
          />
          <label htmlFor="avatar-upload" className="inline-block">
            <span
              className={`inline-block neo-border neo-shadow px-8 py-4 text-lg font-display transition-transform hover:scale-105 cursor-pointer ${
                isUploading
                  ? "bg-[var(--hot-pink)]/50 cursor-not-allowed"
                  : "bg-[var(--hot-pink)] text-white hover:bg-[var(--hot-pink)]/90"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </span>
          </label>

          {currentAvatar.startsWith("data:image/") && (
            <Button
              variant="secondary"
              onClick={handleRemove}
              disabled={isUploading}
            >
              Remove Photo
            </Button>
          )}

          <p className="text-sm text-gray-600">
            JPG, PNG or WebP. Max 5MB. Will be resized to 200x200.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border-2 border-red-500 rounded-lg">
          <p className="text-red-700 font-bold">{error}</p>
        </div>
      )}
    </div>
  );
}
