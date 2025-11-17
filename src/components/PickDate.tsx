import React, { FC, memo, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getYear, getMonth, format } from 'date-fns';

interface PickDateProps {
    onDateSelect: (date: string) => void;
    dateStyles: string;
    id: string;
}

const PickDate: FC<PickDateProps> = ({ onDateSelect, dateStyles, id }) => {
    const todayDate: Date = new Date();
    const [startDate, setStartDate] = useState<Date>(todayDate);

    useEffect(() => {
        onDateSelect(format(todayDate, 'yyyy-MM-dd'));
    }, [onDateSelect]);

    const range = (start: number, end: number, step: number = 1): number[] => {
        let output: number[] = [];
        for (let i = start; i < end; i += step) {
            output.push(i);
        }
        return output;
    };

    const years: number[] = range(1990, getYear(todayDate) + 1);
    
    const months: string[] = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const handleDateChange = (date: Date | null): void => {
        if (date) {
            setStartDate(date);
            // console.log('the value of original date is', date);
            onDateSelect(format(date, 'yyyy-MM-dd'));
        }
    };

    return (
        <DatePicker
            className={dateStyles}
            id={id}
            renderCustomHeader={({ 
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled 
            }) => (
                <div className='flex items-center justify-center my-2 gap-1'>
                    <button onClick={decreaseMonth} className='border py-[1px] px-1 bg-indigo-200' disabled={prevMonthButtonDisabled}>
                        {"<"}
                    </button>
                    <select
                        className='border bg-white'
                        value={getYear(date)}
                        onChange={({ target: { value } }) => changeYear(Number(value))}
                    >
                        {years.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <select
                        className='border bg-white'
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) =>
                            changeMonth(months.indexOf(value))
                        }
                    >
                        {months.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <button onClick={increaseMonth} className='border py-[1px] px-1 bg-indigo-200' disabled={nextMonthButtonDisabled}>
                        {">"}
                    </button>
                </div>
            )}
            selected={startDate}
            onChange={handleDateChange}
            dateFormat={"dd/MM/yyyy"}
            maxDate={todayDate}
        />
    );
};

export default memo(PickDate);