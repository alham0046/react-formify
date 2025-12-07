import { FC, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { isEmptyArray } from "src/functions/dataTypesValidation";
import { useInputStore } from "src/hooks/useInputStore";
import { StyleProp } from "src/typeDeclaration/stylesProps";
import { getNestedValue } from "src/Utils/inputStoreUtils";
// import { createPortal } from 'react-dom'
import { shallowOrDeepEqual } from "src/functions/shallowOrDeepEqual";
import OptionItem from "./OptionItem";


interface DropdownOption {
    label: string;
    value: string;
}
interface DropdownModalProps {
    options: DropdownOption[];
    onSelect: (value: string) => void;
    disabled: boolean;
    seachable: boolean;
    styles: StyleProp
    name?: string;
    onToggleDropdown?: (isOpen: boolean) => void;
    modalContainerRef?: React.RefObject<HTMLDivElement>;
    // You should typically pass the current value in as a prop for a controlled component
    initialValue?: string;
}

const DropdownModal: FC<DropdownModalProps> = ({
    options,
    onSelect,
    disabled,
    seachable,
    name,
    // inputStyles = '',
    styles,
    // dropdownStyles,
    // modalOffset = 0,
    onToggleDropdown,
    modalContainerRef,
    initialValue = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    // Use the initialValue prop for the controlled state
    // const [value, setValue] = useState<string>(initialValue);
    const value: string = useInputStore((state) => {
        return getNestedValue(state.inputData, name!) ?? '';
    });
    const [search, setSearch] = useState<string>('');
    const highlightIndexRef = useRef<number>(0);
    const optionRefs = useRef<HTMLDivElement[]>([]);
    const [position, setPosition] = useState<{
        top: number;
        left: number;
        width: number;
        direction: "up" | "down";
    } | null>(null);
    const inputRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null);

    // Sync external value changes if needed (useful if initialValue can change)
    // useEffect(() => {
    //     setValue(initialValue);
    // }, [initialValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = (selectedValue: string) => {
        // console.log('inside handleoptionclick', name)
        // setValue(selectedValue);
        onSelect(selectedValue);
        setIsOpen(false);
    }

    // 2. Stable click handler function for options
    const handleOptionSelect = (option: DropdownOption) => {
        // console.log('inside handleoptionselect', name)
        handleOptionClick(option.value);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log('inside handlsearchchange', name)
        setSearch(e.target.value)
        updateHighlight(0)
    }
    
    const filteredOptions = useMemo(() => {
        // console.log('inside filteredoptions', name)
        if (!search) return options;
        const lowered = search.toLowerCase();

        return options.filter((opt) => {
            const label = opt.label.toLowerCase();
            return label.indexOf(lowered) !== -1;
        });
        /////// ChatGPT says indexOf() is 30–40% faster than includes() and does not allocate regex objects.
        // return options.filter(option =>
        //     option.label.toLowerCase().includes(search.toLowerCase())
        // );
    }, [search, options]);

    const optionRefsCallback = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;

    // Get index from dataset
    const label = el.dataset.label;
    if (!label) return;

    // Find index ONCE
    const idx = filteredOptions.findIndex(o => o.label === label);
    if (idx !== -1) {
        optionRefs.current[idx] = el;
    }
}, [filteredOptions]);
    
    useLayoutEffect(() => {
        if (isOpen && modalRef.current) {
            // console.log('inside layouteffect', name)
            calculatePosition();
            updateHighlight(0);
        }
    }, [filteredOptions.length, isOpen]);



    const calculatePosition = () => {
        const inputRect = inputRef.current?.getBoundingClientRect();
        // Use document.documentElement.clientHeight for viewport height fallback
        const modalContainer = modalContainerRef?.current || document.documentElement;
        const modalRect = modalContainer.getBoundingClientRect();
        const dropdownRect = modalRef.current?.getBoundingClientRect()

        if (!inputRect || !dropdownRect) return;

        
        const spaceBelow = modalRect.bottom - inputRect.bottom;
        const spaceAbove = inputRect.top - modalRect.top;
        
        const direction =
        spaceBelow < spaceAbove
        ? "up"
        : "down";
        
        
        const scrollOffset = modalContainer === document.documentElement ? window.scrollY : 0;
        // console.log('calculted custom modal as', modalContainerRef?.current.getBoundingClientRect(), 'modal container height', modalContainer.clientHeight, 'space below is', spaceBelow, 'space above is', spaceAbove, 'calculated dropdown height as', dropdownRect, 'for options list height', inputRect, 'and direction is', direction);
        // console.log('inside calculate postion', name)
        const top = direction === "down"
            ? inputRect.bottom + scrollOffset + styles.dropdownOffset!
            : inputRect.top - dropdownRect.height + scrollOffset - styles.dropdownOffset!

        setPosition({
            left: inputRect.left,
            width: inputRect.width,
            top,
            direction,
        });
    };

    const toggleDropdown = () => {
        if (disabled || isEmptyArray(options)) return
        // console.log('inside toggle dropdown', name)
        onToggleDropdown?.(isOpen);
        const newState = !isOpen;
        setIsOpen(newState);

        if (newState) {
            highlightIndexRef.current = 0;
            setSearch('');
            setTimeout(() => {
                searchRef.current?.focus()
                updateHighlight(0);
            }, 10);
        }
        
        
    };

    /** update highlight without rerender */
    const updateHighlight = (newIndex: number) => {
        if (filteredOptions.length === 0) return; // <-- FIX
        const oldIndex = highlightIndexRef.current;
        if (oldIndex == newIndex) return
        // console.log('inside update highlight', name)
        
        // Remove highlight from old element
        optionRefs.current[oldIndex]?.classList.remove("bg-blue-100");
        // Add highlight to new element
        optionRefs.current[newIndex]?.classList.add("bg-blue-100");
        // Scroll the element into view
        optionRefs.current[newIndex]?.scrollIntoView({ block: "nearest" });
        
        highlightIndexRef.current = newIndex;
    };

    // keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        // console.log('inside handlekeydown', name)
        
        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = Math.min(
                highlightIndexRef.current + 1,
                filteredOptions.length - 1
            );
            updateHighlight(next);
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev = Math.max(highlightIndexRef.current - 1, 0);
            updateHighlight(prev);
        }

        if (e.key === "Enter") {
            e.preventDefault();
            const chosen = filteredOptions[highlightIndexRef.current];
            if (chosen) {
                handleOptionClick(chosen.value);
            }
        }

        if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.focus(); // Return focus to the main input
        }
    };

    const handleSelectOption = useCallback((opt : string) => {
        onSelect(opt);
    }, [onSelect]);


    // JSX for the dropdown panel, placed in a separate variable for portal usage
    const dropdownPanel = isOpen ? (
        <div
            className={`fixed z-10 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-hidden ${styles.modalBoxStyles}`}
            style={{
                top: position?.top,
                left: position?.left,
                width: position?.width,
            }}
            ref={modalRef}
            // Prevent outside click handler from firing when clicking the panel itself
            // onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {/* 🔍 Search box */}
            {
                seachable && (
                    <div className="p-2 border-b border-gray-200">
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Search..."
                            className="w-full px-3 py-1 border rounded-lg bg-gray-50 outline-none"
                            value={search}
                            onChange={handleSearchChange}
                            // Keep search input focused for typing
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                e.stopPropagation();
                                handleKeyDown(e);
                            }} // Listen for keyboard navigation here too
                        />
                    </div>
                )
            }
            <div className="max-h-48 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* No Options Found */}
                {
                    isEmptyArray(filteredOptions) ? (
                        <div className={`py-2 px-4 text-gray-500 ${styles.optionStyles}`}>
                            No options found.
                        </div>
                    ) : (
                        filteredOptions.map((option, index) => (
                            <OptionItem
                            key={option.value}
                            label={option.label}
                            isSelected={value === option.value}
                            isHighlighted = {highlightIndexRef.current === index}
                            name={name!}
                            optionClass={styles.optionStyles!}
                            onSelect={() => handleOptionSelect(option)}
                            ref={optionRefsCallback}
                            // ref={(el) => {
                            //     if (el) optionRefs.current[index] = el;
                            // }}
                        />
                        ))
                    )
                }
            </div>
        </div>
    ) : null;

    // Determine the portal target (document.body is the safest default)
    const portalTarget = document.body;

    return (
        <div
            ref={inputRef}
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            tabIndex={0} // Makes the div focusable for keyboard navigation
            className={`py-2 px-2 relative border-2 w-full h-12 flex justify-between items-center rounded-lg outline-none bg-transparent cursor-pointer ${styles.inputStyles}`}
        >
            {/* {console.log('rendering dropdown modal with options', name, value, isOpen, search, position)} */}
            <span>{options.find((opt) => opt.value === value)?.label || 'Select an Option'}</span>
            <svg
                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>

            {/* 1. Use createPortal to render the dropdown outside the component's DOM */}
            {isOpen && portalTarget && dropdownPanel}
            {/* {isOpen && portalTarget && createPortal(dropdownPanel, portalTarget)} */}
        </div>
    )
}

