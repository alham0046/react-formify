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