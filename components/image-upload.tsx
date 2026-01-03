"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Camera, Upload, X } from "lucide-react";
import { Avatar } from "@heroui/avatar";
import { addToast } from "@heroui/toast";
import Image from "next/image";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  variant?: "avatar" | "banner";
  maxSize?: number; // in MB
  aspectRatio?: string;
  label?: string;
  disabled?: boolean;
}

export const ImageUpload = ({
  currentImage,
  onImageSelect,
  onImageRemove,
  variant = "avatar",
  maxSize = 5,
  aspectRatio = "1/1",
  label,
  disabled = false,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      addToast({
        title: "Invalid file type",
        description: "Please select an image file",
        color: "danger",
      });

      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      addToast({
        title: "File too large",
        description: `Please select an image smaller than ${maxSize}MB`,
        color: "danger",
      });

      return;
    }

    // Create preview
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent
    onImageSelect(file);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageRemove?.();
  };

  if (variant === "avatar") {
    return (
      <div className="flex flex-col items-center gap-3">
        {label && (
          <label className="text-sm font-medium text-foreground/70">
            {label}
          </label>
        )}
        <div className="relative">
          <Avatar
            showFallback
            className="w-24 h-24 text-large"
            src={preview || undefined}
          />
          <input
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            disabled={disabled}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) handleFileSelect(file);
            }}
          />
          <Button
            isIconOnly
            className="absolute bottom-0 right-0"
            color="primary"
            disabled={disabled}
            size="sm"
            variant="solid"
            onPress={handleClick}
          >
            <Camera size={16} />
          </Button>
        </div>
        {preview && onImageRemove && (
          <Button
            color="danger"
            disabled={disabled}
            size="sm"
            variant="flat"
            onPress={handleRemove}
          >
            Remove Image
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground/70">
          {label}
        </label>
      )}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-foreground/20 bg-content2"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        isPressable={!disabled}
        onDragEnter={() => !disabled && setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onPress={handleClick}
      >
        <CardBody className="p-6">
          <input
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            disabled={disabled}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) handleFileSelect(file);
            }}
          />
          {preview ? (
            <div className="relative">
              <Image
                alt="Preview"
                className="w-full h-auto rounded-lg"
                src={preview}
                style={{ aspectRatio }}
              />
              {onImageRemove && !disabled && (
                <Button
                  isIconOnly
                  className="absolute top-2 right-2"
                  color="danger"
                  size="sm"
                  variant="solid"
                  onPress={handleRemove}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <Upload className="w-12 h-12 text-foreground/40" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-foreground/60">
                  PNG, JPG, GIF up to {maxSize}MB
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
