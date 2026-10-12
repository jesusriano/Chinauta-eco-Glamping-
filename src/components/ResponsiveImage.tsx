import React from 'react';
import ResponsivePicture, { ResponsivePictureProps } from './ResponsivePicture';

/**
 * Reusable <ResponsiveImage /> component that uses the <picture> element
 * and multiple <source> in srcset to serve different image resolutions
 * based on device screen width.
 */
export const ResponsiveImage: React.FC<ResponsivePictureProps> = (props) => {
  return <ResponsivePicture {...props} />;
};

export default ResponsiveImage;
