import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useTenant } from '../contexts/tenant-context';
import { useLanguage } from '../contexts/language-context';
import { useCart } from '../contexts/cart-context';
import { MenuItem } from '../components/MenuItem';
import { Loader2, Filter } from 'lucide-react';

export function Menu() {
  const { tenant } = useTenant();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];

      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('is_active', true)
        .order('display_order');

      return data || [];
    },
    enabled: !!tenant?.id,
  });

  const { data: menuItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['menu-items', tenant?.id, selectedCategory, filters],
    queryFn: async () => {
      if (!tenant?.id) return [];

      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('is_available', true);

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      if (filters.vegetarian) {
        query = query.eq('is_vegetarian', true);
      }
      if (filters.vegan) {
        query = query.eq('is_vegan', true);
      }
      if (filters.glutenFree) {
        query = query.eq('is_gluten_free', true);
      }

      const { data } = await query;
      return data || [];
    },
    enabled: !!tenant?.id,
  });

  if (categoriesLoading || itemsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('nav.menu')}</h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('filter.all')}
          </button>

          {categories?.map((category: any) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <Filter className="h-5 w-5 text-gray-400" />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.vegetarian}
              onChange={(e) => setFilters(prev => ({ ...prev, vegetarian: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">{t('filter.vegetarian')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.vegan}
              onChange={(e) => setFilters(prev => ({ ...prev, vegan: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">{t('filter.vegan')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.glutenFree}
              onChange={(e) => setFilters(prev => ({ ...prev, glutenFree: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">{t('filter.glutenFree')}</span>
          </label>
        </div>

        {/* Menu Items */}
        {menuItems && menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item: any) => (
              <MenuItem
                key={item.id}
                item={item}
                onAdd={(quantity, options) => addItem(item, quantity, options)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
}
