import { useCallback, useMemo, useRef } from "react";
import { evalExpression, parseExpression } from "src/Utils/expressionHelper";
import { useInputStore } from "./useInputStore";
import { shallow } from "zustand/shallow";

/**
 * Hook to subscribe & evaluate any expression-based prop
 * Example: disabled="${age} >= 18 && ${citizen} === true"
 */
export function useComputedExpression(propValue : string | boolean) {
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

            const inputData = state.inputData;
            const currentInputKey = state.currentInputKey;
            const isLastComputedValid = currentInputKey && lastComputedRef.current !== null;
            if (isLastComputedValid && !parsed.deps.includes(currentInputKey)) {
                return lastComputedRef.current;
            }
            if (isLastComputedValid && !inputData[currentInputKey]) {
                return lastComputedRef.current;
            }
            return evalExpression(
                parsed.template,
                parsed.deps,
                state.inputData,
                lastComputedRef
            );
        }, [parsed])
    );

    return computedValue;
}
