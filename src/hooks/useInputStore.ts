import { isArray } from "src/functions/dataTypesValidation";
import { isEqual } from "src/functions/isEqual";
import { getNestedValue } from "src/Utils/inputStoreUtils";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface InputData {
  [key: string]: any;
}

interface InputStore {
  inputData: InputData;
  editedKeys: Set<string> | null,
  initialData: InputData | null,
  currentInputKey: string | null;
  setCurrentInputKey: (key: string | null) => void;
  setInputValue: (key: string, value: any) => void;
  setInitialInputData: (data: InputData) => void
  resetInput: (key?: string[] | string) => void;
}

export const useInputStore = create<InputStore>()(
  subscribeWithSelector((set, get) => ({
    inputData: {},
    currentInputKey: null,
    // <-----------------------  EDIT TRACKING FIELDS START ----------------------->
    editedKeys: null,
    initialData: null,
    // <-----------------------  EDIT TRACKING FIELDS END ------------------------>
    setCurrentInputKey: (key) => {
      set((state) => {
        if (state.currentInputKey === key) return state
        return { currentInputKey: key }
      })
    },
    setInputValue: (key: string, value: any) =>
      set((state) => {
        const keys = key.split(".");
        const current = structuredClone(state.inputData)
        let obj = current

        for (let i = 0; i < keys.length - 1; i++) {
          obj[keys[i]] ??= {}
          obj = obj[keys[i]]
        }

        obj[keys.at(-1)!] = value

        // ✨ EDIT TRACKING
        if (state.initialData) {
          const initialValue = getNestedValue(state.initialData, key)
          const editedKeys = new Set(state.editedKeys ?? [])

          if (!isEqual(initialValue, value)) {
            editedKeys.add(key)
          } else {
            editedKeys.delete(key)
          }

          return {
            inputData: current,
            editedKeys
          }
        }

        return { inputData: current }
      }),
    setInitialInputData: (data) => set((state) => ({
      inputData: {
        ...state.inputData,
        ...data
      }
    })),
    resetInput: (keys) =>
      set((state) => {
        if (!keys) return { inputData: {}, editedKeys: null, initialData: null }

        const newInputData = { ...state.inputData }
        if (isArray(keys)) {
          keys.forEach((key) => delete newInputData[key])
        }
        else {
          delete newInputData[keys]
        }
        return { inputData: newInputData }
      })
  }))
);



// if (keys.length > 1) {
//   let current = { ...state.inputData };
//   let obj = current;
//   for (let i = 0; i < keys.length - 1; i++) {
//     const k = keys[i];
//     if (!obj[k]) {
//       obj[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
//     }
//     obj = obj[k];
//   }
//   obj[keys[keys.length - 1]] = value;
//   return { inputData: current };
// }

// if (state.inputData[key] === value) return state;
// return {
//   inputData: { ...state.inputData, [key]: value },
// };