import { useCallback, useMemo } from "react";
import { useInputStore } from "./useInputStore";
import { getNestedValue } from "src/Utils/inputStoreUtils";

export interface SelectOption {
    label: string;
    value: string;
}

export interface OptionMap {
    [key: string]: string[];
}

export const useDependentOptions = (
    dependsOn?: string,
    optionsMap?: OptionMap,
    initialLabel?: string,
    initialValue?: string,
    name?: string
) : SelectOption[] | null => {
    // Case 1: Not a dependent select
    // console.log('the depedns on value outside is')
    if (!dependsOn || !optionsMap) {
        return null;
    }

    // Subscribe only to the dependency field
    const depValue = useInputStore(
        state => {
            return getNestedValue(state.inputData, dependsOn) ?? ""
        }
    );

    return useMemo(() => {
        const parent = depValue || "";
        const rawOptions = optionsMap[parent] || [];

        const initialItem = initialLabel
            ? [{ label: initialLabel, value: initialValue! }]
            : [];

        return [
            ...initialItem,
            ...rawOptions.map(item => ({ label: item, value: item }))
        ];
    }, [depValue, optionsMap, initialLabel, initialValue]);
};
