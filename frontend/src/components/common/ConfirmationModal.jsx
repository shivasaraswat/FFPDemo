import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'warning' // 'warning', 'danger', 'info'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    if (type === 'danger') {
      return (
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    }
    return (
      <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-600">
          <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[2000] p-4 animate-[fadeIn_0.2s_ease-out]" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-[480px] shadow-xl animate-[slideUp_0.3s_ease-out] confirmation-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          .confirmation-modal .modal-cancel-btn {
            border: 2px solid #d1d5db !important;
            background: #ffffff !important;
            color: #6b7280 !important;
          }
          .confirmation-modal .modal-cancel-btn:hover {
            background: #f9fafb !important;
          }
          .confirmation-modal .modal-submit-btn {
            border: 2px solid #D80C0C !important;
            background: #ffffff !important;
            color: #D80C0C !important;
          }
          .confirmation-modal .modal-submit-btn:hover {
            background: #fff3f3 !important;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4">
              {getIcon()}
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 text-base leading-relaxed">{message}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end mt-8">
            <button
              type="button"
              onClick={onClose}
              className="modal-cancel-btn px-6 py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="modal-submit-btn px-6 py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 flex items-center gap-2"
            >
              {confirmText}
              <span style={{ color: '#D80C0C' }}>›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

