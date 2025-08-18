export function personIdFromUrl(url?: string): string {
    if (!url) return "";
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
}