import React, { ReactNode } from "react";

interface InputChildProps {
  onInputChange: (modifiedName: string, value: any) => void;
  [key: string]: any; // optional if child has more props
}

export const flattenChildren = (children: ReactNode) => {
    const result: React.ReactElement[] = [];

    React.Children.forEach(children, (child) => {
        if (!React.isValidElement<InputChildProps>(child)) return;

        const childType = child.type

        // const componentName 

        // console.log('the value of child inside flattenchild is', child)


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
        result.push(child);
    });

    return result;
};