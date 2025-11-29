import React, { FC, memo, useEffect } from 'react';
import PickDate from './PickDate';
import { getDate } from 'src/functions/dateHelper';
import { useInputStore } from 'src/hooks/useInputStore';
import InputTemplate from './InputTemplate';
import { FullInputProps, InputProps } from 'src/typeDeclaration/inputProps';
import { useComputedExpression } from 'src/hooks/useComputedExpression';

// interface FullDateInputProps {
//     placeholder: string;
//     onDateSelect: (date: string) => void;
//     name: string;
//     defaultDate: string;
//     containerStyles: string
//     inputStyles: string
//     placeholderStyles: string
//     onInputChange: (name: string, date: string) => void;
//     isArrayObject?: boolean;
//     arrayData?: {
//         arrayName: string;
//         arrayIndex: number;
//     };
// }

// type DateInputProps = Omit<FullDateInputProps, "onInputChange" | "isArrayObject" | "arrayData">
interface DateProps extends InputProps {
    onDateSelect: (date: string) => {}
    defaultTodayDate: boolean
    defaultDate: string
}

const DateInput: FC<DateProps> = ({
    placeholder,
    onDateSelect,
    onEnterPress = () => { },
    defaultTodayDate = true,
    disabled = false,
    hideElement = false,
    containerStyles = "",
    inputStyles = "",
    placeholderStyles = "",
    defaultDate,
    name,
    ...props
}) => {
    const todayDate = new Date().toLocaleDateString()
    const initialDate = defaultTodayDate ? getDate(todayDate)?.getFormat('dd-mm-yyyy') || "" : defaultDate || ""
    const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        (props as FullInputProps).onInputChange(name!, newDate)
        onDateSelect(newDate)
    };

    const value = useInputStore(
        (state) => {
            if ((props as FullInputProps).isArrayObject) {
                const arrData = (props as FullInputProps).arrayData!
                return (
                    state.inputData[arrData.arrayName]?.[arrData.arrayIndex]?.[name!] ?? ""
                )
            }
            return state.inputData[name!] || initialDate
        }
    )
    const disabledValue: boolean = useComputedExpression(disabled)

    const hiddenValue: boolean = useComputedExpression(hideElement)
    useEffect(() => {
        // console.log('today date is', todayDate)
        setTimeout(() => {
            (props as FullInputProps).onInputChange(name!, initialDate)
            onDateSelect(initialDate)
        }, 1);
    }, [])

    return (
        <>
            <InputTemplate
                name={name!}
                value={value}
                handleChange={handleDateSelect}
                onEnterPress={onEnterPress}
                placeholder={placeholder}
                disabled={disabledValue}
                hideElement={hiddenValue}
                type='date'
                containerStyles={containerStyles}
                inputStyles={inputStyles}
                placeholderStyles={placeholderStyles}
                {...props}
            />
        </>
    );
};

export default memo(DateInput);
{/* <div className="relative w-full group border-2 rounded-lg">
    <input
        type="date"
        value={value}
        // defaultValue={initialDate}
        onChange={e => handleDateSelect(e.target.value)}
        id='customDate'
        className={'py-2 px-2 w-max bg-transparent appearance-none peer'} />
    <label
        htmlFor={'customDate'}
        className="absolute left-5 px-1 bg-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[85%] peer-focus:-translate-y-6"
        >
        {placeholder}
    </label>
</div> */}
{/* <PickDate onDateSelect={handleDateSelect} id={'customDate'} dateStyles={'py-2 px-2 w-full bg-transparent appearance-none peer'} /> */ }