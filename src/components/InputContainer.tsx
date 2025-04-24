import React, { FC, ReactNode, useEffect, useMemo } from 'react'
import { memo } from 'react'
import { useInputStore } from '../hooks/useInputStore'
import { camelCase } from 'src/functions/camelCase';
import { isEmptyArray } from 'src/functions/dataTypesValidation';

interface InputContainerProps {
  children: ReactNode;
  inputContainerStyles: string;
  sharedStyles : object
}

interface InputChildProps {
  onInputChange: (modifiedName: string, value: any) => void;
  [key: string]: any; // optional if child has more props
}

const InputContainer: FC<InputContainerProps> = ({ children, inputContainerStyles, sharedStyles }) => {
  const setInputValue = useInputStore((state) => state.setInputValue)
  const setInitialInputs = useInputStore((state) => state.setInitialInputData)

  const handleInputChange = (modifiedName: string, value: any): void => {
    setInputValue(modifiedName, value)
  }

  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  const initialNames = useMemo(() => {
    const storedData = useInputStore.getState().inputData;
    // console.log('the mapping for initial value is', storedData)
    return childrenArray.map((child) => {
      const childSafe = child as React.ReactElement<InputChildProps>
      const childProps = childSafe.props;
      let componentName: string | undefined;
        if (typeof childSafe.type !== 'string') {
            componentName = (childSafe.type as React.ComponentType<any>)?.name; // Access name for functional/class components
        }
      if (componentName == 'DateInput') return;
      const modifiedName = childProps.name || camelCase(childProps.placeholder);
      return {
        name: modifiedName,
        value: storedData[modifiedName] || childProps.initialValue || ""
      };
    }).filter((item): item is { name: string; value: any } => Boolean(item)); // Type predicate for filtering
    // }).filter(Boolean);
  }, [children]);

  useEffect(() => {
    // console.log('the mapping for initial value is')
    if (!isEmptyArray(initialNames)) {
      const initialInputData : Record<any, any> = {}
      initialNames.forEach(({ name, value }) => {
        initialInputData[name] = value
        // handleInputChange(name, value); // set default values once on mount
      });
      setInitialInputs(initialInputData)
    }
  }, [initialNames])

  return (
    <div className={inputContainerStyles}>
      {
        React.Children.map(children, (child) => {
          const childSafe = child as React.ReactElement<InputChildProps>
          const isDOMElement = typeof childSafe.type === 'string';
          if (isDOMElement) return child;
          const childProps = childSafe.props
          const modifiedName = (childProps.name || childProps.placeholder) ? childProps.name || camelCase(childProps.placeholder) : undefined
          if (React.isValidElement(child)) {
            return React.cloneElement(childSafe, {
              onInputChange: handleInputChange,
              name: modifiedName,
              sharedStyles
            })
          }
          return child
        })
      }
    </div>
  )
}

export default memo(InputContainer)