export default memo(DropdownModal, (prev, next) => shallowOrDeepEqual(prev.options, next.options))
// export default memo(DropdownModal)
// export default memo(DropdownModal, (prev, next) => isEqual(prev.options, next.options))













// import React, { FC, memo, RefObject, useEffect, useMemo, useRef, useState } from 'react'
// import { isEmptyArray } from '../../../Functions/dataTypesValidation';
// import { createPortal } from 'react-dom'; // 1. Imported createPortal

// interface DropdownOption {
//     label: string;
//     value: string;
// }
// interface DropdownStyles {
//     modalBoxStyles?: string
//     optionBoxStyles?: string
//     optionStyles?: string
// }
// interface DropdownModalProps {
//     options: DropdownOption[];
//     onSelect: (value: string) => void;
//     disabled: boolean;
//     seachable: boolean;
//     inputStyles?: string;
//     dropdownStyles?: DropdownStyles
//     name?: string;
//     onToggleDropdown?: (isOpen: boolean) => void;
//     modalContainerRef?: React.RefObject<HTMLDivElement>;
//     // You should typically pass the current value in as a prop for a controlled component
//     initialValue?: string;
// }

// const DropdownModal: FC<DropdownModalProps> = ({
//     options,
//     onSelect,
//     disabled,
//     seachable,
//     name,
//     inputStyles = '',
//     dropdownStyles,
//     onToggleDropdown,
//     modalContainerRef,
//     initialValue = ''
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     // Use the initialValue prop for the controlled state
//     const [value, setValue] = useState<string>(initialValue);
//     const [search, setSearch] = useState<string>('');
//     const highlightIndexRef = useRef<number>(0);
//     const optionRefs = useRef<HTMLDivElement[]>([]);
//     const [position, setPosition] = useState<{
//         top: number;
//         left: number;
//         width: number;
//         direction: "up" | "down";
//     } | null>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const searchRef = useRef<HTMLInputElement>(null);

