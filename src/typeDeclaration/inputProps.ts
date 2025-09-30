export interface FullInputProps {
    placeholder: string;
    containerStyles?: string;
    maxLength?: number
    inputStyles?: string;
    placeholderStyles?: string;
    initialValue?: string;
    privacy?: boolean
    onEnterPress?: (data: any) => {}
    name?: string;
    onChange?: (value: string | number, data: string | null) => {}
    isArrayObject?: boolean;
    arrayData?: {
        arrayName: string;
        arrayIndex: number;
    };
    onInputChange: (name: string, value: string | number) => void;
}

export type InputProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">;