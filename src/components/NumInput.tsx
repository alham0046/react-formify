import React, { memo } from 'react'
// import { useInputStore } from '../../../Hooks/useInputStore'
import InputTemplate from './InputTemplate'
import { useInputStore } from 'src/hooks/useInputStore'
import { FullInputProps, InputProps } from 'src/typeDeclaration/inputProps';
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

const NumInput: React.FC<InputProps> = ({ placeholder, containerStyles, inputStyles, placeholderStyles, onChange = () => { }, initialValue = "", name, ...props }) => {
    const value = useInputStore(
        (state) => {
            if ((props as FullInputProps).isArrayObject) {
                const arrData = (props as FullInputProps).arrayData!
                return (
                    state.inputData[arrData.arrayName]?.[arrData.arrayIndex]?.[name] ?? ""
                )
            }
            return state.inputData[name] ?? ""
        }
    )
    const handleChange = (e:React.ChangeEvent<HTMLInputElement> ) => {
        const inputVal = e.target.value
        // console.log('the number value is', inputVal)
        const newValue = inputVal === "" ? "" : Number(inputVal)
        onChange(newValue);
        (props as FullInputProps).onInputChange(name, newValue)
    }
    return (
        <InputTemplate
            name={name}
            value={value}
            handleChange={handleChange}
            placeholder={placeholder}
            type={"number"}
            containerStyles={containerStyles}
            inputStyles={inputStyles}
            placeholderStyles={placeholderStyles}
            {...props}
        />
    )
}

export default memo(NumInput)
