import React, { FC, useEffect, useMemo, useRef } from 'react';
import { camelCase } from 'src/functions/camelCase';
import { useInputStore } from 'src/hooks/useInputStore';
import { getNestedValue } from 'src/Utils/inputStoreUtils';
import SelectTemplate from './SelectTemplate';

interface SelectOption {
    label: string;
    value: string;
}

interface FullInputProps {
    name?: string
    placeholder: string
    options: SelectOption[] | string[]
    initialValue?: string;
    initialLabel?: string
    onChange?: (value: string) => void
    onInputChange: (name: string, value: string) => void
    inputStyles?: string
    placeholderStyles?: string
    containerStyles?: string
    isArrayObject?: boolean
    arrayData?: {
        arrayName: string
        arrayIndex: number
    }
    //   sharedStyles?: {
    //     placeholderStyles?: string;
    //   };
    //   bgColor: string;
}

type SelectProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">

const SelectInput: FC<SelectProps> = ({
    name,
    placeholder,
    options,
    onChange = () => { },
    initialLabel,
    initialValue = '',
    inputStyles = '',
    placeholderStyles = '',
    containerStyles = '',
    //   sharedStyles = {},
    //   bgColor = 'white',
    ...props
}) => {
    const fullProps = props as FullInputProps
    const value: string = useInputStore((state) => {
        if (fullProps.isArrayObject) {
            const arr = fullProps.arrayData!;
            return state.inputData[arr.arrayName]?.[arr.arrayIndex]?.[name!] ?? '';
        }
        return getNestedValue(state.inputData, name!) ?? '';
    });

    const prevValueRef = useRef(value);

    useEffect(() => {
        if (value !== prevValueRef.current) {
            prevValueRef.current = value;
            if (value !== '') onChange(value);
        }
    }, [value]);

    const refinedOption: SelectOption[] = useMemo(() => {
        if (options.length > 0 && typeof options[0] !== 'string') {
            return options as SelectOption[]
        }
        const initialItem = initialLabel ? [{ label: initialLabel, value: initialValue }] : []
        const newOption = (options as string[]).map((item) => ({ label: item, value: item }))
        return [...initialItem, ...newOption]
    }, [options])

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue);
        if (fullProps.onInputChange) {
            fullProps.onInputChange(name!, selectedValue);
        }
        // useInputStore.getState().setInputValue(name, selectedValue);
    };

    return (
        <>
            {/* {console.log('here is select input is')} */}
            <SelectTemplate
                name={name!}
                value={value}
                placeholder={placeholder}
                options={refinedOption}
                onSelect={handleSelect}
                inputStyles={inputStyles}
                placeholderStyles={placeholderStyles}
                containerStyles={containerStyles}
                {...props}
            />
        </>
    );
};

export default React.memo(SelectInput);
