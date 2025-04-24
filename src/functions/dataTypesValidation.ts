const isEmptyObject = (obj : object) => Object.keys(obj).length === 0

const isArray = (arr : any) => Array.isArray(arr)

const isEmptyArray = (arr : any[]) => arr.length === 0

export {isEmptyObject, isArray, isEmptyArray}