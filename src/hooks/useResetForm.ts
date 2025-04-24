import { useInputStore } from "./useInputStore"

export const useResetForm = () => {
    const resetInput = useInputStore((state) => state.resetInput)
    return resetInput
  }
  