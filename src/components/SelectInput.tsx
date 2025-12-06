import React, { FC, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useInputStore } from 'src/hooks/useInputStore';
import { getNestedValue } from 'src/Utils/inputStoreUtils';
import SelectTemplate from './SelectTemplate';
import { useComputedExpression } from 'src/hooks/useComputedExpression';
import { useFormInitials } from 'src/hooks/useFormInitialState';
import { OptionMap, useDependentOptions } from 'src/hooks/useDependentOptions';
import { StyleProp } from 'src/typeDeclaration/stylesProps';

interface SelectOption {
    label: string;
    value: string;
}

interface FullInputProps {
    name?: string
    placeholder: string
    /** NEW — generic dependent dropdown system */
    dependsOn?: string;
    optionsMap?: OptionMap;
    options: SelectOption[] | string[]
    initialValue?: string;
    initialLabel?: string
    disabled?: boolean | string
    hideElement?: boolean | string
    styles?: StyleProp
    searchable?: boolean
    onDisableChange?: (args: {
        state: boolean,
        disabledKey?: string,
        disabledValue: any,
        storeValue: Record<string, any>,
        setValue: (value: any) => void
    }) => void
    onChange?: (value: string) => void
    onInputChange: (name: string, value: string) => void
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
    dependsOn,
    optionsMap,
    initialLabel,
    disabled = false,
    hideElement = false,
    searchable = false,
    onDisableChange,
    initialValue = '',
    styles = {
        inputStyles: '',
        placeholderStyles: '',
        containerStyles: '',
        modalBoxStyles: '',
        optionBoxStyles: '',
        optionStyles: '',
        dropdownOffset: 5
    },
    ...props
}) => {
    const fullProps = props as FullInputProps

    const handleOnDisableChange = useCallback((value: any) => {
        useFormInitials({ [name!]: value })
    }, [name])

    const disabledValue = useComputedExpression(disabled, name!);
    const hiddenValue = useComputedExpression(hideElement, name!);

    useEffect(() => {
        if (onDisableChange) {
            console.log('the ondisabled value is', disabledValue)
            const { inputData } = useInputStore.getState()
            const currentDisabled = getNestedValue(inputData, name!)
            onDisableChange({
                state: disabledValue,
                disabledKey: name!,
                disabledValue: currentDisabled,
                storeValue: inputData,
                setValue: handleOnDisableChange
            })
        }
    }, [disabledValue])


    const dependentOptions = useDependentOptions(
        dependsOn,
        optionsMap,
        initialLabel,
        initialValue,
        name
    );

    const staticOptions: SelectOption[] = useMemo(() => {
        if (dependentOptions) return dependentOptions;

        if (Array.isArray(options) && typeof options[0] === "string") {
            const initialItem = initialLabel
                ? [{ label: initialLabel, value: initialValue }]
                : [];

            return [
                ...initialItem,
                ...(options as string[]).map((item) => ({
                    label: item,
                    value: item,
                })),
            ];
        }

        return options as SelectOption[];
    }, [options, dependentOptions]);
    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue);
        fullProps.onInputChange(name!, selectedValue);
    };

    return (
        <div style={{ display: hiddenValue ? 'none' : 'block' }}>
            {/* {console.log('here is select input chat is', name, placeholder, staticOptions, disabledValue, hiddenValue)} */}
            <SelectTemplate
                name={name!}
                placeholder={placeholder}
                options={staticOptions}
                disabled={disabledValue}
                hideElement={hiddenValue}
                seachable={searchable}
                onSelect={handleSelect}
                styles={styles}
                {...props}
            />
        </div>
    );
};

// export default memo(SelectInput, (prev, next) => prev.name === next.name);
const MemoizedSelectInput = memo(SelectInput, (prev, next) => prev.name === next.name)
MemoizedSelectInput.displayName = 'SelectInput';
export default MemoizedSelectInput;










// import React, { FC, memo, useCallback, useEffect, useMemo, useRef } from 'react';
// import { useInputStore } from 'src/hooks/useInputStore';
// import { getNestedValue } from 'src/Utils/inputStoreUtils';
// import SelectTemplate from './SelectTemplate';
// import { useComputedExpression } from 'src/hooks/useComputedExpression';
// import { useFormInitials } from 'src/hooks/useFormInitialState';

