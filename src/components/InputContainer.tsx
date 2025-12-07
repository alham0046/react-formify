import React, { FC, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from 'react'
import { memo } from 'react'
import { useInputStore } from '../hooks/useInputStore'
import { camelCase } from 'src/functions/camelCase';
import { flattenChildren } from 'src/Utils/flattenChildren';
import { handleInitialValue } from 'src/Utils/setInitialValue';

interface InputContainerProps {
  children: ReactNode;
  inputContainerStyles?: string;
  // sharedStyles?: object
  sharedStyles?: {
    placeholderStyles?: string
    inputStyles?: string
    [key: string]: any
  }
  modalContainerRef?: RefObject<HTMLDivElement>
}

interface InputChildProps {
  onInputChange: (modifiedName: string, value: any) => void;
  [key: string]: any; // optional if child has more props
}

const InputContainer: FC<InputContainerProps> = ({ children, inputContainerStyles, sharedStyles, modalContainerRef }) => {
  const setInputValue = useInputStore((state) => state.setInputValue)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [bgColor, setBgColor] = useState("");

  const handleInputChange = (modifiedName: string, value: any): void => {
    setInputValue(modifiedName, value)
  }
  const childrenArray = useMemo(() => flattenChildren(children), [children]);

  /////// This useeffect sets the background color so that strike-through effect in inputs are flawless
  useEffect(() => {
    if (containerRef.current instanceof HTMLElement) {
      let current: HTMLElement | null = containerRef.current;
      // let backgroundColor: string | null = null;
      let backgroundColor: string = '';

      while (current) {
        const style = window.getComputedStyle(current);
        // const bg = style.backgroundColor;
        backgroundColor = style.backgroundColor;
        if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
          // backgroundColor = bg
          break; // found non-transparent background
        }
        current = current.parentElement;
      }
      // console.log('the bg color is', backgroundColor)
      if (backgroundColor == 'rgba(0, 0, 0, 0)' || backgroundColor == '') setBgColor('white')
      else setBgColor(backgroundColor)
      // setBgColor(backgroundColor ?? 'white')
      // setContainerBgColor(backgroundColor || 'white'); // fallback just in case
    }
  }, []);

  return (
    <div ref={containerRef} className={inputContainerStyles}>
      {
        // React.Children.map(children, (child) => {
        childrenArray.map((child, index) => {
          if (!React.isValidElement<InputChildProps>(child)) return null;
          const childType = child.type
          // const childSafe = child as React.ReactElement<InputChildProps>
          const isDOMElement = typeof childType === 'string';
          if (isDOMElement) return child;
          const childProps = child.props
          const modifiedName = (childProps.name || childProps.placeholder) ? childProps.name || camelCase(childProps.placeholder) : undefined
          if (childProps.placeholder) {
            handleInitialValue(modifiedName, childProps.initialValue, setInputValue, (childType as any).type.name)
          }
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              key: child.key ?? index,
              onInputChange: handleInputChange,
              name: modifiedName,
              sharedStyles,
              bgColor,
              modalContainerRef
            })
          }
          return child
        })
      }
    </div>
  )
}

export default memo(InputContainer)




// import React, { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
// import { memo } from 'react'
// import { useInputStore } from '../hooks/useInputStore'
// import { camelCase } from 'src/functions/camelCase';
// import { isEmptyArray } from 'src/functions/dataTypesValidation';
// import { getNestedValue } from 'src/Utils/inputStoreUtils';

// interface InputContainerProps {
//   children: ReactNode;
//   inputContainerStyles?: string;
//   // sharedStyles?: object
//   sharedStyles?: {
//     placeholderStyles?: string
//     inputStyles?: string
//     [key: string]: any
//   }
// }

// interface InputChildProps {
//   onInputChange: (modifiedName: string, value: any) => void;
//   [key: string]: any; // optional if child has more props
// }

// // ✅ Helper to flatten fragments
// const flattenChildren = (children: ReactNode): React.ReactElement[] => {
//   const result: React.ReactElement[] = [];

//   React.Children.forEach(children, (child) => {
//     if (!React.isValidElement<InputChildProps>(child)) return;
//     // Handle Fragments
//     if (child.type === React.Fragment && child.props.children) {
//       result.push(...flattenChildren(child.props.children));
//       return
//     }
//     // Handle Fragments inside new component
//     if (typeof child.type === 'function') {
//       // Call the component to get its rendered output
//       const rendered = (child.type as any)(child.props);
//       result.push(...flattenChildren(rendered));
//       return;
//     }
//     result.push(child)
//   });

//   return result;
// };

