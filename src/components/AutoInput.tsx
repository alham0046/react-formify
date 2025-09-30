import React, { memo, useEffect, useMemo, useState } from 'react'
import { useInputStore } from 'src/hooks/useInputStore';
import { camelCase, fromCamelCase } from 'src/functions/camelCase';
import { isArray } from 'src/functions/dataTypesValidation';
import StrInput from './StrInput';
import NumInput from './NumInput';
interface mongoProps {
    key: string
    value: string | number
}

interface FullAutoInputProps {
    initialData?: object
    exclusionKeys?: string | string[]
    onInputChange?: () => void
    sharedStyles?: object
    name?: undefined
    bgColor? : string
}

type AutoInputProps = Omit<FullAutoInputProps, "sharedStyles" | "bgColor" | "onInputChange">

const AutoInput: React.FC<AutoInputProps> = ({ initialData, exclusionKeys, ...props }) => {
    // const setInputValue = useInputStore((state) => state.setInputValue)
    const { name, ...rest } = props
    const excludedKeys = useMemo(() => {
        if (!exclusionKeys) return [];
        return isArray(exclusionKeys)
            ? exclusionKeys.map(camelCase)
            : [camelCase(exclusionKeys)];
    }, [exclusionKeys]);
    const inputFields = useMemo<mongoProps[]>(() => {
        const data = initialData ?? useInputStore.getState().inputData;

        if (!initialData) return Object.entries(data).map(([key, value]) => ({ key, value }));

        // Also set the data in store when `initialData` is present
        const normalized = Object.fromEntries(
            Object.entries(initialData).map(([key, val]) => [key, val === 0 ? "" : val])
        );
        useInputStore.getState().setInitialInputData(normalized);

        return Object.entries(normalized).map(([key, value]) => ({ key, value }));
    }, [initialData]);
    return (
        <>
            {
                inputFields.map(({ key, value }) => {
                    if (excludedKeys.includes(key)) return null;

                    const commonProps = {
                        name: key,
                        placeholder: fromCamelCase(key),
                        sharedStyles: (props as FullAutoInputProps).sharedStyles,
                        bgColor: (props as FullAutoInputProps).bgColor,
                        ...rest
                    };

                    return typeof value === "number" ? (
                        <NumInput key={key} {...commonProps} />
                    ) : (
                        <StrInput key={key} {...commonProps} />
                    );
                })
            }
        </>
    )
}

export default memo(AutoInput)






























// import React, { memo, useEffect, useMemo, useState } from 'react'
// import { useInputStore } from 'src/hooks/useInputStore';
// import { camelCase, fromCamelCase } from 'src/functions/camelCase';
// import { isArray } from 'src/functions/dataTypesValidation';
// import StrInput from './StrInput';
// import NumInput from './NumInput';
// interface mongoProps {
//     key: string
//     value: string | number
// }

// interface FullAutoInputProps {
//     initialData?: object
//     exclusionKeys?: string | string[]
//     onInputChange?: () => void
//     sharedStyles?: object
//     name?: undefined
// }

// const AutoInput: React.FC<FullAutoInputProps> = ({ initialData, exclusionKeys, ...props }) => {
//     const setInputValue = useInputStore((state) => state.setInputValue)
//     const [initialInput, setInitialInput] = useState<mongoProps[]>([])
//     const { name, ...rest } = props
//     useEffect(() => {
//         if (initialData) return
//         setTimeout(() => {
//             const storedData = useInputStore.getState().inputData;
//             const newData = Object.entries(storedData).map(([key, value]) => ({ key: key, value: value }))
//             setInitialInput(newData as mongoProps[])
//         }, 1);
//         return () => setInitialInput([])
//     }, [])
//     const initialMemoData = useMemo<mongoProps[] | undefined>(() => {
//         if (!initialData) return
//         return Object.entries(initialData).map(([key, value]) => ({ key: key, value: value }))
//     }, [initialData]);
//     // const noShowData = isArray(exclusionKeys) ? exclusionKeys.map((data) => camelCase(data)) : [camelCase(exclusionKeys)]
//     const noShowData = exclusionKeys ? (isArray(exclusionKeys) ? exclusionKeys.map((data) => camelCase(data)) : [camelCase(exclusionKeys)]) : undefined
//     // console.log('props is', props)
//     return (
//         <>
//             {
//                 (initialMemoData || initialInput).map(({ key, value }) => {
//                     if (!noShowData?.includes(key)) {
//                         // console.log('the value is')
//                         if (typeof value == 'number') {
//                             setTimeout(() => {
//                                 if (value == 0) setInputValue(key, "")
//                             }, 1);
//                             return (

//                                 <NumInput
//                                     key={key}
//                                     placeholder={fromCamelCase(key)}
//                                     name={key}
//                                     {...rest}
//                                 />
//                             )
//                         }
//                         return (
//                             <StrInput
//                                 key={key}
//                                 placeholder={fromCamelCase(key)}
//                                 name={key}
//                                 {...rest}
//                             />
//                         )
//                     }
//                 })
//             }
//         </>
//     )
// }

// export default memo(AutoInput)