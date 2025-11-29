import { isArray } from "src/functions/dataTypesValidation";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface InputData {
  [key: string]: any;
}

interface InputStore {
  inputData: InputData;
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
    setCurrentInputKey: (key) => set({ currentInputKey: key }),
    setInputValue: (key: string, value: any) =>
      set((state) => {
        const keys = key.split(".");
        if (keys.length > 1) {
          let current = { ...state.inputData };
          let obj = current;
          for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!obj[k]) {
              obj[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
            }
            obj = obj[k];
          }
          obj[keys[keys.length - 1]] = value;
          return { inputData: current };
        }

        if (state.inputData[key] === value) return state;
        return {
          inputData: { ...state.inputData, [key]: value },
        };
      }),
    setInitialInputData: (data) => set((state) => ({
      inputData: {
        ...state.inputData,
        ...data
      }
    })),
    resetInput: (keys) =>
      set((state) => {
        if (!keys) return { inputData: {} }

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