//     // Sync external value changes if needed (useful if initialValue can change)
//     useEffect(() => {
//         setValue(initialValue);
//     }, [initialValue]);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const handleOptionClick = (selectedValue: string) => {
//         setValue(selectedValue);
//         onSelect(selectedValue);
//         setIsOpen(false);
//     }

//     // 2. Stable click handler function for options
//     const handleOptionSelect = (option: DropdownOption) => {
//         handleOptionClick(option.value);
//     }

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearch(e.target.value)
//         highlightIndexRef.current = 0;
//     }

//     const filteredOptions = useMemo(() => {
//         if (!search) return options;
//         return options.filter(option =>
//             option.label.toLowerCase().includes(search.toLowerCase())
//         );
//     }, [search, options]);

//     // Recalculate position on filter change if dropdown is open
//     useEffect(() => {
//         if (isOpen) {
//             calculatePosition();
//             // Reset highlight index on filtering
//             updateHighlight(0);
//         }
//     }, [filteredOptions.length, isOpen])


//     const calculatePosition = () => {
//         const inputRect = containerRef.current?.getBoundingClientRect();
//         // Use document.documentElement.clientHeight for viewport height fallback
//         const modalContainer = modalContainerRef?.current || document.documentElement;
//         const modalRect = modalContainer.getBoundingClientRect();

