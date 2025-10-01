import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
// import { useInputStore } from 'src/hooks/useInputStore';

interface SelectOption {
    label: string;
    value: string;
}

interface FullTemplateProps {
    name: string;
    placeholder: string;
    options: SelectOption[];
    value: string;
    onSelect: (value: string) => void;
    disabled?: boolean;
    containerStyles?: string;
    inputStyles?: string;
    placeholderStyles?: string;
    bgColor: string;
    sharedStyles?: {
        placeholderStyles?: string;
        [key: string]: any;
    };
}

interface TemplateProps extends Omit<FullTemplateProps, 'sharedStyles' | 'bgColor'> {
    makeEmptyDisabled?: boolean
}

// type TemplateProps = Omit<FullTemplateProps, 'sharedStyles' | 'bgColor'>;

const SelectTemplate: React.FC<TemplateProps> = ({
    name,
    placeholder,
    options,
    value,
    onSelect,
    disabled = false,
    containerStyles = '',
    inputStyles = '',
    placeholderStyles = '',
    makeEmptyDisabled = false,
    ...props
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const labelRef = useRef<any>(null);
    const [labelWidth, setLabelWidth] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        if (!disabled) setIsOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useLayoutEffect(() => {
        if (labelRef.current) {
            // console.log('logging layout')
            setLabelWidth(labelRef.current.offsetWidth);
        }
    }, []);
    // }, [value, placeholder]);

    return (
        <div ref={containerRef} className={`relative w-full group ${containerStyles}`}>
            {/* {console.log('here is select input is')} */}
            <div
                onClick={toggleDropdown}
                className={`py-2 px-2 border-2 w-full h-12 flex justify-between items-center rounded-lg outline-none bg-transparent cursor-pointer ${inputStyles}`}
            >
                <span>{options.find((opt) => opt.value === value)?.label || ''}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>

            {labelWidth && (
                <div
                    className="absolute top-0 left-4 peer-focus:opacity-100 transition-opacity duration-200"
                    style={{
                        height: 2,
                        width: labelWidth * 0.75 + 8,
                        backgroundColor: (props as FullTemplateProps).bgColor || 'white',
                    }}
                />
            )}
            <label
                ref={labelRef}
                htmlFor={`floating_select_${name}`}
                className={`
                    absolute left-5 duration-300 transform -translate-y-[20px] scale-75 top-2 origin-[0]
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                    peer-focus:scale-75 peer-focus:-translate-y-[20px]
                    ${placeholderStyles} ${(props as FullTemplateProps).sharedStyles?.placeholderStyles || ''}
                `}
            >
                {placeholder}
            </label>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border-gray-300 border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => {
                                onSelect(option.value);
                                setIsOpen(false);
                            }}
                            // className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            className={`
                                ${(option.value == "" && makeEmptyDisabled) ? '' : 'cursor-pointer hover:bg-gray-200'} py-2 px-4
                                ${value === option.value ? 'bg-blue-100 text-blue-700 font-medium' : ''}
                            `}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default React.memo(SelectTemplate);