import { useInputStore } from "src/hooks/useInputStore"
import { getNestedValue } from "./inputStoreUtils"


export const getEditedData = () : { data: Record<string, any>, edited: Record<string, any> | null } => {
    const { editedKeys, inputData } = useInputStore.getState()
    const edited: Record<string, any> = {}

    if (!editedKeys || editedKeys?.size === 0) {
        return {
            data: inputData,
            edited: null,
        }
    }
    editedKeys.forEach((key) => {
        edited[key] = getNestedValue(inputData, key)
    })
    return {
        data: inputData,
        edited,
    }
}

// return {
//     data: state.inputData,
//     edited,
// }
// }
