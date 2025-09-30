import React, { FC, memo, useCallback } from 'react';
import { useInputStore } from '../hooks/useInputStore';
import { useResetForm } from 'src/hooks/useResetForm';

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  // onClick: (inputData: any) => void; // Replace 'any' with the actual type of inputData if known
  onClick : (args : {
    data : Record<string, any>
    resetForm : () => void
  }) => void
}

const SubmitButton: FC<SubmitButtonProps> = ({ children, className, onClick }) => {
  const resetForm = useResetForm()
  const handleSubmit = useCallback(() => {
    const { inputData : data } = useInputStore.getState();
    onClick({data, resetForm});
  }, [onClick]);

  return (
    <button className={className} onClick={handleSubmit}>
      {children}
    </button>
  );
};

export default memo(SubmitButton);