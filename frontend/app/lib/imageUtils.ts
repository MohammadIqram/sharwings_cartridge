const CLOUDINARY_HOST = "res.cloudinary.com";

/**
 * Checks whether a URL is a valid Cloudinary hosted image.
 */
const isCloudinaryUrl = (url: unknown): url is string => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("data:") || url.startsWith("blob:")) return false;

  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.includes(CLOUDINARY_HOST) &&
      url.includes("/upload/")
    );
  } catch {
    return false;
  }
};

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: "limit" | "fill" | "scale" | "fit" | string;
}

/**
 * Returns an optimized Cloudinary image URL with transformations applied.
 */
export const getOptimizedImageUrl = (
  url: string,
  options: ImageTransformOptions = {}
): string => {
  if (!isCloudinaryUrl(url)) return url;

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "limit",
  } = options;

  const [prefix, rest] = url.split("/upload/");
  if (!rest) return url;

  const transforms: string[] = [];

  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  transforms.push(`c_${crop}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);

  return `${prefix}/upload/${transforms.join(",")}/${rest}`;
};

/**
 * Generates srcSet string for responsive images.
 */
export const getOptimizedSrcSet = (
  url: string,
  widths: number[] = [320, 480, 640, 960]
): string | undefined => {
  if (!isCloudinaryUrl(url)) return undefined;

  return widths
    .map(
      (width) =>
        `${getOptimizedImageUrl(url, { width })} ${width}w`
    )
    .join(", ");
};
