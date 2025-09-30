export function getNestedValue(obj: any, path: string): any {
    if (!path.includes(".")) return obj[path]
    const keys = path.split(".")
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}