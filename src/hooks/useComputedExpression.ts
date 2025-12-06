import { useCallback, useMemo, useRef } from "react";
import { evalExpression, parseExpression } from "src/Utils/expressionHelper";
import { useInputStore } from "./useInputStore";

/**
 * Hook to subscribe & evaluate any expression-based prop
 * Example: disabled="${age} >= 18 && ${citizen} === true"
 */
export function useComputedExpression(propValue : string | boolean, name: string) {
    if (name === undefined) return
    const lastComputedRef = useRef<boolean | null>(null)
    // 1) Parse only once
    const parsed = useMemo(() => {
        if (typeof propValue === "boolean") return null;
        return parseExpression(propValue);
    }, [propValue]);

    if (typeof propValue === "boolean") {
        return propValue;
    }


    // 2) Zustand subscription only on dependencies
    const computedValue = useInputStore(
        useCallback((state) => {
            if (typeof propValue === "boolean"  || typeof parsed === "boolean") return propValue;

            if (lastComputedRef.current !== null && !parsed.deps.includes(state.currentInputKey)) {
                return lastComputedRef.current;
            }
            
            const result = evalExpression(
                parsed.template,
                parsed.deps,
                state.inputData,
            );
            lastComputedRef.current = result;
            return result;
        }, [parsed])
    );

    return computedValue;
}

















// import { useCallback, useMemo, useRef } from "react";
// import { evalExpression, parseExpression } from "src/Utils/expressionHelper";
// import { useInputStore } from "./useInputStore";
// import { shallow } from "zustand/shallow";
// import { getNestedValue } from "src/Utils/inputStoreUtils";

// /**
//  * Hook to subscribe & evaluate any expression-based prop
//  * Example: disabled="${age} >= 18 && ${citizen} === true"
//  */
// export function useComputedExpression(propValue : string | boolean) {
//     const lastComputedRef = useRef<boolean | null>(null)
//     // 1) Parse only once
//     const parsed = useMemo(() => {
//         if (typeof propValue === "boolean") return null;
//         return parseExpression(propValue);
//     }, [propValue]);

//     if (typeof propValue === "boolean") {
//         return propValue;
//     }


//     // 2) Zustand subscription only on dependencies
//     const computedValue = useInputStore(
//         useCallback((state) => {
//             if (typeof propValue === "boolean"  || typeof parsed === "boolean") return propValue;

//             const inputData = state.inputData;
//             const currentInputKey = state.currentInputKey;
//             const isLastComputedValid = lastComputedRef.current !== null;
//             if (isLastComputedValid && !parsed.deps.includes(currentInputKey)) {
//                 return lastComputedRef.current;
//             }
//             const currentValue = getNestedValue(inputData, currentInputKey);
//             if (isLastComputedValid && !currentValue) {
//                 // console.log('returning last computed value for missing key', propValue, isLastComputedValid, inputData[currentInputKey]);
//                 return lastComputedRef.current;
//             }
//             // if (isLastComputedValid && !inputData[currentInputKey]) {
//             //     return lastComputedRef.current;
//             // }
//             return evalExpression(
//                 parsed.template,
//                 parsed.deps,
//                 state.inputData,
//                 lastComputedRef
//             );
//         }, [parsed])
//     );

//     return computedValue;
// }
