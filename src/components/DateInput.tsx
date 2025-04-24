import React, { FC, memo } from 'react';
import PickDate from './PickDate';

interface DateInputProps {
  placeholder: string;
  onDateSelect: (date: string) => void;
  name: string;
  onInputChange: (name: string, date: string) => void;
}

const DateInput: FC<DateInputProps> = ({ placeholder, onDateSelect, name, ...props }) => {
    const handleDateSelect = (date: string): void => {
        props.onInputChange(name, date);
        onDateSelect(date);
    };

    return (
        <div className="relative w-full group border-2 rounded-lg">
            <PickDate 
                onDateSelect={handleDateSelect} 
                id={'customDate'} 
                dateStyles={'py-2 px-2 w-full bg-transparent appearance-none peer'} 
            />
            <label
                htmlFor={'customDate'}
                className="absolute left-5 px-1 bg-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[85%] peer-focus:-translate-y-6"
            >
                {placeholder}
            </label>
        </div>
    );
};

export default memo(DateInput);