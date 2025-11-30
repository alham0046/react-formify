export function getNestedValue(obj: any, path: any): any {
    if (!path || typeof path !== "string") return undefined; // <-- prevent crash
    if (!path.includes(".")) return obj[path]
    const keys = path.split(".")
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}