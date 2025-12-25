import { useEffect } from "react";
import { useInputStore } from "./useInputStore";

export const useSetEditData = (data?: Record<string, any>, resetOnClose: boolean = true) => {
    useEffect(() => {
        if (data) {
            useInputStore.setState((state) => ({
                inputData: data,
            }))
            setTimeout(() => {
                useInputStore.setState((state) => ({
                    initialData: data
                }))
            }, 200);
        }
        return () => {
            if (!resetOnClose) return
            useInputStore.getState().resetInput()
        }
    }, [])
}