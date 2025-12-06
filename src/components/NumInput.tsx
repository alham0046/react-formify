import React, { memo, useCallback, useEffect, useRef } from 'react'
// import { useInputStore } from '../../../Hooks/useInputStore'
import InputTemplate from './InputTemplate'
import { useInputStore } from 'src/hooks/useInputStore'
import { FullInputProps, InputProps } from 'src/typeDeclaration/inputProps';
import { getNestedValue } from 'src/Utils/inputStoreUtils';
import { useComputedExpression } from 'src/hooks/useComputedExpression';
import { useFormInitials } from 'src/hooks/useFormInitialState';
// import InputTemplate from './InputTemplate'

// interface FullNumInputProps {
//     placeholder: string;
//     containerStyles?: string;
//     inputStyles?: string;
//     placeholderStyles?: string;
//     initialValue?: string;
//     name?: string | undefined;
//     isArrayObject?: boolean;
//     arrayData?: {
//         arrayName: string;
//         arrayIndex: number;
//     };
//     onInputChange: (name: string, value: string) => void;
// }

// type NumInputProps = Omit<FullNumInputProps, "isArrayObject" | "arrayData" | "onInputChange">;

interface NumInputProps extends InputProps {
    stringify?: boolean
}

const NumInput: React.FC<NumInputProps> = ({
    placeholder,
    onEnterPress = () => { },
    onBlur = () => { },
    containerStyles,
    stringify = false,
    privacy = false,
    disabled = false,
    hideElement = false,
    onDisableChange,
    maxLength,
    inputStyles,
    placeholderStyles,
    onChange = () => { },
    initialValue = "",
    name,
    ...props
}) => {
    const fullProps = props as FullInputProps
    const value = useInputStore(
        (state) => {
            if (fullProps.isArrayObject) {
                const arrData = fullProps.arrayData!
                return (
                    state.inputData[arrData.arrayName]?.[arrData.arrayIndex]?.[name!] ?? ""
                )
            }
            return getNestedValue(state.inputData, name!) ?? ""
            // return state.inputData[name] ?? ""
        }
    )
    const stringValidation = (data: number) => {
        if (!stringify) {
            return data
        }
        else {
            return data.toString()
        }
    }

    const handleOnDisableChange = useCallback((value: any) => {
        useFormInitials({ [name!]: value })
    }, [name])

    const disabledValue: boolean = useComputedExpression(disabled, name!)

    const hiddenValue: boolean = useComputedExpression(hideElement, name!)

    useEffect(() => {
        if (onDisableChange) {
            const { inputData } = useInputStore.getState()
            const currentDisabled = getNestedValue(inputData, name)
            onDisableChange({
                state: disabledValue,
                disabledKey: name,
                disabledValue: currentDisabled,
                storeValue: inputData,
                setValue: handleOnDisableChange
            })
        }
    }, [disabledValue])

    const prevValueRef = useRef(value)
    useEffect(() => {
        // console.log('the value of value is', value)
        if (value !== prevValueRef.current) {
            prevValueRef.current = value
            if (value !== "" && !isNaN(value)) {
                onChange(Number(value), null)  // Pass null as no event.data
            }
        }
    }, [value])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value
        // console.log('the number value is', inputVal)
        const newValue = inputVal === "" ? "" : stringValidation(Number(inputVal))
        const nativeEvent = e.nativeEvent as unknown as InputEvent; // Type assertion to InputEvent
        onChange(newValue, nativeEvent.data);
        fullProps.onInputChange(name!, newValue)
    }
    return (
        <InputTemplate
            name={name!}
            value={value}
            handleChange={handleChange}
            maxLength={maxLength}
            onBlur={onBlur}
            onEnterPress={onEnterPress}
            placeholder={placeholder}
            type={privacy ? 'password' : 'number'}
            disabled={disabledValue}
            hideElement={hiddenValue}
            containerStyles={containerStyles}
            inputStyles={inputStyles}
            placeholderStyles={placeholderStyles}
            {...props}
        />
    )
}

// 1. Export the memoized component
const MemoizedNumInput = memo(NumInput)

// 2. Set the displayName on the exported component
MemoizedNumInput.displayName = 'NumInput';

export default MemoizedNumInput;

// export default memo(NumInput)
