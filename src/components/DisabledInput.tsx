import React, { FC, memo, useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useInputStore } from '../hooks/useInputStore';
import { camelCase } from 'src/functions/camelCase';
import InputTemplate from './InputTemplate';
import { getNestedValue } from 'src/Utils/inputStoreUtils';

interface FullDisabledProps {
    initialValue?: string;
    containerStyles?: string;
    inputStyles?: string;
    placeholderStyles?: string;
    placeholder: string;
    onChange?: (value: string | number, data: string | null) => void
    name?: string;
    isArrayObject?: boolean;
    arrayData?: {
        arrayName: string;
        arrayIndex: number;
    };
    onInputChange: (name: string, value: string) => void;
}

type DisabledInputProps = Omit<FullDisabledProps, "isArrayObject" | "arrayData" | "onInputChange">;
// interface DisabledInputProps {
//     initialValue?: string;
//     containerStyles?: string;
//     inputStyles?: string;
//     placeholderStyles?: string;
//     placeholder: string;
//     name: string;
//     isArrayObject?: boolean;
//     arrayData?: {
//         arrayName: string;
//         arrayIndex: number;
//     };
//     onInputChange: (name: string, value: string) => void;
// }

const DisabledInput: FC<DisabledInputProps> = ({
    initialValue = "",
    containerStyles = "",
    placeholder,
    onChange = () => { },
    inputStyles,
    placeholderStyles,
    name,
    ...props
}) => {
    const fullProps = props as FullDisabledProps
    // const modifiedName: string = name || camelCase(placeholder);

    const value: string = useInputStore(
        (state) => {
            if (fullProps.isArrayObject) {
                const arrData = fullProps.arrayData!;
                return (
                    state.inputData[arrData.arrayName]?.[arrData.arrayIndex]?.[name!] ?? initialValue
                );
            }
            return getNestedValue(state.inputData, name!) ?? initialValue;
            // return state.inputData[modifiedName] ?? initialValue;
        }
    );

    useEffect(() => {
        onChange(value, null)
        fullProps.onInputChange(name!, value);
    }, [name, value]);

    return (
        <>
            <InputTemplate
                name={name!}
                value={value}
                placeholder={placeholder}
                disabled={true}
                type='text'
                containerStyles={containerStyles}
                inputStyles={`bg-gray-300 ${inputStyles}`}
                placeholderStyles={placeholderStyles}
                {...props}
            />
        </>
    );
};

export default memo(DisabledInput);
{/* <input
    type="text"
    id={`floating_input_${modifiedName}`}
    value={value}
    className="py-2 px-2 border-2 w-full rounded-lg bg-transparent appearance-none peer"
    placeholder=" "
    required
    disabled
/>
<label
    htmlFor={`floating_input_${modifiedName}`}
    className="absolute left-5 px-1 bg-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[85%] peer-focus:-translate-y-6"
>
    {placeholder}
</label> */}