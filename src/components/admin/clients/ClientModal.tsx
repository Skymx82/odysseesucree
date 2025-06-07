'use client';

import { useRef, useEffect } from 'react';
import { NouveauClient } from '@/types/database';
import ClientForm from './ClientForm';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: NouveauClient) => Promise<void>;
  initialData?: Partial<NouveauClient>;
  isEditing?: boolean;
  title: string;
}

export default function ClientModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  title
}: ClientModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Gestion de la touche Echap pour fermer la modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Focus trap dans la modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div 
          ref={modalRef}
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                  {title}
                </h3>
                <div className="mt-4 w-full">
                  <ClientForm
                    onSubmit={async (client) => {
                      await onSubmit(client);
                      onClose();
                    }}
                    onCancel={onClose}
                    initialData={initialData}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
