import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { shallow } from "zustand/shallow";
import { camelCase } from 'src/functions/camelCase';
import { useInputStore } from 'src/hooks/useInputStore';
import InputTemplate from './InputTemplate';
import { FullInputProps, InputProps } from 'src/typeDeclaration/inputProps';
import { getNestedValue } from 'src/Utils/inputStoreUtils';


const StrInput: FC<InputProps> = ({
    placeholder,
    containerStyles = "",
    onEnterPress = () => { },
    onBlur = () => { },
    maxLength,
    privacy = false,
    disabled = false,
    inputStyles,
    placeholderStyles,
    onChange = () => { },
    initialValue = "",
    name,
    ...props
}) => {
    const fullProps = props as FullInputProps
    const value: string = useInputStore(
        (state) => {
            if (fullProps.isArrayObject) {
                const arrData = fullProps.arrayData!;
                return (
                    state.inputData[arrData.arrayName]?.[arrData.arrayIndex]?.[name!] ?? ""
                );
            }
            return getNestedValue(state.inputData, name!) ?? ""
            // return state.inputData[name] ?? "";
        }
    );

    const prevValueRef = useRef(value)

    useEffect(() => {
        if (value !== prevValueRef.current) {
            prevValueRef.current = value
            if (value !== "") {
                onChange(value, null)  // Pass null as no event.data
            }
        }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const changedValue = e.target.value;
        const nativeEvent = e.nativeEvent as unknown as InputEvent; // Type assertion to InputEvent
        onChange(changedValue, nativeEvent.data);
        fullProps.onInputChange(name!, e.target.value);
    }

    return (
        <>
            <InputTemplate
                name={name!}
                value={value}
                handleChange={handleChange}
                onEnterPress={onEnterPress}
                disabled={disabled}
                onBlur={onBlur}
                maxLength={maxLength}
                placeholder={placeholder}
                type={privacy ? 'password' : 'text'}
                containerStyles={containerStyles}
                inputStyles={inputStyles}
                placeholderStyles={placeholderStyles}
                {...props}
            />
        </>
    );
};

// 1. Export the memoized component
const MemoizedStrInput = memo(StrInput)

// 2. Set the displayName on the exported component
MemoizedStrInput.displayName = 'StrInput';

export default MemoizedStrInput;

// export default memo(StrInput);






// import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
// import { shallow } from "zustand/shallow";
// import { camelCase } from 'src/functions/camelCase';
// import { useInputStore } from 'src/hooks/useInputStore';
// import InputTemplate from './InputTemplate';
// import { FullInputProps, InputProps } from 'src/typeDeclaration/inputProps';
// import { getNestedValue } from 'src/Utils/inputStoreUtils';


// const StrInput: FC<InputProps> = ({
//     placeholder,
//     containerStyles = "",
//     onEnterPress = () => { },
//     maxLength,
//     privacy = false,
//     inputStyles,
//     placeholderStyles,
//     onChange = () => { },
//     initialValue = "",
//     name,
//     ...props
// }) => {

//     const value: string = useInputStore(
//         (state) => {
//             if ((props as FullInputProps).isArrayObject) {
//                 const arrData = (props as FullInputProps).arrayData!;
//                 return (
//                     state.inputData[arrData.arrayName]?.[arrData.arrayIndex]?.[name!] ?? ""
//                 );
//             }
//             return getNestedValue(state.inputData, name!) ?? ""
//             // return state.inputData[name] ?? "";
//         }
//     );

//     const prevValueRef = useRef(value)

//     useEffect(() => {
//         if (value !== prevValueRef.current) {
//             prevValueRef.current = value
//             if (value !== "") {
//                 onChange(value, null)  // Pass null as no event.data
//             }
//         }
//     }, [value])

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const changedValue = e.target.value;
//         const nativeEvent = e.nativeEvent as unknown as InputEvent; // Type assertion to InputEvent
//         onChange(changedValue, nativeEvent.data);
//         (props as FullInputProps).onInputChange(name!, e.target.value);
//     }

//     return (
//         <>
//             <InputTemplate
//                 name={name!}
//                 value={value}
//                 handleChange={handleChange}
//                 onEnterPress={ onEnterPress }
//                 maxLength={maxLength}
//                 placeholder={placeholder}
//                 type={privacy ? 'password' : 'text'}
//                 containerStyles={containerStyles}
//                 inputStyles={inputStyles}
//                 placeholderStyles={placeholderStyles}
//                 {...props}
//             />
//         </>
//     );
// };

// export default memo(StrInput);