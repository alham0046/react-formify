import React, { FC, memo, useCallback } from 'react';
import { useInputStore } from '../hooks/useInputStore';

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick: (inputData: any) => void; // Replace 'any' with the actual type of inputData if known
}

const SubmitButton: FC<SubmitButtonProps> = ({ children, className, onClick }) => {
  const handleSubmit = useCallback(() => {
    const { inputData } = useInputStore.getState();
    onClick(inputData);
  }, [onClick]);

  return (
    <button className={className} onClick={handleSubmit}>
      {children}
    </button>
  );
};

export default memo(SubmitButton);