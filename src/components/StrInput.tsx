import React, { FC, memo, useCallback } from 'react';
import { shallow } from "zustand/shallow";
import { camelCase } from 'src/functions/camelCase';
import { useInputStore } from 'src/hooks/useInputStore';

interface FullStrInputProps  {
    placeholder: string;
    containerStyles?: string;
    inputStyles?: string;
    placeholderStyles?: string;
    initialValue?: string;
    name?: string | undefined;
    isArrayObject?: boolean;
    arrayData?: {
        arrayName: string;
        arrayIndex: number;
    };
    onInputChange: (name: string, value: string) => void;
}

type StrInputProps = Omit<FullStrInputProps, "isArrayObject" | "arrayData" | "onInputChange">;


const StrInput: FC<StrInputProps> = ({
    placeholder,
    containerStyles = "",
    inputStyles,
    placeholderStyles,
    initialValue = "",
    name = undefined,
    ...props
}) => {
    // const getInternal = (): Pick<FullStrInputProps, 'isArrayObject' | 'arrayData' | 'onInputChange'> => props as any;
    const modifiedName: string = name || camelCase(placeholder);
    // const internalProps = props as Pick<FullStrInputProps, 'isArrayObject' | 'arrayData' | 'onInputChange'>;

    const value: string = useInputStore(
        (state) => {
            if ((props as FullStrInputProps).isArrayObject) {
                const arrData = (props as FullStrInputProps).arrayData!;
                return (
                    state.inputData[arrData.arrayName]?.[arrData.arrayIndex]?.[modifiedName] ?? ""
                );
            }
            return state.inputData[modifiedName] ?? "";
        }
    );

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        (props as FullStrInputProps).onInputChange(modifiedName, e.target.value);
    }, [modifiedName]);

    return (
        <>
            <input
                type="text"
                id={`floating_input_${modifiedName}`}
                value={value}
                onChange={handleChange}
                className={`py-2 px-2 border-2 w-full rounded-lg bg-transparent appearance-none peer ${inputStyles}`}
                placeholder=" "
                required
            />
            <label
                htmlFor={`floating_input_${modifiedName}`}
                className={`absolute left-5 px-1 bg-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[85%] peer-focus:-translate-y-6 ${placeholderStyles}`}
            >
                {placeholder}
            </label>
        </>
    );
};

export default memo(StrInput);