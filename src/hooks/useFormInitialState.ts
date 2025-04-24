import { useInputStore } from "./useInputStore"

interface InitialState {
    [key: string]: any;
}

export const useFormInitials = (initialState: InitialState): void => {
    useInputStore.setState((state) => ({
        inputData: {
            ...state.inputData,
            ...initialState
        }
    }))
}