import { useState } from 'react';
import { Plus } from 'lucide-react';
import { MenuItem as MenuItemType } from '../lib/types';
import { useLanguage } from '../contexts/language-context';

interface Props {
  item: MenuItemType;
  onAdd: (quantity: number, options?: any) => void;
}

export function MenuItem({ item, onAdd }: Props) {
  const { t, language } = useLanguage();
  const [showOptions, setShowOptions] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const name = language === 'en' && item.name_en ? item.name_en : item.name;

  const handleAdd = () => {
    onAdd(quantity, {
      size: showOptions?.size,
      toppings: showOptions?.toppings,
    });
    setShowOptions(false);
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {item.image_url && (
        <img
          src={item.image_url}
          alt={name}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{name}</h3>

          {/* Dietary badges */}
          <div className="flex gap-1">
            {item.is_vegetarian && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                V
              </span>
            )}
            {item.is_vegan && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                VG
              </span>
            )}
            {item.is_gluten_free && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                GF
              </span>
            )}
          </div>
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {language === 'en' && item.description_en
              ? item.description_en
              : item.description}
          </p>
        )}

        {item.spicy_level && item.spicy_level > 0 && (
          <div className="flex gap-1 mb-3">
            {Array.from({ length: item.spicy_level }).map((_, i) => (
              <span key={i} className="text-red-500">🌶️</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            €{item.price.toFixed(2)}
          </span>

          {!showOptions ? (
            <button
              onClick={() => setShowOptions(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              {t('item.add')}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50"
              >
                +
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowOptions(false)}
                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
