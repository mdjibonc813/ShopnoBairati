import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  X, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2,
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { 
  WATCH_IMAGE, 
  LEATHER_BAG_IMAGE, 
  SUNGLASSES_IMAGE, 
  HEADPHONES_IMAGE 
} from '../../data/initialData';

interface AdminProductFormProps {
  editProduct?: Product | null;
  onDone: () => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({ editProduct, onDone }) => {
  const { categories, addProduct, updateProduct, settings, formatPrice } = useStore();

  const isEditing = !!editProduct;

  // Form State
  const [name, setName] = useState(editProduct?.name || '');
  const [category, setCategory] = useState(editProduct?.category || categories[0]?.name || 'Watches & Horology');
  const [price, setPrice] = useState<number | ''>(editProduct?.price ?? 1500);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(editProduct?.originalPrice ?? '');
  const [shortDescription, setShortDescription] = useState(editProduct?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(editProduct?.fullDescription || '');
  const [image, setImage] = useState(editProduct?.image || WATCH_IMAGE);
  const [inStock, setInStock] = useState(editProduct?.inStock ?? true);
  const [isFeatured, setIsFeatured] = useState(editProduct?.isFeatured ?? false);
  const [sku, setSku] = useState(editProduct?.sku || `AUR-${Math.floor(100 + Math.random() * 900)}`);
  
  // Dynamic Specifications
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(() => {
    if (editProduct?.specifications) {
      return Object.entries(editProduct.specifications).map(([key, value]) => ({ key, value }));
    }
    return [
      { key: 'Material', value: 'Premium Grade' },
      { key: 'Warranty', value: '1 Year Store Warranty' },
    ];
  });

  const [formError, setFormError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Preset images for fast testing
  const presetImages = [
    { label: 'Chronograph Watch', url: WATCH_IMAGE },
    { label: 'Leather Messenger', url: LEATHER_BAG_IMAGE },
    { label: 'Tortoise Sunglasses', url: SUNGLASSES_IMAGE },
    { label: 'Studio Headphones', url: HEADPHONES_IMAGE },
    { label: 'Ceramic Pour Over', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Parfum Flask', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecRow = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecs(specs.filter((_, idx) => idx !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const next = [...specs];
    next[index][field] = val;
    setSpecs(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter a product name.');
      return;
    }

    if (price === '' || price <= 0) {
      setFormError('Please specify a valid product price in BDT.');
      return;
    }

    const specsRecord: Record<string, string> = {};
    specs.forEach(s => {
      if (s.key.trim() && s.value.trim()) {
        specsRecord[s.key.trim()] = s.value.trim();
      }
    });

    const productPayload = {
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      price: Number(price),
      originalPrice: originalPrice !== '' ? Number(originalPrice) : undefined,
      shortDescription: shortDescription.trim() || 'Premium curated product available via direct WhatsApp ordering.',
      fullDescription: fullDescription.trim() || shortDescription.trim(),
      image,
      gallery: [image],
      inStock,
      stockStatus: inStock ? ('in_stock' as const) : ('out_of_stock' as const),
      isFeatured,
      isSpecialOffer: originalPrice !== '' && Number(originalPrice) > Number(price),
      sku: sku.trim(),
      specifications: specsRecord,
    };

    if (isEditing && editProduct) {
      updateProduct(editProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      onDone();
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Breadcrumb & Cancel button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onDone}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products List</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        
        {/* Header */}
        <div className="pb-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900">
              {isEditing ? 'Edit Product Details' : 'Add New Product to Catalog'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Customers will see this product and can order it directly via WhatsApp in {settings.currencyCode} ({settings.currencySymbol}).
            </p>
          </div>
        </div>

        {formError && (
          <div className="my-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="my-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Product saved successfully! Returning to catalog...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          
          {/* Product Name & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Minimalist Chronograph Watch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                SKU / Model Code
              </label>
              <input
                type="text"
                placeholder="AUR-101"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Category & Pricing in BDT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Price ({settings.currencySymbol} BDT) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="1500"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Previous Price (Optional)
              </label>
              <input
                type="number"
                min="1"
                placeholder="Original price for discount"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white tabular-nums"
              />
            </div>
          </div>

          {/* Product Image Section */}
          <div className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Product Image
            </label>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Image Preview Box */}
              <div className="w-32 h-32 rounded-xl bg-white border border-stone-300 overflow-hidden shrink-0 shadow-2xs">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Upload & URL Controls */}
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://... or choose a sample preset below"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-xs font-medium text-stone-700 transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[11px] text-stone-400">JPG, PNG, or WebP</span>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[11px] text-stone-500 font-medium block mb-1.5">
                    Or select a studio preset image:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetImages.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className={`px-2 py-1 text-[11px] rounded border transition-colors ${
                          image === preset.url
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Short Description (Catalog Cards)
              </label>
              <textarea
                rows={2}
                placeholder="1-2 sentences highlighting key materials and features..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Product Description (Product Details Page)
              </label>
              <textarea
                rows={4}
                placeholder="Comprehensive description of design, craftsmanship, dimensions, and usage..."
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Toggles: In Stock & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 block">Available in Stock</span>
                <span className="text-[11px] text-stone-500">Uncheck to display as Out of Stock / Pre-Order</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-stone-900 focus:ring-stone-500"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 block">Featured on Homepage</span>
                <span className="text-[11px] text-stone-500">Highlight in featured campaign collections</span>
              </div>
            </label>
          </div>

          {/* Product Specifications Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Product Specifications
              </label>
              <button
                type="button"
                onClick={handleAddSpecRow}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-stone-900"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {specs.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Feature (e.g. Material)"
                    value={row.key}
                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                    className="w-1/3 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Full-grain Leather)"
                    value={row.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecRow(idx)}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onDone}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Product Changes' : 'Create & Publish Product'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
