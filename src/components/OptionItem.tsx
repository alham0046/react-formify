// OptionItem.tsx
import React, { memo, forwardRef, useCallback } from "react";
import { shallowOrDeepEqual } from "src/functions/shallowOrDeepEqual";

interface Props {
    label: string;
    isSelected: boolean;
    onSelect: () => void;
    isHighlighted : boolean
    optionClass: string;
    name : string
}

const OptionItem = forwardRef<HTMLDivElement, Props>(
    ({label, isSelected, isHighlighted, name, onSelect, optionClass}, ref) => {
        const handleClick = useCallback(() => {
            onSelect()
        },[onSelect])
        return (
            <div
                ref={ref}
                data-label={label}
                onClick={handleClick}
                className={`
                    py-2 px-4 cursor-pointer hover:bg-blue-200
                    ${isSelected ? "text-blue-700 font-medium" : ""}
                    ${isHighlighted ? 'bg-blue-100' : ''}
                    ${optionClass}
                `}
            >
                {/* {console.log('the options redering', label, isSelected, isHighlighted, name, optionClass)} */}
                {label}
            </div>
        );
    }
);

export default memo(OptionItem, (prev, next) => shallowOrDeepEqual(prev.optionClass, next.optionClass));
