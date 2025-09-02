import toast from 'react-hot-toast';
import successIcon from '../assets/toast-success.png';
import errorIcon from '../assets/toast-error.png';

// Success Toast
export const showSuccessToast = (message) => {
  toast.custom(
    <div className="toast-success p-4 flex items-center gap-2">
      <img src={successIcon} alt="Success" className="h-5 w-5" />
      {message}
    </div>,
    { duration: 1000 }
  );
};

// Error Toast
export const showErrorToast = (message, icon) => {
  toast.custom(
    <div className="toast-error p-4 flex items-center gap-2">
      {icon && <img src={errorIcon} alt="Error" className="h-5 w-5" />}
      {message}
    </div>
  );
};

// Loading Toast
export const showLoadingToast = (message) => {
  return toast.custom(
    <div className="toast-loading p-4 flex items-center gap-2">
      {message}
    </div>,
    { id: 'toast-loading', duration: Infinity }
  );
};