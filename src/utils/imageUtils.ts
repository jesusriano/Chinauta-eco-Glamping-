import React from 'react';

/**
 * Utility to generate responsive WebP image source sets and fallbacks
 * for EcoGlamping Chinauta images.
 */

// List of all known local assets that have responsive WebP versions
const RESPONSIVE_IMAGE_STEMS = new Set([
  'dome_1_1791403584294',
  'dome_1_1791403455449',
  'dome_1_1791403422738',
  'dome_1_1790625768325',
  'huitaca_deck_jacuzzi_1790621224807',
  'huitaca_catamaran_mesh_1790621260604',
  'huitaca_entrance_steps_1790621247333',
  'dome_2_1791404907620',
  'dome_2_1791404871963',
  'dome_2_1791404839607',
  'dome_2_1791404802997',
  'bochica_romantic_decor_1790618007934',
  'bochica_jacuzzi_deck_1790618019311',
  'bochica_sunset_view_1790617981274',
  'regenerated_image_1790617455020',
  'regenerated_image_1790616801813',
  'chinauta_romantic_dome_night',
  'chinauta_romantic_dome_night_1790624852355',
  'chinauta_deck_asoleadoras',
  'chinauta_deck_asoleadoras_1790624838157',
  'dome_4_1791404275513',
  'dome_4_1791404266017',
  'dome_4_1791404251064',
  'dome_4_1791404236234',
  'dome_4_1791404217055',
  'dome_5_1791404612181',
  'dome_5_1791404605043',
  'dome_5_1791404596425',
  'logo'
]);

export interface ResponsiveImageData {
  isResponsive: boolean;
  webpSrc: string;
  webpSrcSet: string;
  sizes: string;
  fallbackSrc: string;
}

export function getResponsiveImageData(src: string, customSizes?: string): ResponsiveImageData {
  if (!src) {
    return {
      isResponsive: false,
      webpSrc: '',
      webpSrcSet: '',
      sizes: '',
      fallbackSrc: ''
    };
  }

  // Extract base filename without path and without extension or Vite hash
  // Example: '/assets/images/dome_1_1791403584294.jpg' -> 'dome_1_1791403584294'
  // Or Vite bundled: '/assets/dome_1_1791403584294-CeA05dhH.jpg'
  const match = src.match(/(?:^|\/)([a-zA-Z0-9_]+)(?:-[a-zA-Z0-9_-]+)?\.(?:jpg|jpeg|png|webp)/);
  const stem = match ? match[1] : '';

  if (stem && RESPONSIVE_IMAGE_STEMS.has(stem)) {
    const webp640 = `/assets/images/${stem}-640w.webp`;
    const webp1024 = `/assets/images/${stem}-1024w.webp`;
    const webpFull = `/assets/images/${stem}.webp`;
    const webpSrcSet = `${webp640} 640w, ${webp1024} 1024w, ${webpFull} 1440w`;
    const sizes = customSizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

    return {
      isResponsive: true,
      webpSrc: webpFull,
      webpSrcSet,
      sizes,
      fallbackSrc: src
    };
  }

  // For external images (like Unsplash) with auto=format, auto-select webp
  if (src.includes('unsplash.com') && !src.includes('format=webp')) {
    const webpUnsplash = src.replace('auto=format', 'auto=format&format=webp');
    return {
      isResponsive: true,
      webpSrc: webpUnsplash,
      webpSrcSet: `${webpUnsplash}&w=640 640w, ${webpUnsplash}&w=1024 1024w, ${webpUnsplash}&w=1600 1600w`,
      sizes: customSizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      fallbackSrc: src
    };
  }

  return {
    isResponsive: false,
    webpSrc: src,
    webpSrcSet: '',
    sizes: '',
    fallbackSrc: src
  };
}

/**
 * Helper utility to transform any image URL to WebP format where supported.
 * Works seamlessly with local assets, Vite-bundled paths, and external CDNs like Unsplash.
 */
export function transformToWebp(src: string): string {
  if (!src) return '';

  // Data URLs and Blobs cannot/should not be renamed
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  // Already WebP
  if (src.endsWith('.webp') || src.includes('.webp?')) {
    return src;
  }

  // 1. Check local responsive stems
  const match = src.match(/(?:^|\/)([a-zA-Z0-9_]+)(?:-[a-zA-Z0-9_-]+)?\.(?:jpg|jpeg|png)/i);
  const stem = match ? match[1] : '';

  if (stem && RESPONSIVE_IMAGE_STEMS.has(stem)) {
    return `/assets/images/${stem}.webp`;
  }

  // 2. Check local path in /assets/images/
  if (src.includes('/assets/images/') && /\.(?:jpg|jpeg|png)$/i.test(src)) {
    return src.replace(/\.(?:jpg|jpeg|png)$/i, '.webp');
  }

  // 3. Unsplash URLs
  if (src.includes('unsplash.com')) {
    if (src.includes('format=')) {
      return src.replace(/format=[a-zA-Z0-9]+/, 'format=webp');
    }
    if (src.includes('auto=format')) {
      return src.replace('auto=format', 'auto=format&format=webp');
    }
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}auto=format&format=webp`;
  }

  // 4. Cloudinary / Imgix CDNs
  if (src.includes('res.cloudinary.com') && !src.includes('f_webp')) {
    return src.replace('/image/upload/', '/image/upload/f_webp,q_auto/');
  }
  if (src.includes('imgix.net') && !src.includes('fm=webp')) {
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}fm=webp`;
  }

  // 5. Default fallback to getResponsiveImageData
  const data = getResponsiveImageData(src);
  return data.webpSrc || src;
}

/**
 * Convenience alias for transformToWebp
 */
export const toWebpUrl = transformToWebp;

/**
 * Detects if the current browser environment supports WebP images.
 */
let isWebpSupportedCache: boolean | null = null;
export function supportsWebp(): boolean {
  if (typeof window === 'undefined') return true;
  if (isWebpSupportedCache !== null) return isWebpSupportedCache;

  try {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      isWebpSupportedCache = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      return isWebpSupportedCache;
    }
    isWebpSupportedCache = true;
    return true;
  } catch (_) {
    isWebpSupportedCache = true;
    return true;
  }
}

/**
 * Returns structured picture source items for building custom <picture> markup
 */
export interface PictureSourceItem {
  type: string;
  srcSet: string;
  sizes?: string;
  media?: string;
}

export function getResponsivePictureSources(src: string, customSizes?: string): PictureSourceItem[] {
  const data = getResponsiveImageData(src, customSizes);
  const sources: PictureSourceItem[] = [];

  if (data.isResponsive && data.webpSrcSet) {
    sources.push({
      type: 'image/webp',
      srcSet: data.webpSrcSet,
      sizes: data.sizes
    });

    if (data.fallbackSrc && data.fallbackSrc !== data.webpSrc) {
      sources.push({
        type: 'image/jpeg',
        srcSet: data.fallbackSrc,
        sizes: data.sizes
      });
    }
  } else {
    const webpUrl = transformToWebp(src);
    if (webpUrl !== src) {
      sources.push({
        type: 'image/webp',
        srcSet: webpUrl
      });
    }
  }

  return sources;
}

/**
 * Returns the best direct WebP URL for a given image path
 */
export function getWebpUrl(src: string): string {
  return transformToWebp(src);
}

