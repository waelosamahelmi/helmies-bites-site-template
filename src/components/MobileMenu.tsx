import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/language-context';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <span className="font-semibold text-gray-900">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-2">
            <MobileLink to="/" onClick={() => setIsOpen(false)}>Home</MobileLink>
            <MobileLink to="/menu" onClick={() => setIsOpen(false)}>Menu</MobileLink>
            <MobileLink to="/about" onClick={() => setIsOpen(false)}>About</MobileLink>
          </nav>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500 mb-2">Language</p>
            <div className="space-y-1">
              <button
                onClick={() => setLanguage('fi')}
                className={`block w-full text-left px-3 py-2 rounded ${
                  language === 'fi' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'
                }`}
              >
                Suomi
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`block w-full text-left px-3 py-2 rounded ${
                  language === 'en' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('sv')}
                className={`block w-full text-left px-3 py-2 rounded ${
                  language === 'sv' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'
                }`}
              >
                Svenska
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface MobileLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

function MobileLink({ to, onClick, children }: MobileLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
    >
      {children}
    </Link>
  );
}
