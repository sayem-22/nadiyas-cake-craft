import React, { useState, useEffect } from 'react';
import { Cake } from 'lucide-react';

interface ResilientCakeImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ResilientCakeImage: React.FC<ResilientCakeImageProps> = ({
  src,
  alt,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FCF2F4] via-[#FAF3EE] to-[#F5E8D7] text-[#7D655E] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full border border-[#D9BC8A] bg-white/80 flex items-center justify-center mb-3 text-[#9A732C]">
          <Cake className="w-6 h-6 stroke-[1.5]" />
        </div>
        <span className="font-serif text-sm font-medium text-[#2B1E1A] line-clamp-2 max-w-[20ch]">
          {alt}
        </span>
        <span className="text-xs text-[#7D655E] mt-1">Nadiya’s Cake Craft</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
