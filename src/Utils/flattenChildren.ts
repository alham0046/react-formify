import React, { ReactNode } from "react";

interface InputChildProps {
  onInputChange: (modifiedName: string, value: any) => void;
  [key: string]: any; // optional if child has more props
}

const CustomComponents : string[] = ["StrInput", "NumInput", "SelectInput", "DisabledInput", "AutoInput", "SubmitButton"]

export const flattenChildren = (children: ReactNode) => {
    const result: React.ReactElement[] = [];

    React.Children.forEach(children, (child) => {
        if (!React.isValidElement<InputChildProps>(child)) return;

        const childType : any = child.type

        let componentName;

        // 1. Try to get displayName from the memo wrapper
        componentName = childType.displayName;

        // 2. Fallback to the original function's name/displayName
        if (!componentName && childType.type) {
            componentName = childType.type.displayName || childType.type.name;
        }

        if (CustomComponents.includes(componentName)) {
            // console.log('the function child customComp is', child)
            result.push(child); // PUSH the custom input element
            return;
        }


        if (childType === React.Fragment && child.props.children) {
            result.push(...flattenChildren(child.props.children));
            return
        }
        if (typeof childType === 'function') {
            // console.log('the child inside flattenchild is', childType.type.name)
            // Call the component to get its rendered output
            const rendered = (child.type as any)(child.props);
            result.push(...flattenChildren(rendered));
            return;
        }
        if (typeof childType === 'object') {
            // Call the component to get its rendered output
            // console.log('the function child object is', child)
            const rendered = (childType.type)(child.props);
            result.push(...flattenChildren(rendered));
            return;
        }
        result.push(child);
    });

    return result;
};