//         if (!inputRect) return;

//         // Max height of the dropdown list container
//         const dropdownMaxHeight = 250;
//         // Height of all rendered options (40px per option + padding/border estimate)
//         // A better calculation might be to render the options off-screen first to measure
//         const optionsListHeight = !isEmptyArray(filteredOptions) ? filteredOptions.length * 40 : 40
//         const dropdownHeight = Math.min(dropdownMaxHeight, optionsListHeight + (seachable ? 40 : 0)); // +40 for search bar height

//         // console.log('calculated dropdown height as', dropdownHeight, 'for options list height', optionsListHeight);

//         const spaceBelow = modalContainer.clientHeight - inputRect.bottom;
//         const spaceAbove = inputRect.top - modalRect.top;

//         const direction =
//             spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
//                 ? "up"
//                 : "down";
        
//         const multiFactor = direction === "down" ? 1 : -1;

//         const scrollOffset = modalContainer === document.documentElement ? window.scrollY : 0;

//         const topRaw = direction === "down"
//             ? inputRect.bottom + scrollOffset + 4
//             : inputRect.top + scrollOffset - dropdownHeight - 4;

//         setPosition({
//             left: inputRect.left,
//             width: inputRect.width,
//             top: seachable ? topRaw + (12*multiFactor) : topRaw, // Adjust for search bar height
//             direction,
//         });
//     };

//     const toggleDropdown = () => {
//         if (disabled || isEmptyArray(options)) return
//         onToggleDropdown && onToggleDropdown(isOpen);
//         const newState = !isOpen;

//         if (newState) {
//             calculatePosition();
//             highlightIndexRef.current = 0;
//             // Reset search when opening
//             setSearch('');
//         }

//         setIsOpen(newState);

//         if (newState) {
//             // Focus search input after state transition
//             setTimeout(() => {
//                 searchRef.current?.focus()
//                 updateHighlight(0);
//             }, 10);
//         }
//     };

//     /** update highlight without rerender */
//     const updateHighlight = (newIndex: number) => {
//         if (filteredOptions.length === 0) return; // <-- FIX
//         const oldIndex = highlightIndexRef.current;

//         // Remove highlight from old element
//         optionRefs.current[oldIndex]?.classList.remove("bg-blue-100");
//         // Add highlight to new element
//         optionRefs.current[newIndex]?.classList.add("bg-blue-100");
//         // Scroll the element into view
//         optionRefs.current[newIndex]?.scrollIntoView({ block: "nearest" });

//         highlightIndexRef.current = newIndex;
//     };

//     // keyboard navigation
//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (!isOpen) return;

//         if (e.key === "ArrowDown") {
//             e.preventDefault();
//             const next = Math.min(
//                 highlightIndexRef.current + 1,
//                 filteredOptions.length - 1
//             );
//             updateHighlight(next);
//         }

//         if (e.key === "ArrowUp") {
//             e.preventDefault();
//             const prev = Math.max(highlightIndexRef.current - 1, 0);
//             updateHighlight(prev);
//         }

//         if (e.key === "Enter") {
//             e.preventDefault();
//             const chosen = filteredOptions[highlightIndexRef.current];
//             if (chosen) {
//                 handleOptionClick(chosen.value);
//             }
//         }

//         if (e.key === "Escape") {
//             setIsOpen(false);
//             containerRef.current?.focus(); // Return focus to the main input
//         }
//     };

