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
    initialData: object
    exclusionKeys: string | string[]
    onInputChange: () => void
    sharedStyles: object
    name: undefined
}

const AutoInput: React.FC<FullAutoInputProps> = ({ initialData, exclusionKeys, ...props }) => {
    const setInputValue = useInputStore((state) => state.setInputValue)
    const [initialInput, setInitialInput] = useState<mongoProps[]>([])
    const { name, ...rest } = props
    useEffect(() => {
        if (initialData) return
        setTimeout(() => {
            const storedData = useInputStore.getState().inputData;
            const newData = Object.entries(storedData).map(([key, value]) => ({ key: key, value: value }))
            setInitialInput(newData as mongoProps[])
        }, 1);
        return () => setInitialInput([])
    }, [])
    const initialMemoData = useMemo<mongoProps[] | undefined>(() => {
        if (!initialData) return
        return Object.entries(initialData).map(([key, value]) => ({ key: key, value: value }))
    }, [initialData]);
    const noShowData = isArray(exclusionKeys) ? exclusionKeys.map((data) => camelCase(data)) : [camelCase(exclusionKeys)]
    // console.log('props is', props)
    return (
        <>
            {
                (initialMemoData || initialInput).map(({ key, value }) => {
                    if (!noShowData.includes(key)) {
                        // console.log('the value is')
                        if (typeof value == 'number') {
                            setTimeout(() => {
                                if (value == 0) setInputValue(key, "")
                            }, 1);
                            return (

                                <NumInput
                                    key={key}
                                    placeholder={fromCamelCase(key)}
                                    name={key}
                                    {...rest}
                                />
                            )
                        }
                        return (
                            <StrInput
                                key={key}
                                placeholder={fromCamelCase(key)}
                                name={key}
                                {...rest}
                            />
                        )
                    }
                })
            }
        </>
    )
}

export default memo(AutoInput)
// import React, { memo, useMemo } from 'react'
// import { useInputStore } from '../../../Hooks/useInputStore';
// import { camelCase, fromCamelCase } from '../../../Functions/camelCase';
// import NumInput from './NumInput'
// import StrInput from './StrInput';
// import { isArray } from '../../../Functions/dataTypesValidation';

// const AutoInput = ({ initialData, exceptionData, ...props }) => {
//     const setInputValue = useInputStore((state) => state.setInputValue)
//     const initialInput = useMemo(() => {
//         // const storedData = useInputStore.getState().inputData;
//         return Object.entries(initialData).map(([key, value]) => ({ key: key, value: value }))
//     }, [initialData]);
//     const noShowData = isArray(exceptionData) ? exceptionData.map((data) => camelCase(data)) : [camelCase(exceptionData)]
//     // console.log('props is', props)
//     return (
//         <>
//             {/* {console.log('initialInput is', noShowData)} */}
//             {
//                 initialInput.map(({ key, value }) => {
//                     if (!noShowData.includes(key)) {
//                         // console.log('the value is')
//                         if (typeof value == 'number') {
//                             setTimeout(() => {
//                                 if (value == 0) setInputValue(key, "")
//                             }, 1);
//                             return (
//                                 <NumInput key={key} placeholder={fromCamelCase(key)} name={key} onInputChange={props.onInputChange} sharedStyles={props.sharedStyles} />
//                             )
//                         }
//                         return (
//                             <StrInput key={key} placeholder={fromCamelCase(key)} name={key} onInputChange={props.onInputChange} sharedStyles={props.sharedStyles} />
//                         )
//                     }
//                 })
//             }
//         </>
//     )
// }

// export default memo(AutoInput)
