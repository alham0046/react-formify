export interface FullInputProps {
    placeholder: string;
    containerStyles?: string;
    inputStyles?: string;
    placeholderStyles?: string;
    initialValue?: string;
    name: string;
    onChange?: (value : string | number) => {}
    isArrayObject?: boolean;
    arrayData?: {
        arrayName: string;
        arrayIndex: number;
    };
    onInputChange: (name: string, value: string | number) => void;
}

export type InputProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">;