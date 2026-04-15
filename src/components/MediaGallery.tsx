"use client";

import { ChevronLeft, ImageIcon } from "lucide-react";

interface MediaGalleryProps {
  images: string[];
  onBack: () => void;
  onImageClick: (url: string) => void;
}

export default function MediaGallery({ images, onBack, onImageClick }: MediaGalleryProps) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col w-full bg-gray-50 h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-4 p-4 bg-blue-700 text-white">
        <button className="p-1" onClick={onBack}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="font-semibold text-lg">Multimedia compartida</h2>
      </header>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 py-20">
            <ImageIcon className="w-16 h-16" />
            <p className="text-base">No hay imágenes en este chat</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {images.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`imagen ${i + 1}`}
                className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
                onClick={() => onImageClick(url)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
