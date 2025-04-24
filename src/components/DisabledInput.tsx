import React, { FC, memo, useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useInputStore } from '../hooks/useInputStore';
import { camelCase } from 'src/functions/camelCase';

interface DisabledInputProps {
    initialValue?: string;
    containerStyles?: string;
    placeholder: string;
    name?: string;
    isArrayObject?: boolean;
    arrayData?: {
        arrayName: string;
        arrayIndex: number;
    };
    onInputChange: (name: string, value: string) => void;
}

const DisabledInput: FC<DisabledInputProps> = ({
    initialValue = "",
    containerStyles = "",
    placeholder,
    name = undefined,
    ...props
}) => {
    const modifiedName: string = name || camelCase(placeholder);

    const value: string = useInputStore(
        (state) => {
            if (props.isArrayObject) {
                const arrData = props.arrayData!;
                return (
                    state.inputData[arrData.arrayName]?.[arrData.arrayIndex]?.[modifiedName] ?? initialValue
                );
            }
            return state.inputData[modifiedName] ?? initialValue;
        }
    );

    useEffect(() => {
        props.onInputChange(modifiedName, value);
    }, [modifiedName, value]);

    return (
        <div className={`relative w-full group ${containerStyles}`}>
            <input
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
            </label>
        </div>
    );
};

export default memo(DisabledInput);