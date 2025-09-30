import React, { FC, memo, useCallback, useEffect } from 'react';
import { useInputStore } from '../hooks/useInputStore';
import { shallow } from 'zustand/shallow';
import { camelCase } from 'src/functions/camelCase';
import { getDynamic } from 'src/functions/makeDynamic';
import { isEmptyArray } from 'src/functions/dataTypesValidation';

interface ArrayInputProps {
    children: React.ReactNode;
    name: string;
    data?: Array<Record<string, any>>;
    containerStyles?: string;
    onInputChange: (name: string, value: any) => void;
}

interface InputChildProps {
    onInputChange: (modifiedName: string, value: any) => void;
    [key: string]: any; // optional if child has more props
  }

const ArrayInput: FC<ArrayInputProps> = ({ children, name, data = [], containerStyles = '', ...props }) => {
    const inputData = useInputStore((state) => state.inputData[name]);
    
    useEffect(() => {
        if (isEmptyArray(inputData)) return
        if (React.Children.count(children) !== inputData.length) {
            alert('Elements inside Array Input do not match data provided initially');
        }
    }, [children, inputData]);
    
    useEffect(() => {
        const storeArrayData = useInputStore.getState().inputData[name];
        if (!storeArrayData || storeArrayData.length === 0) {
            props.onInputChange(name, data.length > 0 ? data : [{}]);
        }
    }, [name, data]);

    const handleArrayInput = useCallback((index: number, field: string, value: any) => {
        props.onInputChange(`${name}.${index}.${field}`, value);
    }, [name]);

    return (
        <div id={name} className={containerStyles}>
            {(inputData || []).map((item: Record<string, any>, index: number) => (
                <div key={index}>
                    {React.Children.map(children, (child) => {
                        if (!React.isValidElement<InputChildProps>(child)) return null;
                        const childProps = child.props;
                        const modifiedName = childProps.name || camelCase(childProps.placeholder);
                        const isValidChild = Object.keys(item).includes(modifiedName);
                        const placeholder = childProps.placeholder ? getDynamic(child.props.placeholder, item) : undefined;

                        if (React.isValidElement(child) && isValidChild) {
                            return React.cloneElement(child as React.ReactElement<InputChildProps>, {
                                onInputChange: (field: string, input: any) => handleArrayInput(index, field, input),
                                name : modifiedName,
                                isArrayObject: true,
                                arrayData: { arrayName: name, arrayItem: item, arrayIndex: index },
                                placeholder
                            });
                        }
                        return null;
                    })}
                </div>
            ))}
        </div>
    );
};

export default memo(ArrayInput);

{/* {children} */ }
{/* {
    data.length > 0 ? (data.map((item, index) => (
        <div>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { onInputChange: (field, input) => handleArrayInput(index, field, input) })
                }
                return child
            })}
        </div>
    ))) : (
        { children }
    )
} */}