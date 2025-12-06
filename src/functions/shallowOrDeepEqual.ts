export function shallowOrDeepEqual(a: any, b: any): boolean {
    if (a === b) return true;

    // handle null vs undefined
    if (a == null || b == null) return a === b;

    // different types
    if (typeof a !== typeof b) return false;

    // primitives handled above
    if (typeof a !== "object") return a === b;

    // Arrays
    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!shallowOrDeepEqual(a[i], b[i])) return false;
        }
        return true;
    }

    // Objects
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    for (let key of aKeys) {
        if (!b.hasOwnProperty(key)) return false;
        if (!shallowOrDeepEqual(a[key], b[key])) return false;
    }

    return true;
}
