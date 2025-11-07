import React, { ComponentProps, memo, useLayoutEffect, useRef, useState } from 'react'
import { useInputStore } from 'src/hooks/useInputStore'

interface FullTemplateProps {
    name: string
    type: ComponentProps<'input'>['type']
    placeholder: string
    maxLength?: number
    onBlur?: (currentValue: string, allData: any) => void
    onEnterPress?: (currentValue: string, allData: any) => void
    disabled?: boolean
    value: string
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    containerStyles?: string
    inputStyles?: string
    placeholderStyles?: string
    bgColor: string
    sharedStyles?: {
        placeholderStyles?: string
        [key: string]: any
    }
}

type TemplateProps = Omit<FullTemplateProps, "sharedStyles" | "bgColor">

const InputTemplate: React.FC<TemplateProps> = ({
    name,
    type,
    placeholder,
    maxLength,
    value,
    onBlur = () => { },
    onEnterPress = () => { },
    disabled = false,
    handleChange = () => { },
    containerStyles = "",
    inputStyles = "",
    placeholderStyles = "",
    ...props
}) => {
    const pattern = /border-(\d+|\[([^\]]+)\])/
    const match = inputStyles.match(pattern)
    const dynamicHeight = match ? (match[2] ? match[2] : `${match[1]}px`) : undefined;
    const labelRef = useRef<any>("")
    const handlePreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const evalue = e.target.value
        if (maxLength && evalue.length == maxLength + 1) {
            return
        }
        handleChange(e)
    }
    const handleBlur = () => {
        const { inputData: data } = useInputStore.getState()
        onBlur(value, data)
    }
    const handleKeyPresses = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const { inputData: data } = useInputStore.getState()
            onEnterPress(value, data)
        }
    }
    const [labelWidth, setLabelWidth] = useState<number | null>(null);

    useLayoutEffect(() => {
        if (labelRef.current) {
            setLabelWidth(labelRef.current.offsetWidth);
        }
    }, [value, placeholder]);
    return (
        <div className={`relative w-full group ${containerStyles}`}>
            {/* {console.log('thev valueof ', placeholder, type)} */}
            <input
                type={type}
                id={`floating_input_${name}`}
                onBlur={handleBlur}
                value={value}
                maxLength={maxLength}
                onKeyDown={handleKeyPresses}
                onChange={handlePreInput}
                className={`py-2 px-2 border-2 w-full outline-none rounded-lg bg-transparent appearance-none peer ${inputStyles}`}
                placeholder=" "
                disabled={disabled}
                required
            />
            {labelWidth && (
                <div
                    className='absolute top-0 left-4 peer-focus:opacity-100 peer-placeholder-shown:opacity-0 transition-opacity duration-200'
                    style={{
                        height: dynamicHeight || 2,
                        width: labelWidth * 0.75 + 8,
                        backgroundColor: (props as FullTemplateProps).bgColor || 'white'
                    }}
                />
            )}
            <label
                ref={labelRef}
                htmlFor={`floating_input_${name}`}
                className={`
                    absolute left-5 duration-300 transform -translate-y-[20px] scale-75 top-2 origin-[0]
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                    peer-focus:scale-75 peer-focus:-translate-y-[20px]
                    ${(props as FullTemplateProps).sharedStyles?.placeholderStyles || ''} ${placeholderStyles}
                    `}
            >
                {placeholder}
            </label>
        </div>
    )
}

export default memo(InputTemplate)







// import React, { ComponentProps, memo, useRef } from 'react'
// import { useInputStore } from 'src/hooks/useInputStore'

// interface FullTemplateProps {
//     name: string
//     type: ComponentProps<'input'>['type']
//     placeholder: string
//     maxLength?: number
//     onEnterPress?: (data: any) => void
//     disabled?: boolean
//     value: string
//     handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     containerStyles?: string
//     inputStyles?: string
//     placeholderStyles?: string
//     bgColor: string
//     sharedStyles?: {
//         placeholderStyles?: string
//         [key: string]: any
//     }
// }

// type TemplateProps = Omit<FullTemplateProps, "sharedStyles" | "bgColor">

// const InputTemplate: React.FC<TemplateProps> = ({
//     name,
//     type,
//     placeholder,
//     maxLength,
//     value,
//     onEnterPress = () => { },
//     disabled = false,
//     handleChange = () => { },
//     containerStyles = "",
//     inputStyles = "",
//     placeholderStyles = "",
//     ...props
// }) => {
//     const pattern = /border-(\d+|\[([^\]]+)\])/
//     const match = inputStyles.match(pattern)
//     const dynamicHeight = match ? (match[2] ? match[2] : `${match[1]}px`) : undefined;
//     const labelRef = useRef<any>("")
//     const handlePreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const evalue = e.target.value
//         if (maxLength && evalue.length == maxLength + 1) {
//             return
//         }
//         handleChange(e)
//     }
//     const handleKeyPresses = (event: React.KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter') {
//             const { inputData: data } = useInputStore.getState()
//             onEnterPress(data)
//         }
//     }
//     return (
//         <div className={`relative w-full group ${containerStyles}`}>
//             {/* {console.log('thev valueof ', placeholder, type)} */}
//             <input
//                 type={type}
//                 id={`floating_input_${name}`}
//                 value={value}
//                 maxLength={maxLength}
//                 onKeyDown={handleKeyPresses}
//                 onChange={handlePreInput}
//                 className={`py-2 px-2 border-2 w-full outline-none rounded-lg bg-transparent appearance-none peer ${inputStyles}`}
//                 placeholder=" "
//                 disabled={disabled}
//                 required
//             />
//             <div
//                 className='absolute top-0 left-4 peer-focus:opacity-100 peer-placeholder-shown:opacity-0 transition-opacity duration-200'
//                 style={{
//                     height: dynamicHeight || 2,
//                     width: labelRef.current ? labelRef.current.offsetWidth * 0.75 + 8 : 'auto',
//                     backgroundColor: (props as FullTemplateProps).bgColor // 👈 dynamic bg color here
//                 }}
//             ></div>
//             <label
//                 ref={labelRef}
//                 htmlFor={`floating_input_${name}`}
//                 className={`absolute left-5 duration-300 transform -translate-y-[20px] scale-75 top-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[20px] ${(props as FullTemplateProps).sharedStyles?.placeholderStyles || ''} ${placeholderStyles}`}
//             >
//                 {placeholder}
//             </label>
//         </div>
//     )
// }

// export default memo(InputTemplate)