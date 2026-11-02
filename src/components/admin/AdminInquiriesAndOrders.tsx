import React, { useState } from 'react';
import { 
  MessageCircle, 
  ShoppingBag, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  ExternalLink, 
  Database, 
  Filter, 
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerInquiry, OrderRecord } from '../../types';

export const AdminInquiriesAndOrders: React.FC = () => {
  const { 
    orders, 
    inquiries, 
    updateOrderStatus, 
    updateInquiryStatus, 
    formatPrice, 
    settings 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'inquiries'>('orders');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (o.customerPhone && o.customerPhone.toLowerCase().includes(search.toLowerCase())) ||
      o.items.some(i => i.productName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = 
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      (i.phone && i.phone.toLowerCase().includes(search.toLowerCase())) ||
      i.message.toLowerCase().includes(search.toLowerCase()) ||
      (i.topic && i.topic.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCustomerWhatsAppChat = (phoneNumber?: string, customerName?: string) => {
    if (!phoneNumber) return;
    const cleanNum = phoneNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${customerName || 'there'}! I am contacting you from ${settings.storeName} regarding your recent store inquiry.`);
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Firebase Firestore Live Stream • Project: shopnobairati</span>
          </div>
          <h2 className="font-serif-display text-2xl font-bold text-stone-900">
            Customer Inquiries &amp; WhatsApp Orders
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Every chat interaction, contact message, and WhatsApp order placed on the website is permanently stored in Firestore.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-white border border-stone-200 rounded-xl shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('orders');
              setStatusFilter('All');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>WhatsApp Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('inquiries');
              setStatusFilter('All');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inquiries'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Customer Inquiries &amp; Chats ({inquiries.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={activeTab === 'orders' ? 'Search by customer, phone, or product...' : 'Search by name, phone, or message...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {activeTab === 'orders' ? (
              <>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted on WhatsApp</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </>
            ) : (
              <>
                <option value="new">New</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* TAB 1: WhatsApp Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-stone-300 transition-colors space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-stone-900">{order.id}</span>
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(order.createdAt).toLocaleString()}</span>
                          <span>•</span>
                          <span className="capitalize">{order.orderType.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500 font-medium">Order Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none ${
                          order.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status === 'delivered'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : order.status === 'cancelled'
                            ? 'bg-stone-100 text-stone-500 border-stone-200'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted via WhatsApp</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/60 overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-stone-400 uppercase text-[10px] font-semibold border-b border-stone-200/60 pb-1">
                          <th className="pb-2">Item</th>
                          <th className="pb-2">Price</th>
                          <th className="pb-2 text-center">Qty</th>
                          <th className="pb-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {order.items.map((it, idx) => (
                          <tr key={idx} className="py-1.5">
                            <td className="py-2 font-medium text-stone-900">{it.productName}</td>
                            <td className="py-2 text-stone-600 tabular-nums">{formatPrice(it.price)}</td>
                            <td className="py-2 text-center tabular-nums font-semibold">{it.quantity}</td>
                            <td className="py-2 text-right font-bold text-stone-900 tabular-nums">
                              {formatPrice(it.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary & Customer details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3 pt-1">
                    <div className="space-y-1">
                      {order.customerName && (
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span><strong>Customer:</strong> {order.customerName}</span>
                        </div>
                      )}
                      {order.customerPhone && (
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span><strong>Phone:</strong> {order.customerPhone}</span>
                          <button
                            onClick={() => openCustomerWhatsAppChat(order.customerPhone, order.customerName)}
                            className="ml-2 text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>Chat on WhatsApp</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="text-right self-end sm:self-auto">
                      <span className="text-stone-500 text-[11px] block">Total Amount</span>
                      <span className="text-lg font-bold text-emerald-700 tabular-nums">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400 space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs">No orders found in Firebase Firestore.</p>
              <p className="text-[11px] text-stone-400">
                When visitors click "Order on WhatsApp", orders will automatically show up here in real-time.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Customer Inquiries & Chats */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {filteredInquiries.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-stone-300 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">{inq.name}</span>
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
                            {inq.source}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(inq.createdAt).toLocaleString()}</span>
                          {inq.phone && (
                            <>
                              <span>•</span>
                              <span>{inq.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {inq.phone && (
                        <button
                          onClick={() => openCustomerWhatsAppChat(inq.phone, inq.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Reply on WhatsApp</span>
                        </button>
                      )}

                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                          inq.status === 'replied'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : inq.status === 'closed'
                            ? 'bg-stone-100 text-stone-500 border-stone-200'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="new">New Inquiry</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Topic and Message body */}
                  <div className="space-y-1 bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
                    {inq.topic && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                        Topic: {inq.topic}
                      </span>
                    )}
                    <p className="text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
                      {inq.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400 space-y-2">
              <MessageCircle className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs">No customer inquiries found in Firebase Firestore.</p>
              <p className="text-[11px] text-stone-400">
                Customer chats via the live widget or contact form will stream directly here.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