// interface SelectOption {
//     label: string;
//     value: string;
// }

// interface FullInputProps {
//     name?: string
//     placeholder: string
//     options: SelectOption[] | string[]
//     initialValue?: string;
//     initialLabel?: string
//     disabled?: boolean | string
//     hideElement?: boolean | string
//     onDisableChange?: (args: {
//         state: boolean,
//         disabledKey?: string,
//         disabledValue: any,
//         storeValue: Record<string, any>,
//         setValue: (value: any) => void
//     }) => void
//     onChange?: (value: string) => void
//     onInputChange: (name: string, value: string) => void
//     inputStyles?: string
//     placeholderStyles?: string
//     containerStyles?: string
//     isArrayObject?: boolean
//     arrayData?: {
//         arrayName: string
//         arrayIndex: number
//     }
//     //   sharedStyles?: {
//     //     placeholderStyles?: string;
//     //   };
//     //   bgColor: string;
// }

// type SelectProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">

// const SelectInput: FC<SelectProps> = ({
//     name,
//     placeholder,
//     options,
//     onChange = () => { },
//     disabled = false,
//     hideElement = false,
//     onDisableChange,
//     initialLabel,
//     initialValue = '',
//     inputStyles = '',
//     placeholderStyles = '',
//     containerStyles = '',
//     //   sharedStyles = {},
//     //   bgColor = 'white',
//     ...props
// }) => {
//     const fullProps = props as FullInputProps
//     const value: string = useInputStore((state) => {
//         if (fullProps.isArrayObject) {
//             const arr = fullProps.arrayData!;
//             return state.inputData[arr.arrayName]?.[arr.arrayIndex]?.[name!] ?? '';
//         }
//         return getNestedValue(state.inputData, name!) ?? '';
//     });

//     const handleOnDisableChange = useCallback((value: any) => {
//         useFormInitials({ [name!]: value })
//     }, [name])

//     const disabledValue: boolean = useComputedExpression(disabled, name!)

//     const hiddenValue: boolean = useComputedExpression(hideElement, name!)

//     useEffect(() => {
//         if (onDisableChange) {
//             const { inputData } = useInputStore.getState()
//             const currentDisabled = getNestedValue(inputData, name)
//             onDisableChange({
//                 state: disabledValue,
//                 disabledKey: name,
//                 disabledValue: currentDisabled,
//                 storeValue: inputData,
//                 setValue: handleOnDisableChange
//             })
//         }
//     }, [disabledValue])

//     const prevValueRef = useRef(value);

//     useEffect(() => {
//         if (value !== prevValueRef.current) {
//             prevValueRef.current = value;
//             if (value !== '') onChange(value);
//         }
//     }, [value]);

//     const refinedOption: SelectOption[] = useMemo(() => {
//         if (options.length > 0 && typeof options[0] !== 'string') {
//             return options as SelectOption[]
//         }
//         const initialItem = initialLabel ? [{ label: initialLabel, value: initialValue }] : []
//         const newOption = (options as string[]).map((item) => ({ label: item, value: item }))
//         return [...initialItem, ...newOption]
//     }, [options])

//     const handleSelect = (selectedValue: string) => {
//         onChange(selectedValue);
//         if (fullProps.onInputChange) {
//             fullProps.onInputChange(name!, selectedValue);
//         }
//         // useInputStore.getState().setInputValue(name, selectedValue);
//     };

//     return (
//         <div style={{ display: hiddenValue ? 'none' : 'block' }}>
//             {/* {console.log('here is select input is')} */}
//             <SelectTemplate
//                 name={name!}
//                 value={value}
//                 placeholder={placeholder}
//                 options={refinedOption}
//                 disabled={disabledValue}
//                 hideElement={hiddenValue}
//                 onSelect={handleSelect}
//                 inputStyles={inputStyles}
//                 placeholderStyles={placeholderStyles}
//                 containerStyles={containerStyles}
//                 {...props}
//             />
//         </div>
//     );
// };

// const MemoizedSelectInput = memo(SelectInput)
// MemoizedSelectInput.displayName = 'SelectInput';
// export default MemoizedSelectInput;
