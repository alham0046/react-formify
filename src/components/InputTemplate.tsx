import React, { ComponentProps, memo } from 'react'

interface FullTemplateProps {
    name: string
    type: ComponentProps<'input'>['type']
    placeholder: string
    value: string
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    containerStyles?: string
    inputStyles?: string
    placeholderStyles?: string
    sharedStyles?: {
        placeholderStyles?: string
        [key: string]: any
    }
}

type TemplateProps = Omit<FullTemplateProps, "childStyles">

const InputTemplate: React.FC<TemplateProps> = ({
    name,
    type,
    placeholder,
    value,
    handleChange,
    containerStyles = "",
    inputStyles = "",
    placeholderStyles = "",
    ...props
}) => {
    return (
        <div className={`relative w-full group ${containerStyles}`}>
            {/* {console.log('thev valueof ', placeholder, type)} */}
            <input
                type={type}
                id={`floating_input_${name}`}
                value={value}
                onChange={handleChange}
                className={`py-2 px-2 border-2 w-full rounded-lg bg-transparent appearance-none peer ${inputStyles}`}
                placeholder=" "
                required
            />
            <label
                htmlFor={`floating_input_${name}`}
                className={`absolute left-5 px-1 bg-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[85%] peer-focus:-translate-y-6 ${props.sharedStyles?.placeholderStyles || ''} ${placeholderStyles}`}
            >
                {placeholder}
            </label>
        </div>
    )
}

export default memo(InputTemplate)
