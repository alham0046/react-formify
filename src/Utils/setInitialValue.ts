import { useInputStore } from "src/hooks/useInputStore";

export const handleInitialValue = (name : string, initialValue : string,setInputValue : (name : string, value : any) => void, compName : string) => {
    const storedData = useInputStore.getState().inputData;
    const value = storedData[name] || initialValue || ""
    if (!['ArrayInput', 'ObjectContainer', 'SubmitButton'].includes(compName)) {
        setTimeout(() => {
            setInputValue(name, value)
        }, 0);
    }
}