//     // JSX for the dropdown panel, placed in a separate variable for portal usage
//     const dropdownPanel = isOpen && position ? (
//         <div
//             className={`fixed z-10 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-hidden ${dropdownStyles?.modalBoxStyles || ""}`}
//             style={{
//                 top: position.top,
//                 left: position.left,
//                 width: position.width,
//                 // Adjust margin based on direction
//                 // marginTop: position.direction === "up" ? -4 : 4,
//             }}
//             // Prevent outside click handler from firing when clicking the panel itself
//             // onClick={(e) => e.stopPropagation()}
//             onMouseDown={(e) => e.stopPropagation()}
//         >
//             {/* 🔍 Search box */}
//             {
//                 seachable && (
//                     <div className="p-2 border-b border-gray-200">
//                         <input
//                             ref={searchRef}
//                             type="text"
//                             placeholder="Search..."
//                             className="w-full px-3 py-1 border rounded-lg bg-gray-50 outline-none"
//                             value={search}
//                             onChange={handleSearchChange}
//                             // Keep search input focused for typing
//                             onClick={(e) => e.stopPropagation()}
//                             onKeyDown={handleKeyDown} // Listen for keyboard navigation here too
//                         />
//                     </div>
//                 )
//             }
//             <div className="max-h-48 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//                 {/* No Options Found */}
//                 {
//                     isEmptyArray(filteredOptions) ? (
//                         <div className="py-2 px-4 text-gray-500">
//                             No options found.
//                         </div>
//                     ) : (
//                         filteredOptions.map((option, index) => (
//                             <div
//                                 key={option.value}
//                                 onClick={() => handleOptionSelect(option)} // 2. Stable click handler
//                                 ref={(el) => {
//                                     if (el) optionRefs.current[index] = el;
//                                 }}
//                                 className={`
//                                     py-2 px-4 cursor-pointer hover:bg-blue-200
//                                     ${value === option.value ? 'text-blue-700 font-medium' : ''}
//                                     ${highlightIndexRef.current === index ? 'bg-blue-100' : ''} 
//                                 `}
//                             >
//                                 {option.label}
//                             </div>
//                         ))
//                     )
//                 }
//             </div>
//         </div>
//     ) : null;

//     // Determine the portal target (document.body is the safest default)
//     const portalTarget = document.body;

//     return (
//         <div
//             ref={containerRef}
//             onClick={toggleDropdown}
//             onKeyDown={handleKeyDown}
//             tabIndex={0} // Makes the div focusable for keyboard navigation
//             className={`py-2 px-2 relative border-2 w-full h-12 flex justify-between items-center rounded-lg outline-none bg-transparent cursor-pointer ${inputStyles}`}
//         >
//             {console.log('rendering dropdown modal with options', options, name)}
//             <span>{options.find((opt) => opt.value === value)?.label || 'Select an Option'}</span>
//             <svg
//                 className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//             >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//             </svg>

//             {/* 1. Use createPortal to render the dropdown outside the component's DOM */}
//             {isOpen && portalTarget && createPortal(dropdownPanel, portalTarget)}
//         </div>
//     )
// }

// export default memo(DropdownModal)







// import React, { FC, memo, RefObject, useEffect, useMemo, useRef, useState } from 'react'
// import { useInputStore } from '../../../Hooks/useInputStore';
// import { isEmptyArray } from '../../../Functions/dataTypesValidation';
// import { createPortal } from 'react-dom';
// import Options from './Options';

// interface DropdownOption {
//     label: string;
//     value: string;
// }
// interface DropdownModalProps {
//     options: DropdownOption[];
//     // containerRef: RefObject<HTMLDivElement>;
//     onSelect: (value: string) => void;
//     disabled: boolean;
//     seachable: boolean;
//     inputStyles?: string;
//     name?: string;
//     onToggleDropdown?: (isOpen: boolean) => void;
//     modalContainerRef?: React.RefObject<HTMLDivElement>;
// }

