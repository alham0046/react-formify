export const camelCase = (str: string) => {
    if (str == '_id') return str

    // If it's already camelCase, return it unchanged
    if (/^[a-z][a-zA-Z0-9]*$/.test(str)) return str;
    
    const lowerStr = str.toLowerCase();
    return lowerStr
        .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, (match) => match.toLowerCase());
}


export const fromCamelCase = (str : string) => {
    return str
    .replace(/([A-Z])/g, ' $1')     // Add space before capital letters
    .replace(/^./, char => char.toUpperCase()); // Capitalize first letter
}