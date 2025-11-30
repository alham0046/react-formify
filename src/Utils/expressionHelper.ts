const expressionCache = new Map();

export function evalExpression(template : string, deps : string[], store : any) {
    let expr = template;

    for (let key of deps) {
        const value = getByPath(store, key);
        expr = expr.replace("${" + key + "}", JSON.stringify(value));
    }

    // console.log('evaluating expr:', expr);

    try {
        return Function(`"use strict"; return (${expr});`)();
    } catch (e) {
        return false;
    }
}


// export function evalExpression(template : string, deps : string[], store : any, lastComputedValue : any) {
//     let expr = template;

//     for (let key of deps) {
//         const value = getByPath(store, key);
//         expr = expr.replace("${" + key + "}", JSON.stringify(value));
//     }

//     // console.log('evaluating expr:', expr);

//     try {
//         const result = Function(`"use strict"; return (${expr});`)();
//         lastComputedValue.current = result;
//         // console.log('evaluted result:', result);
//         return result;
//         // return Function(`"use strict"; return (${expr});`)();
//     } catch (e) {
//         // console.warn("Invalid expression:", expr);
//         return false;
//     }
// }

export function getByPath(obj : any, path : string) {
    return path.split(".").reduce((acc, key) => {
        if (!acc) return undefined;
        return acc[key];
    }, obj);
}

export function parseExpression(expr : string) {
    if (expressionCache.has(expr)) return expressionCache.get(expr);

    const regex = /\$\{([^}]+)\}/g;
    const deps = [];
    let template = expr;

    let match;
    while ((match = regex.exec(expr))) {
        const dep = match[1].trim();
        deps.push(dep);
    }

    const result = { deps, template };
    expressionCache.set(expr, result);
    return result;
}