// const DropdownModal: FC<DropdownModalProps> = ({
//     options,
//     // containerRef,
//     onSelect,
//     disabled,
//     seachable,
//     name,
//     inputStyles = '',
//     onToggleDropdown,
//     modalContainerRef
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [value, setValue] = useState<string>('')
//     const [search, setSearch] = useState<string>('')
//     // const [highlightIndex, setHighlightIndex] = useState<number>(0);
//     const highlightIndexRef = useRef<number>(0);
//     /** DOM refs for each option */
//     const optionRefs = useRef<HTMLDivElement[]>([]);
//     const [position, setPosition] = useState<{
//         top: number;
//         left: number;
//         width: number;
//         direction: "up" | "down";
//     } | null>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const searchRef = useRef<HTMLInputElement>(null);
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);
//     const handleOptionClick = (selectedValue: string) => {
//         console.log('option clicked', selectedValue)
//         setValue(selectedValue);
//         onSelect(selectedValue);
//         setIsOpen(false);
//     }

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearch(e.target.value)
//         highlightIndexRef.current = 0;
//         // setHighlightIndex(0);
//         // const searchValue = e.target.value
//     }

//     const filteredOptions = useMemo(() => {
//         if (!search) return options;
//         return options.filter(option =>
//             option.label.toLowerCase().includes(search.toLowerCase())
//         );
//     }, [search, options]);
//     // useEffect(() => { console.log('the isopen value is', isOpen) }, [isOpen])
//     const toggleDropdown = () => {
//         if (disabled || isEmptyArray(options)) return
//         onToggleDropdown && onToggleDropdown(isOpen);
//         const newState = !isOpen;
//         if (newState) {
//             calculatePosition();
//         }
//         setIsOpen(newState);
//         if (newState) {
//             // focus search input after opening
//             setTimeout(() => {
//                 highlightIndexRef.current = 0;
//                 updateHighlight(0);
//                 // setHighlightIndex(0)
//                 searchRef.current?.focus()
//             }, 10);
//         }
//     };

//     /** update highlight without rerender */
//     const updateHighlight = (newIndex: number) => {
//         const oldIndex = highlightIndexRef.current;

//         optionRefs.current[oldIndex]?.classList.remove("bg-blue-100");
//         optionRefs.current[newIndex]?.classList.add("bg-blue-100");
//         optionRefs.current[newIndex]?.scrollIntoView({ block: "nearest" });

//         highlightIndexRef.current = newIndex;
//     };

//     const calculatePosition = () => {
//         const inputRect = containerRef.current?.getBoundingClientRect();
//         const modalRect = modalContainerRef?.current?.getBoundingClientRect();

//         if (!inputRect || !modalRect) return;

//         const dropdownHeight = Math.min(250, filteredOptions.length * 45);

//         const spaceBelow = modalRect.bottom - inputRect.bottom;
//         const spaceAbove = inputRect.top - modalRect.top;

//         const direction =
//             spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
//                 ? "up"
//                 : "down";

//         setPosition({
//             left: inputRect.left,
//             width: inputRect.width,
//             top:
//                 direction === "down"
//                     ? inputRect.bottom
//                     : inputRect.top - dropdownHeight,
//             direction,
//         });
//     };

//     // keyboard navigation
//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (!isOpen) return;

//         if (e.key === "ArrowDown") {
//             e.preventDefault();
//             // highlightIndexRef.current += (highlightIndexRef.current < filteredOptions.length - 1) ? 1 : 0;
//             const next = Math.min(
//                 highlightIndexRef.current + 1,
//                 filteredOptions.length - 1
//             );
//             updateHighlight(next);
//             // setHighlightIndex((prev) =>
//             //     prev < filteredOptions.length - 1 ? prev + 1 : prev
//             // );
//         }

//         if (e.key === "ArrowUp") {
//             e.preventDefault();
//             // highlightIndexRef.current -= (highlightIndexRef.current > 0) ? 1 : 0;
//             const prev = Math.max(highlightIndexRef.current - 1, 0);
//             updateHighlight(prev);
//             // setHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0));
//         }

