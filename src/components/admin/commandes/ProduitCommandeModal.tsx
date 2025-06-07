'use client';

import { useEffect, useRef } from 'react';
import { ProduitCommande } from '@/types/database';
import ProduitCommandeForm from './ProduitCommandeForm';

interface ProduitCommandeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  commandeId: string;
  initialData?: Partial<ProduitCommande>;
  isEditing?: boolean;
}

export default function ProduitCommandeModal({
  isOpen,
  onClose,
  onSubmit,
  commandeId,
  initialData,
  isEditing = false
}: ProduitCommandeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLButtonElement>(null);
  const lastInputRef = useRef<HTMLButtonElement>(null);

  // Gestion de la fermeture avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      firstInputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Gestion du clic en dehors du modal pour fermer
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button
            ref={firstInputRef}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ProduitCommandeForm
          commandeId={commandeId}
          onSubmit={() => {
            onSubmit();
            onClose();
          }}
          onCancel={onClose}
          initialData={initialData}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}
