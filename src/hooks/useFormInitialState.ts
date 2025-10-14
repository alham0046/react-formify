import { useInputStore } from "./useInputStore"

interface InitialState {
    [key: string]: any;
}

function expandDotNotation(obj: Record<string, any>, initialData: Record<string, any>) {

    for (const key in obj) {
        const value = obj[key];
        const keys = key.split('.');

        keys.reduce((acc, currKey, index) => {
            if (index === keys.length - 1) {
                acc[currKey] = value;
            } else {
                acc[currKey] = acc[currKey] || {};
            }
            return acc[currKey];
        }, initialData);
    }

    return initialData;
}

export const useFormInitials = (initialState: InitialState): void => {
    const keys = Object.keys(initialState);
    const hasDot = keys.some(key => key.includes('.'));
    if (!hasDot) {
        useInputStore.setState((state) => ({
            inputData: {
                ...state.inputData,
                ...initialState
            }
        }))
    }
    else {        
        useInputStore.setState((state) => ({
            inputData: {
                ...state.inputData,
                ...expandDotNotation(initialState, state.inputData)
            }
        }))
    }
}

//////////////////// Safe code version of above if condition is following

/////// inputData = {
///////   details: "some string"
/////// }
/////// useFormInitials({ "details.address": "bhagalpur" })
/////// Now "details" becomes { address: "bhagalpur" }
/////// — losing the original "some string" value.
/////// You probably want to avoid that.

// import { useInputStore } from "./useInputStore"

// interface InitialState {
//   [key: string]: any;
// }

// function expandDotNotation(obj: Record<string, any>, base: Record<string, any>) {
//   const result = { ...base } // clone to avoid direct mutation of store state

//   for (const fullKey in obj) {
//     const value = obj[fullKey];
//     const keys = fullKey.split('.');

//     let curr = result;

//     for (let i = 0; i < keys.length; i++) {
//       const key = keys[i];

//       // if we’re at the last key → assign value
//       if (i === keys.length - 1) {
//         curr[key] = value;
//       } else {
//         // if current level is missing or not an object → make it an object
//         if (typeof curr[key] !== "object" || curr[key] === null) {
//           curr[key] = {};
//         }
//         curr = curr[key];
//       }
//     }
//   }

//   return result;
// }

// export const useFormInitials = (initialState: InitialState): void => {
//   const keys = Object.keys(initialState);
//   const hasDot = keys.some(key => key.includes('.'));

//   useInputStore.setState((state) => {
//     if (!hasDot) {
//       return {
//         inputData: {
//           ...state.inputData,
//           ...initialState,
//         },
//       };
//     }

//     // 🔹 Efficient + safe nested key updates
//     const updatedData = expandDotNotation(initialState, state.inputData);
//     return { inputData: updatedData };
//   });
// };












// import { useInputStore } from "./useInputStore"

// interface InitialState {
//     [key: string]: any;
// }

// function expandDotNotation(obj: Record<string, any>) {
//     const result: Record<string, any> = {};

//     for (const key in obj) {
//         const value = obj[key];
//         const keys = key.split('.');

//         keys.reduce((acc, currKey, index) => {
//             if (index === keys.length - 1) {
//                 acc[currKey] = value;
//             } else {
//                 acc[currKey] = acc[currKey] || {};
//             }
//             return acc[currKey];
//         }, result);
//     }

//     return result;
// }

// const expDotExpand = () => {

// }


// export const useFormInitials = (initialState: InitialState): void => {
//     const keys = Object.keys(initialState);
//     const hasDot = keys.some(key => key.includes('.'));
//     if (!hasDot) {
//         useInputStore.setState((state) => ({
//             inputData: {
//                 ...state.inputData,
//                 ...initialState
//             }
//         }))
//     }
//     else {
        
//         const expanded = expandDotNotation(initialState);
//         useInputStore.setState((state) => ({
//             inputData: {
//                 ...state.inputData,
//                 ...expanded
//             }
//         }))
//     }
// }