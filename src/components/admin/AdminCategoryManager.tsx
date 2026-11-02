import React, { useState } from 'react';
import { Plus, Edit, Trash2, FolderTree, AlertCircle, Check, Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';

export const AdminCategoryManager: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleStartAdd = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDesc('');
    setIsAdding(true);
    setError('');
    setSuccess('');
  };

  const handleStartEdit = (cat: Category) => {
    setIsAdding(false);
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormDesc(cat.description || '');
    setError('');
    setSuccess('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, formName.trim(), formDesc.trim());
      setSuccess(`Updated category "${formName.trim()}".`);
      setEditingCategory(null);
    } else {
      addCategory(formName.trim(), formDesc.trim());
      setSuccess(`Added new category "${formName.trim()}".`);
      setIsAdding(false);
    }

    setFormName('');
    setFormDesc('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (cat: Category) => {
    const linkedCount = products.filter(p => p.category === cat.name).length;
    if (linkedCount > 0) {
      const confirmDelete = window.confirm(
        `Category "${cat.name}" has ${linkedCount} products associated with it. Are you sure you want to delete this category?`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm(`Delete category "${cat.name}"?`);
      if (!confirmDelete) return;
    }

    deleteCategory(cat.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-stone-900">
            Category Management
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Organize catalog products into collections for smooth customer navigation.
          </p>
        </div>

        {!isAdding && !editingCategory && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Category</span>
          </button>
        )}
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Add / Edit Form Modal or Card */}
      {(isAdding || editingCategory) && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-serif-display text-lg font-bold text-stone-900">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
            </h3>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingCategory(null);
              }}
              className="text-stone-400 hover:text-stone-700 text-xs font-medium"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Travel & Luggage"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary shown on collection filters..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingCategory(null);
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-6 font-semibold">Category Name</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              <th className="py-3 px-4 font-semibold text-center">Linked Products</th>
              <th className="py-3 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {categories.map((cat) => {
              const productCount = products.filter(p => p.category === cat.name).length;

              return (
                <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-stone-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                        <FolderTree className="w-4 h-4" />
                      </div>
                      <span>{cat.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-500 max-w-sm truncate">
                    {cat.description || 'No description'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-medium tabular-nums">
                      <Package className="w-3 h-3 text-stone-400" />
                      <span>{productCount} items</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Edit category name"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
