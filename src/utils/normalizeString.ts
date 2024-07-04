export function normalizeString(input: string) {
    // Replace multiple spaces, newlines, tabs, and other whitespace characters with a single space
    return input.replace(/\s+/g, ' ').trim();
}