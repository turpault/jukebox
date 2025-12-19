// Client-only utility functions

// Helper function to convert image URL to cached endpoint
export function getCachedImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  // If already using the cached endpoint, return as-is
  if (imageUrl.startsWith('/api/image/')) return imageUrl;
  // Base64 encode the URL and use the cached endpoint
  // Use btoa for browser compatibility
  const base64Url = btoa(unescape(encodeURIComponent(imageUrl)));
  return `/api/image/${base64Url}`;
}

