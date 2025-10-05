import React, { FC, memo, ReactNode, useEffect, useMemo } from 'react'
import { camelCase } from 'src/functions/camelCase';
import { useInputStore } from 'src/hooks/useInputStore';
import { flattenChildren } from 'src/Utils/flattenChildren';
import { handleInitialValue } from 'src/Utils/setInitialValue';


interface FullProps {
    onInputChange: (name: string, value: any) => void;
    sharedStyles : string
    bgColor : string
}

interface ObjContainerProps {
    objName: string
    inputContainerStyles : string
    children: ReactNode
}

interface InputChildProps {
  onInputChange: (modifiedName: string, value: any) => void;
  [key: string]: any; // optional if child has more props
}

const ObjectContainer: FC<ObjContainerProps> = ({
    objName,
    inputContainerStyles = '',
    children,
    ...props
}) => {
    const fullProps = props as FullProps
    const setInputValue = useInputStore((state) => state.setInputValue)
    const childrenArray = useMemo(() => flattenChildren(children), [children]);
    
    const handleInputChange = (modifiedName : string, value : any) => {
        fullProps.onInputChange(modifiedName, value)
    }

    return (
        <div className={inputContainerStyles ? inputContainerStyles : 'contents'}>
            {
                childrenArray.map((child, index) => {
                    if (!React.isValidElement<InputChildProps>(child)) return child;
                    const childType = child.type
                    const isDOMElement = typeof childType === 'string';
                    if (isDOMElement) return child;
                    const childProps = child.props
                    const modifiedName = (childProps.name || childProps.placeholder) ? childProps.name || camelCase(childProps.placeholder) : undefined
                    const changedName = `${objName}.${modifiedName}`
                    handleInitialValue(changedName, childProps.initialValue,setInputValue, (childType as any).type.name)
                    // console.log('the value of chiprops is', changedName, modifiedName)
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, {
                            key: child.key ?? index,
                            onInputChange: handleInputChange,
                            name: changedName,
                            sharedStyles : fullProps.sharedStyles,
                            bgColor : fullProps.bgColor
                            // ...props
                            // isArray : isChildArray
                        })
                    }
                    return child
                })
            }
        </div>
    )
}


export default memo(ObjectContainer)