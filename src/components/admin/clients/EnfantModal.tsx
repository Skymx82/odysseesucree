'use client';

import { useState, useRef, useEffect } from 'react';
import { NouvelEnfant } from '@/types/database';

interface EnfantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (enfant: NouvelEnfant) => Promise<void>;
  clientId: string;
  title: string;
}

export default function EnfantModal({
  isOpen,
  onClose,
  onSubmit,
  clientId,
  title
}: EnfantModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<NouvelEnfant>({
    id_client: clientId,
    prenom: '',
    date_naissance: null,
    allergies: null,
    preferences_gateau: null,
    notes: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestion de la touche Échap pour fermer la modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap pour l'accessibilité
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? null : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError('Une erreur est survenue lors de l\'ajout de l\'enfant');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div ref={modalRef} className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" onClick={e => e.stopPropagation()}>
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">{title}</h3>
                <div className="mt-4 w-full">
                  <form onSubmit={handleSubmit} className="space-y-6 text-black">
                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="prenom"
                          id="prenom"
                          required
                          value={formData.prenom || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
                        />
                      </div>

                      <div>
                        <label htmlFor="date_naissance" className="block text-sm font-medium text-gray-700">
                          Date de naissance
                        </label>
                        <input
                          type="date"
                          name="date_naissance"
                          id="date_naissance"
                          value={formData.date_naissance || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
                        />
                      </div>

                      <div>
                        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                          Allergies
                        </label>
                        <input
                          type="text"
                          name="allergies"
                          id="allergies"
                          value={formData.allergies || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
                          placeholder="Ex: lactose, gluten, fruits à coque..."
                        />
                      </div>

                      <div>
                        <label htmlFor="preferences_gateau" className="block text-sm font-medium text-gray-700">
                          Préférences gâteau
                        </label>
                        <input
                          type="text"
                          name="preferences_gateau"
                          id="preferences_gateau"
                          value={formData.preferences_gateau || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
                          placeholder="Ex: chocolat, fraise, vanille..."
                        />
                      </div>

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <textarea
                          name="notes"
                          id="notes"
                          rows={3}
                          value={formData.notes || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-[#A90BD9] text-white rounded-md hover:bg-[#8A09B1] disabled:opacity-50"
                      >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}