//         if (e.key === "Enter") {
//             e.preventDefault();
//             // const chosen = filteredOptions[highlightIndex];
//             const chosen = filteredOptions[highlightIndexRef.current];
//             if (chosen) {
//                 handleOptionClick(chosen.value);
//             }
//         }
//     };
//     return (
//         <div
//             ref={containerRef}
//             onClick={(e) => {
//                 e.stopPropagation();  // prevent closing on option click bubbling
//                 toggleDropdown();
//             }}
//             onKeyDown={handleKeyDown}
//             tabIndex={0}
//             className={`py-2 px-2 relative border-2 w-full h-12 flex justify-between items-center rounded-lg outline-none bg-transparent cursor-pointer ${inputStyles}`}
//         >
//             {console.log('rendering dropdown modal with options', options, name)}
//             <span>{options.find((opt) => opt.value === value)?.label || ''}</span>
//             <svg
//                 className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//             >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//             </svg>
//             {
//                 isOpen && filteredOptions && (
//                     <div
//                         className="fixed z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden"
//                         style={{
//                             top: position?.top,
//                             left: position?.left,
//                             width: position?.width,
//                             marginTop: position?.direction === "up" ? -4 : 4,
//                         }}
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* 🔍 Search box */}
//                         {
//                             seachable ? (
//                                 <div className="p-2 border-b border-gray-200">
//                                     <input
//                                         ref={searchRef}
//                                         type="text"
//                                         placeholder="Search..."
//                                         className="w-full px-3 py-1 border rounded-lg bg-gray-50 outline-none"
//                                         // value={search}
//                                         onChange={handleSearchChange}
//                                         onClick={(e) => e.stopPropagation()}
//                                     />
//                                 </div>
//                             ) : null
//                         }
//                         <div className="max-h-48 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//                             {
//                                 isEmptyArray(filteredOptions) ? (
//                                     <div className="p-4 text-gray-500">
//                                         No options found.
//                                     </div>
//                                 ) : null
//                             }
//                             {filteredOptions.map((option, index) => (
//                                 <div
//                                     key={option.value}
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleOptionClick(option.value)
//                                     }}
//                                     ref={(el) => {
//                                         if (el) optionRefs.current[index] = el;
//                                     }}

//                                     className={`
//                                         py-2 px-4 hover:bg-blue-200
//                                         ${value === option.value ? 'text-blue-700 font-medium pointer-events-none' : ''}
//                                     `}
//                                 >
//                                     {option.label}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     // , document.body
//                 )
//             }
//         </div>
//     )
// }

// export default memo(DropdownModal)



// <Options
//     handleOptionClick={handleOptionClick}
//     index={index}
//     name={name}
//     optionLabel={option.label}
//     optionValue={option.value}
//     value={value}
//     highlightIndexRef={highlightIndexRef}
// />













// import React, { FC, memo, RefObject, useEffect, useMemo, useRef, useState } from 'react'
// import { useInputStore } from '../../../Hooks/useInputStore';
// import { isEmptyArray } from '../../../Functions/dataTypesValidation';

// interface DropdownOption {
//     label: string;
//     value: string;
// }
// interface DropdownModalProps {
//     options: DropdownOption[];
//     // containerRef: RefObject<HTMLDivElement>;
//     onSelect: (value: string) => void;
//     disabled: boolean;
//     seachable: boolean;
//     inputStyles?: string;
//     onToggleDropdown?: (isOpen: boolean) => void;
// }

// const DropdownModal: FC<DropdownModalProps> = ({
//     options,
//     // containerRef,
//     onSelect,
//     disabled,
//     seachable,
//     inputStyles = '',
//     onToggleDropdown,
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [value, setValue] = useState<string>('')
//     const [search, setSearch] = useState<string>('')
//     const [highlightIndex, setHighlightIndex] = useState<number>(0);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const searchRef = useRef<HTMLInputElement>(null);
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);
//     const handleOptionClick = (selectedValue: string) => {
//         setValue(selectedValue);
//         onSelect(selectedValue);
//         setIsOpen(false);
//     }

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearch(e.target.value)
//         setHighlightIndex(0);
//         // const searchValue = e.target.value
//     }

