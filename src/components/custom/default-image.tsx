import React from "react";
import defaultImageIcon from '../../assets/default-image-icon.png';

type DefaultImageProps = {
  width?: number;
  height?: number;
  className?: string;
  alt: string;
};

const DefaultImage: React.FC<DefaultImageProps> = ({
  className = "",
  alt,
}) => {
  return (
    <div
      className={`flex justify-center items-center bg-gray-400/80 rounded-lg ${className}`}
    >
      <img
        src={defaultImageIcon}
        alt={alt}
        className="object-contain p-2"
        style={{ maxWidth: "50%", maxHeight: "50%" }}
      />
    </div>
  );
};

export default DefaultImage;