export const getDynamic = (str : string, item : any) => {
    // console.log("the value of str and item is")
    const match = str.match(/\$\{data\.([^\}]+)\}/);
    if (match) {
        const variable = match[1]; // Extract variable (host, name, etc.)
        const outsideText = str.replace(match[0], '').trim(); // Remove the matched expression
        return `${item[variable]} ${outsideText}`; // Replace with value from item
    }
    return str;
}