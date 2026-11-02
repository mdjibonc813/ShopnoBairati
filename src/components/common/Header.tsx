import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  MessageCircle, 
  ShieldCheck, 
  SlidersHorizontal,
  User,
  LogIn,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    settings, 
    cartTotalItemsCount, 
    setIsCartDrawerOpen,
    searchQuery,
    setSearchQuery,
    navigateToShopWithCategory,
    adminUser,
    currentUser,
    logout,
    openAuthModal,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: 'home' | 'shop' | 'contact') => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePage('shop');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Notification Bar */}
      <div className="bg-stone-900 text-stone-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="font-semibold text-white tracking-wide">WHATSAPP ORDERS</span>
            <span aria-hidden="true" className="text-stone-600">•</span>
            <span>Direct Confirmation &amp; Cash on Delivery Across Bangladesh</span>
          </div>
          
          <div className="flex items-center gap-4 text-stone-300">
            <a 
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.whatsappNumberDisplay}</span>
            </a>

            <span aria-hidden="true" className="text-stone-700 hidden sm:inline">|</span>

            {/* Top Bar Auth Actions */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-stone-300 truncate max-w-[130px]">
                  Hi, <strong className="text-white">{currentUser.name.split(' ')[0]}</strong>
                </span>

                {adminUser && (
                  <button
                    onClick={() => setActivePage('admin-dashboard')}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin Panel</span>
                  </button>
                )}

                <button
                  onClick={() => logout()}
                  className="text-stone-400 hover:text-red-400 text-[11px] flex items-center gap-1 font-medium transition-colors"
                  title="Sign out of account"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => openAuthModal('login')}
                  className="text-stone-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-medium"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Login / Register</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 zones (Brand wordmark — Nav links — Action CTA) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('home')}
              className="text-left group focus:outline-none"
            >
              <span className="font-serif-display text-2xl sm:text-3xl font-bold tracking-wider text-stone-900 block group-hover:text-stone-700 transition-colors">
                {settings.logoText || 'AURA'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold block -mt-1">
                LIFESTYLE CATALOG
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button 
              onClick={() => handleNavClick('home')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activePage === 'home' ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('shop')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activePage === 'shop' ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent'
              }`}
            >
              All Products
            </button>
            <button 
              onClick={() => {
                navigateToShopWithCategory('All');
              }}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent"
            >
              Categories
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activePage === 'contact' ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent'
              }`}
            >
              Contact &amp; Store
            </button>
          </nav>

          {/* Zone 3: Actions (Search, Cart, User Login/Profile, WhatsApp) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input on Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 xl:w-56 pl-9 pr-3 py-2 text-xs bg-stone-100 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            </form>

            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Drawer Toggle */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartTotalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm tabular-nums">
                  {cartTotalItemsCount}
                </span>
              )}
              <span className="hidden sm:inline text-xs font-semibold text-stone-800">
                Cart {cartTotalItemsCount > 0 ? `(${cartTotalItemsCount})` : ''}
              </span>
            </button>

            {/* USER LOGIN / LOGOUT PROFILE BUTTON */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors border border-stone-200/80"
                  aria-label="User Account Menu"
                >
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="font-bold text-stone-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                      <span className={`inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        currentUser.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {currentUser.role === 'admin' ? 'Administrator' : 'Store Customer'}
                      </span>
                    </div>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setActivePage('admin-dashboard');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 flex items-center gap-2 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActivePage('cart');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 flex items-center gap-2 font-medium"
                    >
                      <ShoppingBag className="w-4 h-4 text-stone-400" />
                      <span>My Cart Items ({cartTotalItemsCount})</span>
                    </button>

                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* LOGIN BUTTON (When logged out) */
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors shadow-2xs whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5 text-stone-600" />
                <span>Login</span>
              </button>
            )}

            {/* WhatsApp Quick Chat button */}
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello! I have a question regarding products in your store.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {searchOpen && (
          <div className="lg:hidden pb-4 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, watches, bags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-100 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 shadow-xl">
          <div className="flex flex-col gap-3">
            
            {/* Mobile User Profile Section */}
            {currentUser ? (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">{currentUser.name}</span>
                  <span className="text-[11px] text-stone-500 block">{currentUser.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-900 text-white rounded-lg text-xs font-semibold"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Customer Login</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('register');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}

            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activePage === 'home' ? 'bg-stone-100 text-stone-900 font-semibold' : 'text-stone-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activePage === 'shop' ? 'bg-stone-100 text-stone-900 font-semibold' : 'text-stone-600'
              }`}
            >
              All Products Catalog
            </button>
            <button
              onClick={() => {
                navigateToShopWithCategory('All');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600"
            >
              Browse Categories
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activePage === 'contact' ? 'bg-stone-100 text-stone-900 font-semibold' : 'text-stone-600'
              }`}
            >
              Store &amp; Contact
            </button>

            <div className="border-t border-stone-100 pt-3 mt-1 flex flex-col gap-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Concierge on WhatsApp</span>
              </a>

              {adminUser && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActivePage('admin-dashboard');
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Enter Admin Dashboard</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
