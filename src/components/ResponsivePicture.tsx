import React, { useState } from 'react';
import { getResponsiveImageData, transformToWebp } from '../utils/imageUtils';

export interface ResponsivePictureProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Source URL of the image (local asset or external) */
  src: string;
  /** Alternative text for accessibility */
  alt: string;
  /** Responsive sizes attribute, defaults to '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' */
  sizes?: string;
  /** Class name applied to the inner <img> element */
  className?: string;
  /** Optional class name applied to the outer <picture> wrapper */
  pictureClassName?: string;
  /** Loading attribute: 'lazy' (default) or 'eager' for hero images */
  loading?: 'lazy' | 'eager';
  /** Decoding attribute: 'async' (default), 'sync', or 'auto' */
  decoding?: 'async' | 'sync' | 'auto';
  /** Priority hint for browser preloader */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Optional custom fallback source if WebP fails or is unsupported */
  fallbackSrc?: string;
  /** Callback when image fails to load */
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  /** Callback when image loads successfully */
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * ResponsivePicture
 * A high-performance wrapper component rendering a semantic <picture> element
 * that serves responsive WebP format with srcset and media queries for different screen sizes,
 * with automatic fallback to standard JPG/PNG formats.
 */
export const ResponsivePicture: React.FC<ResponsivePictureProps> = ({
  src,
  alt,
  sizes,
  className = 'w-full h-full object-cover',
  pictureClassName = 'w-full h-full block',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  fallbackSrc,
  onError,
  onLoad,
  style,
  ...restProps
}) => {
  const [hasError, setHasError] = useState(false);

  // If no source is provided
  if (!src) {
    return null;
  }

  // Calculate responsive WebP data and source sets
  const imageData = getResponsiveImageData(src, sizes);
  const effectiveSizes = sizes || imageData.sizes || '100vw';
  const effectiveFallback = fallbackSrc || imageData.fallbackSrc || src;
  const webpUrl = imageData.webpSrc || transformToWebp(src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  // If an error occurred loading WebP, render safe fallback <img>
  if (hasError) {
    return (
      <img
        src={effectiveFallback}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        style={style}
        {...restProps}
      />
    );
  }

  // If image is responsive and has WebP sources
  if (imageData.isResponsive && imageData.webpSrcSet) {
    return (
      <picture className={pictureClassName}>
        {/* Modern WebP srcset for responsive screen sizes */}
        <source
          type="image/webp"
          srcSet={imageData.webpSrcSet}
          sizes={effectiveSizes}
        />
        {/* Fallback original format with srcset if available */}
        {imageData.fallbackSrc && imageData.fallbackSrc !== imageData.webpSrc && (
          <source
            srcSet={imageData.fallbackSrc}
            sizes={effectiveSizes}
          />
        )}
        {/* Fallback <img> element */}
        <img
          src={webpUrl}
          alt={alt}
          className={className}
          loading={loading}
          decoding={decoding}
          // @ts-ignore fetchPriority is valid in modern browsers
          fetchPriority={fetchPriority}
          onError={handleError}
          onLoad={onLoad}
          style={style}
          {...restProps}
        />
      </picture>
    );
  }

  // If external image or standard image that can be transformed to WebP
  const directWebp = transformToWebp(src);
  if (directWebp !== src) {
    return (
      <picture className={pictureClassName}>
        <source type="image/webp" srcSet={directWebp} />
        <img
          src={directWebp}
          alt={alt}
          className={className}
          loading={loading}
          decoding={decoding}
          // @ts-ignore fetchPriority is valid in modern browsers
          fetchPriority={fetchPriority}
          onError={handleError}
          onLoad={onLoad}
          style={style}
          {...restProps}
        />
      </picture>
    );
  }

  // Standard image fallback
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      // @ts-ignore fetchPriority is valid in modern browsers
      fetchPriority={fetchPriority}
      onError={handleError}
      onLoad={onLoad}
      style={style}
      {...restProps}
    />
  );
};

export default ResponsivePicture;
