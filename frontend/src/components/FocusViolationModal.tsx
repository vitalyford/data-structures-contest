import { useLanguage } from '../contexts/LanguageContext';

interface FocusViolationModalProps {
  open: boolean;
  onClose: () => void;
}

export function FocusViolationModal({ open, onClose }: FocusViolationModalProps) {
  const { t } = useLanguage();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900">{t.focusTitle}</h2>
          <p className="text-gray-600 text-center text-sm">{t.focusMessage}</p>
          <button
            onClick={onClose}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            {t.focusClose}
          </button>
        </div>
      </div>
    </div>
  );
}
