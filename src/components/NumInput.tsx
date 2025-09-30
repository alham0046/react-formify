import React, { memo, useEffect, useRef } from 'react'
// import { useInputStore } from '../../../Hooks/useInputStore'
import InputTemplate from './InputTemplate'
import { useInputStore } from 'src/hooks/useInputStore'
import { FullInputProps, InputProps } from 'src/typeDeclaration/inputProps';
import { getNestedValue } from 'src/Utils/inputStoreUtils';
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
    containerStyles,
    stringify = false,
    privacy = false,
    maxLength,
    inputStyles,
    placeholderStyles,
    onChange = () => { },
    initialValue = "",
    name,
    ...props
}) => {
    const value = useInputStore(
        (state) => {
            if ((props as FullInputProps).isArrayObject) {
                const arrData = (props as FullInputProps).arrayData!
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
        (props as FullInputProps).onInputChange(name!, newValue)
    }
    return (
        <InputTemplate
            name={name!}
            value={value}
            handleChange={handleChange}
            maxLength={maxLength}
            onEnterPress={onEnterPress}
            placeholder={placeholder}
            type={privacy ? 'password' : 'number'}
            containerStyles={containerStyles}
            inputStyles={inputStyles}
            placeholderStyles={placeholderStyles}
            {...props}
        />
    )
}

export default memo(NumInput)
