import React, { memo, ReactElement, ReactNode, useCallback, useEffect, useState } from 'react'
import { useInputStore } from '../hooks/useInputStore';
import { useResetForm } from 'src/hooks/useResetForm';

// Define the arguments object for clarity
type SubmitData = {
  data: Record<string, any>;
  resetForm: () => void;
};

// Define the exact type signature for the handler function
export type SubmitHandler = (args: SubmitData) => void;

export interface ConfirmationRenderProps {
  success: (data?: any) => void
  cancel: () => void
  data: Record<string, any> | null
  isDisabled?: boolean
  resetForm: () => void
}

interface SubmitProps {
  children: ReactNode
  className?: string
  disabled?: boolean
  closeModal?: () => void
  onClick?: SubmitHandler
  /**
   * Configuration for enabling and customizing a confirmation modal.
   * If provided, the final action (onConfirm) is only executed after the user confirms inside the modal.
   * * @example
   * // Assuming ConfirmComponent is a function that takes ConfirmationRenderProps
   * modal: {
   * modalStyle: { width: '50%' }  // width and height can be in % or px or simple number
   * renderConfirmationModel: (props) => <ConfirmComponent {...props} />,  // prefered to be used as function
   * isDisabled : false    // if you want to disable the cornfirmation modal submit button conditionally
   * onConfirm: handleSubmitFunction,    
   * }
   */
  modal?: {
    modalStyle?: { height?: string | number, width?: string | number }
    renderConfirmationModel?: ((props: ConfirmationRenderProps) => ReactNode) | ReactElement<ConfirmationRenderProps>
    isDisabled? : boolean
    onConfirm?: (data : any) => void
  }
}

const SubmitButton: React.FC<SubmitProps> = ({
  children,
  className,
  closeModal,
  disabled = false,
  onClick,
  modal,
}) => {
  const {isDisabled = false , modalStyle, onConfirm, renderConfirmationModel} = modal || {}
  // const { height, width } = modal.modelStyle
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modelData, setModelData] = useState<Record<string, any> | null>(null)
  const success = (data?: any) => {
    onConfirm && onConfirm(data)
    setOpenModal(false)
    resetForm()
    closeModal && closeModal()
  }
  const cancel = () => {
    setOpenModal(false)
  }
  const resetForm = useResetForm()
  const handleSubmit = useCallback(() => {
    if (renderConfirmationModel) setOpenModal(true)
    const { inputData: data } = useInputStore.getState()
    // console.log('the submit is', data)
    onClick && onClick({ data, resetForm })
    setModelData(data)
  }, [onClick])
  return (
    <div className={`${className}`} onClick={!disabled && !openModal ? handleSubmit : undefined}>
      {children}
      {
        openModal ? (
          <div
            className={`fixed flex cursor-default justify-center items-center z-50 left-0 top-0 w-full h-full bg-gray-500/50 backdrop-blur-lg `}
          >
            <div
              className={`relative grid rounded-lg shadow-lg bg-gray-400 overflow-y-auto max-h-4/5`}
              style={{ height: modalStyle?.height, width: modalStyle?.width || '80%' }}
            >
              <div className=''>
                {typeof renderConfirmationModel === 'function'
                  ? renderConfirmationModel({ cancel, success, resetForm, data : modelData, isDisabled })
                  : React.isValidElement(renderConfirmationModel)
                    ? React.cloneElement(renderConfirmationModel, { cancel, success, resetForm , data : modelData, isDisabled })
                    : null}
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  )
}

export default memo(SubmitButton)





// import React, { FC, memo, useCallback } from 'react';
// import { useInputStore } from '../hooks/useInputStore';
// import { useResetForm } from 'src/hooks/useResetForm';

// // Define the exact type signature for the handler function
// // This is the type that will provide the suggestions!
// export type SubmitHandler = (args: {
//     data: Record<string, any>;
//     resetForm: () => void;
// }) => void;

// interface SubmitButtonProps {
//   children: React.ReactNode;
//   className?: string;
//   // onClick: (inputData: any) => void; // Replace 'any' with the actual type of inputData if known
//   onClick : SubmitHandler
// }

// const SubmitButton: FC<SubmitButtonProps> = ({ children, className, onClick }) => {
//   const resetForm = useResetForm()
//   const handleSubmit = useCallback(() => {
//     const { inputData : data } = useInputStore.getState();
//     onClick({data, resetForm});
//   }, [onClick]);

//   return (
//     <button className={className} onClick={handleSubmit}>
//       {children}
//     </button>
//   );
// };

// export default memo(SubmitButton);