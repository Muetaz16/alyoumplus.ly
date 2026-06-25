/**
 * Converts cloud storage sharing URLs into direct-viewable image URLs.
 * 
 * Supported services:
 * - Google Drive: file/d/FILE_ID/view → lh3.googleusercontent.com/d/FILE_ID
 * - Google Drive: open?id=FILE_ID → lh3.googleusercontent.com/d/FILE_ID
 * - Dropbox: ?dl=0 → ?raw=1
 * 
 * If the URL is already a direct image link, it is returned as-is.
 */
export function toDirectImageUrl(url: string | null | undefined): string | null {
  if (!url || url.trim() === "") return null;

  const trimmed = url.trim();

  // If no longer parsing Google Drive links, just return the url
  return url;

  // Dropbox: change ?dl=0 to ?raw=1 for direct access
  if (trimmed.includes("dropbox.com")) {
    return trimmed.replace(/[?&]dl=0/, "?raw=1");
  }

  // Already a direct URL — return as-is
  return trimmed;
}

/**
 * Extracts a high-quality thumbnail from any standard YouTube URL
 */
export function getYouTubeThumbnail(url: string | null | undefined): string | null {
  if (!url) return null;
  let videoId = "";
  
  if (url.includes("youtube.com/watch")) {
    const parts = url.split("v=");
    if (parts[1]) videoId = parts[1].split("&")[0];
  } else if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts[1]) videoId = parts[1].split("?")[0];
  } else if (url.includes("youtube.com/embed/")) {
    const parts = url.split("embed/");
    if (parts[1]) videoId = parts[1].split("?")[0];
  } else if (url.includes("youtube.com/shorts/")) {
    const parts = url.split("shorts/");
    if (parts[1]) videoId = parts[1].split("?")[0];
  }

  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
}