// const InputContainer: FC<InputContainerProps> = ({ children, inputContainerStyles, sharedStyles }) => {
//   const setInputValue = useInputStore((state) => state.setInputValue)
//   const setInitialInputs = useInputStore((state) => state.setInitialInputData)

//   const containerRef = useRef<HTMLDivElement | null>(null)
//   const [bgColor, setBgColor] = useState("");

//   const handleInputChange = (modifiedName: string, value: any): void => {
//     setInputValue(modifiedName, value)
//   }
//   const childrenArray = useMemo(() => flattenChildren(children), [children]);
//   const storedData = useInputStore.getState().inputData;

//   const initialNames = useMemo(() => {
//     return childrenArray.map((child) => {
//       if (!React.isValidElement<InputChildProps>(child)) return null;
//       // const childSafe = child as React.ReactElement<InputChildProps>
//       const childProps = child.props;
//       if (!childProps || !childProps.placeholder) return;
//       let componentName: string | undefined;
//       if (typeof child.type !== 'string') {
//         componentName = (child.type as React.ComponentType<any>)?.name; // Access name for functional/class components
//       }
//       if (componentName == 'DateInput') return;
//       const modifiedName = childProps.name || camelCase(childProps.placeholder);
//       return {
//         name: modifiedName,
//         value: storedData[modifiedName] || childProps.initialValue || ""
//       };
//     }).filter((item): item is { name: string; value: any } => Boolean(item)); // Type predicate for filtering
//     // }).filter(Boolean);
//   }, [children]);

//   useEffect(() => {
//     // console.log('the mapping for initial value is')
//     if (!isEmptyArray(initialNames)) {
//       const initialInputData: Record<any, any> = {}
//       initialNames.forEach(({ name, value }) => {
//         const keys = name.split(".");
//         if (keys.length > 1) {
//           const existing = getNestedValue(storedData, name);
//           if (existing !== undefined) return; // 👈 don't overwrite with default ""
//           let current = initialInputData;
//           keys.forEach((key, idx) => {
//             if (idx === keys.length - 1) {
//               current[key] = value;
//             } else {
//               if (!current[key]) {
//                 current[key] = /^\d+$/.test(keys[idx + 1]) ? [] : {};
//               }
//               current = current[key];
//             }
//           });
//         }
//         else {
//           initialInputData[name] = value
//         }
//         // handleInputChange(name, value); // set default values once on mount
//       });
//       setInitialInputs(initialInputData)
//     }
//   }, [initialNames])

//   /////// This useeffect sets the background color so that strike-through effect in inputs are flawless
//   useEffect(() => {
//     if (containerRef.current instanceof HTMLElement) {
//       let current: HTMLElement | null = containerRef.current;
//       // let backgroundColor: string | null = null;
//       let backgroundColor: string = '';

//       while (current) {
//         const style = window.getComputedStyle(current);
//         // const bg = style.backgroundColor;
//         backgroundColor = style.backgroundColor;

//         if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
//           // backgroundColor = bg
//           break; // found non-transparent background
//         }
//         current = current.parentElement;
//       }
//       console.log('the bg color is', backgroundColor)
//       if (backgroundColor == 'rgba(0, 0, 0, 0)' || backgroundColor == '') setBgColor('white')
//       else setBgColor(backgroundColor)
//       // setBgColor(backgroundColor ?? 'white')
//       // setContainerBgColor(backgroundColor || 'white'); // fallback just in case
//     }
//   }, []);

//   return (
//     <div ref={containerRef} className={inputContainerStyles}>
//       {
//         // React.Children.map(children, (child) => {
//         childrenArray.map((child, index) => {
//           if (!React.isValidElement<InputChildProps>(child)) return null;
//           // const childSafe = child as React.ReactElement<InputChildProps>
//           const isDOMElement = typeof child.type === 'string';
//           if (isDOMElement) return child;
//           const childProps = child.props
//           const modifiedName = (childProps.name || childProps.placeholder) ? childProps.name || camelCase(childProps.placeholder) : undefined
//           if (React.isValidElement(child)) {
//             return React.cloneElement(child, {
//               key: child.key ?? index,
//               onInputChange: handleInputChange,
//               name: modifiedName,
//               sharedStyles,
//               bgColor
//             })
//           }
//           return child
//         })
//       }
//     </div>
//   )
// }

// export default memo(InputContainer)






// ✅ Helper to flatten fragments
// const flattenChildren = (children: ReactNode): React.ReactElement[] => {
//   const result: React.ReactElement[] = [];

//   React.Children.forEach(children, (child) => {
//     if (!React.isValidElement<InputChildProps>(child)) return;

//     if (child.type === React.Fragment && child.props.children) {
//       result.push(...flattenChildren(child.props.children));
//     } else {
//       result.push(child);
//     }
//   });

//   return result;
// };