import { InitialState, useFormInitials } from "src/hooks/useFormInitialState";

export const SetFormData = (initialState: InitialState) => {
    useFormInitials(initialState);
}