//     const filteredOptions = useMemo(() => {
//         if (!search) return options;
//         return options.filter(option =>
//             option.label.toLowerCase().includes(search.toLowerCase())
//         );
//     }, [search, options]);
//     // useEffect(() => { console.log('the isopen value is', isOpen) }, [isOpen])
//     const toggleDropdown = () => {
//         if (disabled || isEmptyArray(options)) return
//         onToggleDropdown && onToggleDropdown(isOpen);
//         const newState = !isOpen;
//         setIsOpen(newState);
//         if (newState) {
//             // focus search input after opening
//             setTimeout(() => {
//                 setHighlightIndex(0)
//                 searchRef.current?.focus()
//             }, 10);
//         }
//     };

//     // const calculatePosition = () => {
//     //     const rect = containerRef.current?.getBoundingClientRect();
//     //     if (!rect) return;

//     //     const spaceBelow = window.innerHeight - rect.bottom;
//     //     const spaceAbove = rect.top;

//     //     const dropdownHeight = Math.min(250, filteredOptions.length * 45);

//     //     const direction = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
//     //         ? "up"
//     //         : "down";

//     //     setPosition({
//     //         left: rect.left,
//     //         width: rect.width,
//     //         top: direction === "down" ? rect.bottom : rect.top - dropdownHeight,
//     //         direction,
//     //     });
//     // };

//     // keyboard navigation
//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (!isOpen) return;

//         if (e.key === "ArrowDown") {
//             e.preventDefault();
//             setHighlightIndex((prev) =>
//                 prev < filteredOptions.length - 1 ? prev + 1 : prev
//             );
//         }

//         if (e.key === "ArrowUp") {
//             e.preventDefault();
//             setHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0));
//         }

//         if (e.key === "Enter") {
//             e.preventDefault();
//             const chosen = filteredOptions[highlightIndex];
//             if (chosen) {
//                 handleOptionClick(chosen.value);
//             }
//         }
//     };
//     return (
//         <div
//             ref={containerRef}
//             onClick={toggleDropdown}
//             onKeyDown={handleKeyDown}
//             tabIndex={0}
//             className={`py-2 px-2 relative border-2 w-full h-12 flex justify-between items-center rounded-lg outline-none bg-transparent cursor-pointer ${inputStyles}`}
//         >
//             {console.log('rendering dropdown modal with options')}
//             <span>{options.find((opt) => opt.value === value)?.label || ''}</span>
//             <svg
//                 className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//             >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//             </svg>
//             {
//                 isOpen && filteredOptions && (
//                     <div
//                         // className="absolute z-10 left-0 top-full mt-1 w-full bg-white border-gray-300 border rounded-lg shadow-lg max-h-48 overflow-y-auto"
//                         className="absolute left-0 z-10 top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* 🔍 Search box */}
//                         {
//                             seachable ? (
//                                 <div className="p-2 border-b border-gray-200">
//                                     <input
//                                         ref={searchRef}
//                                         type="text"
//                                         placeholder="Search..."
//                                         className="w-full px-3 py-1 border rounded-lg bg-gray-50 outline-none"
//                                         // value={search}
//                                         onChange={handleSearchChange}
//                                         onClick={(e) => e.stopPropagation()}
//                                     />
//                                 </div>
//                             ) : null
//                         }
//                         <div className="max-h-48 overflow-y-auto">
//                             {
//                                 isEmptyArray(filteredOptions) ? (
//                                     <div className="p-4 text-gray-500">
//                                         No options found.
//                                     </div>
//                                 ) : null
//                             }
//                             {filteredOptions.map((option, index) => (
//                                 <div
//                                     key={option.value}
//                                     onClick={() => handleOptionClick(option.value)}
//                                     className={`
//                                         ${(highlightIndex == index) ? 'bg-blue-100' : ''} py-2 px-4 hover:bg-blue-200
//                                         ${value === option.value ? 'text-blue-700 font-medium pointer-events-none' : ''}
//                                     `}
//                                 >
//                                     {option.label}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )
//             }
//         </div>
//     )
// }

// export default memo(DropdownModal)
