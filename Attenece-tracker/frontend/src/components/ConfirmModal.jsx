import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>
            <div className="relative w-full max-w-md mx-auto my-6 z-50">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-2xl outline-none focus:outline-none overflow-hidden">
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-800">
                            {title}
                        </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={onClose}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="relative p-8 flex-auto">
                        <p className="text-gray-600 text-lg leading-relaxed text-center">
                            {message}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-center gap-4 p-6 border-t border-gray-100">
                        <button
                            className="px-6 py-2.5 text-gray-600 font-semibold text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-all focus:ring-4 focus:ring-gray-100"
                            type="button"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                        <button
                            className="px-6 py-2.5 bg-rose-600 text-white font-semibold text-sm rounded-xl hover:bg-rose-700 active:bg-rose-800 transition-all shadow-lg shadow-rose-200 focus:ring-4 focus:ring-rose-200"
                            type="button"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
