'use client';

import React, { useEffect, useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Link from '@/components/common/Link';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { orderService } from '@/services/orderService';
import { useRouter } from '@/router/RouterContext';
import { INDIAN_STATES } from '@/constants/indianStates';
import { formatCurrency, formatDate } from '@/utils/formatters';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
} from 'lucide-react';

const PAYMENT_METHODS = [
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'upi', label: 'Instant UPI / QR Code' },
  { value: 'cod', label: 'Cash on Delivery' },
];

const EMPTY_ADDRESS = {
  label: 'Home',
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
};

function DashboardSection({ id, title, description, icon: Icon, children, action }) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-sm border border-[#E7E5E4] bg-white p-5 sm:p-7"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-[#F5F5F4] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-[#E7E5E4] bg-[#F5F5F4] text-[#1C1917]">
            <Icon className="h-4 w-4 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="font-sans text-lg font-normal text-[#1C1917]">{title}</h2>
            <p className="text-[11px] text-[#78716C]">{description}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function DashboardLink({ href, icon: Icon, title, description, count }) {
  return (
    <a
      href={href}
      className="group flex min-h-28 flex-col justify-between border border-[#E7E5E4] bg-white p-4 transition-colors hover:border-[#A8A29E] hover:bg-[#FAFAF9]"
    >
      <div className="flex items-start justify-between gap-3">
        <Icon className="h-4 w-4 text-[#57534E] stroke-[1.5]" />
        {count !== undefined && (
          <span className="text-[10px] font-mono text-[#78716C]">{count}</span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-[#1C1917] group-hover:underline">{title}</p>
        <p className="mt-0.5 text-[11px] text-[#78716C]">{description}</p>
      </div>
    </a>
  );
}

function AddressFields({ address, onChange }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input
        label="Address label"
        value={address.label}
        onChange={(event) => onChange('label', event.target.value)}
        required
      />
      <Input
        label="Recipient name"
        value={address.fullName}
        onChange={(event) => onChange('fullName', event.target.value)}
        required
      />
      <Input
        label="Mobile number"
        type="tel"
        value={address.phone}
        onChange={(event) => onChange('phone', event.target.value)}
        required
      />
      <Input
        label="Street address"
        value={address.address}
        onChange={(event) => onChange('address', event.target.value)}
        required
      />
      <Input
        label="City / District"
        value={address.city}
        onChange={(event) => onChange('city', event.target.value)}
        required
      />
      <div>
        <label htmlFor="address-state" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#57534E]">
          State / UT <span className="text-[#991B1B]">*</span>
        </label>
        <select
          id="address-state"
          value={address.state}
          onChange={(event) => onChange('state', event.target.value)}
          required
          className="block w-full border border-[#D6D3D1] bg-white px-3 py-2 text-xs text-[#1C1917] focus:border-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#1C1917] sm:text-sm"
        >
          <option value="">Select State / UT</option>
          {INDIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
        </select>
      </div>
      <Input
        label="PIN code"
        value={address.zip}
        inputMode="numeric"
        pattern="[0-9]{6}"
        minLength={6}
        maxLength={6}
        onChange={(event) => onChange('zip', event.target.value.replace(/\D/g, '').slice(0, 6))}
        required
      />
    </div>
  );
}

export default function ProfilePage() {
  const { user, isHydrated, updateProfile, logout } = useAuth();
  const { items: wishlistItems, isHydrated: wishlistHydrated, removeFromWishlist, moveToCart } = useWishlist();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    image: '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [preferredPayment, setPreferredPayment] = useState('card');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace('/login?redirect=/profile');
    }
  }, [user, isHydrated, router]);

  useEffect(() => {
    if (!user) return;

    setProfileData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      image: user.image || '',
    });

    setAddresses(Array.isArray(user.addresses) ? user.addresses : []);
    const savedPayment = user.paymentPreference || 'card';
    setPreferredPayment(PAYMENT_METHODS.some((method) => method.value === savedPayment) ? savedPayment : 'card');

    let active = true;
    setLoadingOrders(true);
    setOrdersError('');
    orderService.getOrdersByUser(user.id)
      .then((result) => {
        if (active) setOrders(result || []);
      })
      .catch((error) => {
        if (active) setOrdersError(error.message || 'Could not load your order history.');
      })
      .finally(() => {
        if (active) setLoadingOrders(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  if (!isHydrated || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="animate-pulse font-mono text-xs uppercase tracking-widest text-[#78716C]">
          Loading your NexCart account...
        </p>
      </div>
    );
  }

  const saveAddresses = async (nextAddresses) => {
    try {
      const updatedUser = await updateProfile({ addresses: nextAddresses });
      setAddresses(updatedUser.addresses || []);
      return true;
    } catch (error) {
      toast.error(error.message || 'Could not save your addresses.');
      return false;
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    try {
      await updateProfile({
        ...profileData,
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        email: profileData.email.trim(),
        phone: profileData.phone.trim(),
      });
      setIsEditingProfile(false);
      toast.success('Your profile was updated.');
    } catch (error) {
      toast.error(error.message || 'Could not update your profile.');
    }
  };

  const startNewAddress = () => {
    setAddressForm({ ...EMPTY_ADDRESS });
    setEditingAddressId(null);
    setIsAddressFormOpen(true);
  };

  const startEditingAddress = (address) => {
    setAddressForm({ ...EMPTY_ADDRESS, ...address });
    setEditingAddressId(address.id);
    setIsAddressFormOpen(true);
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();
    const address = {
      ...addressForm,
      id: editingAddressId || `address-${Date.now()}`,
      isDefault: editingAddressId
        ? Boolean(addresses.find((item) => item.id === editingAddressId)?.isDefault)
        : addresses.length === 0,
    };
    const nextAddresses = editingAddressId
      ? addresses.map((item) => item.id === editingAddressId ? address : item)
      : [...addresses, address];
    if (await saveAddresses(nextAddresses)) {
      setIsAddressFormOpen(false);
      toast.success(editingAddressId ? 'Address updated.' : 'Address added.');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    const nextAddresses = addresses.map((address) => ({
      ...address,
      isDefault: address.id === addressId,
    }));
    if (await saveAddresses(nextAddresses)) toast.success('Default delivery address updated.');
  };

  const handleDeleteAddress = async (addressId) => {
    const nextAddresses = addresses.filter((address) => address.id !== addressId);
    if (addresses.find((address) => address.id === addressId)?.isDefault && nextAddresses.length > 0) {
      nextAddresses[0] = { ...nextAddresses[0], isDefault: true };
    }
    if (await saveAddresses(nextAddresses)) toast.success('Address removed.');
  };

  const handlePreferredPaymentChange = async (event) => {
    const method = event.target.value;
    try {
      await updateProfile({ paymentPreference: method });
      setPreferredPayment(method);
      toast.success('Preferred payment method updated.');
    } catch (error) {
      toast.error(error.message || 'Could not save your payment preference.');
    }
  };

  const sectionLinks = [
    { href: '#orders', icon: Package, title: 'My Orders', description: 'Track and manage', count: orders.length },
    { href: '#addresses', icon: MapPin, title: 'My Addresses', description: 'Delivery locations', count: addresses.length },
    { href: '#wishlist', icon: Heart, title: 'My Wishlist', description: 'Saved products', count: wishlistHydrated ? wishlistItems.length : 0 },
    { href: '#payments', icon: CreditCard, title: 'Payments', description: 'Payment preferences' },
    { href: '#personal-details', icon: UserRound, title: 'Personal Details', description: 'Edit profile' },
    { href: '#returns', icon: RotateCcw, title: 'Returns & Refunds', description: 'Request and track' },
    { href: '#notifications', icon: Bell, title: 'Notifications', description: 'Order updates' },
    { href: '#help', icon: CircleHelp, title: 'Help & Support', description: 'Contact support' },
    { href: '#account-settings', icon: ShieldCheck, title: 'Account Settings', description: 'Security and logout' },
  ];

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Customer';
  const initials = fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 text-left sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <header className="mt-3 flex flex-col gap-5 border-b border-[#E7E5E4] pb-7 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-[#E7E5E4] bg-[#F5F5F4] text-lg font-medium text-[#57534E]">
          {profileData.image
            ? <img src={profileData.image} alt={`${fullName} profile`} className="h-full w-full object-cover" />
            : initials}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78716C]">Customer Dashboard</span>
          <h1 className="mt-1 font-sans text-3xl font-normal tracking-tight text-[#1C1917]">
            Hello, {user.firstName || 'Customer'}!
          </h1>
          <p className="mt-1 text-sm text-[#57534E]">Welcome to your NexCart account</p>
          <p className="mt-1 text-xs text-[#78716C]">{user.email}</p>
        </div>
        <a
          href="#orders"
          className="inline-flex items-center gap-2 self-start border border-[#1C1917] bg-[#1C1917] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#292524] sm:self-center"
        >
          View my orders <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </header>

      <nav aria-label="Customer account sections" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {sectionLinks.map((link) => <DashboardLink key={link.href} {...link} />)}
      </nav>

      <div className="mt-8 space-y-6">
        <DashboardSection
          id="personal-details"
          title="Personal Details"
          description="Manage your name and contact information"
          icon={UserRound}
          action={!isEditingProfile && (
            <button type="button" onClick={() => setIsEditingProfile(true)} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917]">
              <Pencil className="h-3.5 w-3.5" /> Edit profile
            </button>
          )}
        >
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First name" value={profileData.firstName} onChange={(event) => setProfileData({ ...profileData, firstName: event.target.value })} required />
                <Input label="Last name" value={profileData.lastName} onChange={(event) => setProfileData({ ...profileData, lastName: event.target.value })} required />
                <Input label="Email address" type="email" value={profileData.email} onChange={(event) => setProfileData({ ...profileData, email: event.target.value })} required />
                <Input label="Mobile number" type="tel" value={profileData.phone} onChange={(event) => setProfileData({ ...profileData, phone: event.target.value })} />
                <Input label="Date of birth (optional)" type="date" value={profileData.dateOfBirth} onChange={(event) => setProfileData({ ...profileData, dateOfBirth: event.target.value })} />
                <Input label="Profile picture URL" type="url" value={profileData.image} onChange={(event) => setProfileData({ ...profileData, image: event.target.value })} helperText="Use an image URL; uploaded images are not supported." />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="primary" size="md">Save profile</Button>
                <Button type="button" variant="secondary" size="md" onClick={() => {
                  setProfileData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    dateOfBirth: user.dateOfBirth || '',
                    image: user.image || '',
                  });
                  setIsEditingProfile(false);
                }}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['First name', user.firstName || '—'],
                ['Last name', user.lastName || '—'],
                ['Email', user.email || '—'],
                ['Mobile number', user.phone || 'Not added'],
                ['Date of birth', user.dateOfBirth || 'Not added'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">{label}</p>
                  <p className="mt-1 break-words text-sm text-[#1C1917]">{value}</p>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>

        <DashboardSection
          id="addresses"
          title="Manage Addresses"
          description="Add, edit, remove, and choose a default delivery location"
          icon={MapPin}
          action={!isAddressFormOpen && (
            <button type="button" onClick={startNewAddress} className="inline-flex items-center gap-1.5 border border-[#D6D3D1] px-3 py-2 text-xs font-medium text-[#1C1917] hover:border-[#1C1917]">
              <Plus className="h-3.5 w-3.5" /> Add address
            </button>
          )}
        >
          {isAddressFormOpen && (
            <form onSubmit={handleSaveAddress} className="mb-5 space-y-4 border border-[#E7E5E4] bg-[#FAFAF9] p-4 sm:p-5">
              <h3 className="text-sm font-medium text-[#1C1917]">{editingAddressId ? 'Edit address' : 'Add a delivery address'}</h3>
              <AddressFields
                address={addressForm}
                onChange={(field, value) => setAddressForm((current) => ({ ...current, [field]: value }))}
              />
              <div className="flex gap-3">
                <Button type="submit" variant="primary" size="md">Save address</Button>
                <Button type="button" variant="secondary" size="md" onClick={() => setIsAddressFormOpen(false)}>Cancel</Button>
              </div>
            </form>
          )}
          {addresses.length === 0 && !isAddressFormOpen ? (
            <div className="border border-dashed border-[#D6D3D1] px-4 py-8 text-center">
              <MapPin className="mx-auto h-5 w-5 text-[#A8A29E]" />
              <p className="mt-2 text-sm text-[#57534E]">No delivery addresses saved yet.</p>
              <button type="button" onClick={startNewAddress} className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#1C1917] underline underline-offset-4">Add your first address</button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {addresses.map((address) => (
                <article key={address.id} className="border border-[#E7E5E4] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#1C1917]">{address.label}</h3>
                        {address.isDefault && <span className="bg-[#F0FDF4] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#166534]">Default</span>}
                      </div>
                      <p className="mt-2 text-xs font-medium text-[#1C1917]">{address.fullName}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#57534E]">{address.address}, {address.city}, {address.state} {address.zip}</p>
                      <p className="mt-1 text-xs text-[#78716C]">{address.phone}</p>
                    </div>
                    <button type="button" onClick={() => handleDeleteAddress(address.id)} aria-label={`Delete ${address.label} address`} className="p-1 text-[#A8A29E] hover:text-[#991B1B]">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 border-t border-[#F5F5F4] pt-3">
                    <button type="button" onClick={() => startEditingAddress(address)} className="text-xs font-medium text-[#57534E] hover:text-[#1C1917]">Edit</button>
                    {!address.isDefault && <button type="button" onClick={() => handleSetDefaultAddress(address.id)} className="text-xs font-medium text-[#57534E] hover:text-[#1C1917]">Set as default</button>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </DashboardSection>

        <DashboardSection
          id="orders"
          title="My Orders"
          description="Review order details, item sizes, payments, and delivery progress"
          icon={Package}
        >
          {loadingOrders ? (
            <p className="py-8 text-center text-xs text-[#78716C]">Loading your orders...</p>
          ) : ordersError ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border border-[#FECACA] bg-[#FEF2F2] p-4">
              <p className="text-sm text-[#991B1B]">{ordersError}</p>
              <button type="button" onClick={() => {
                setLoadingOrders(true);
                setOrdersError('');
                orderService.getOrdersByUser(user.id)
                  .then((result) => setOrders(result || []))
                  .catch((error) => setOrdersError(error.message || 'Could not load your order history.'))
                  .finally(() => setLoadingOrders(false));
              }} className="text-xs font-semibold text-[#991B1B] underline">Try again</button>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center">
              <Package className="mx-auto h-6 w-6 text-[#A8A29E]" />
              <p className="mt-2 text-sm text-[#57534E]">You have no orders yet.</p>
              <Link href="/products" className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-[#1C1917] underline underline-offset-4">Explore products</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const isCancelled = String(order.status).toLowerCase().includes('cancel');
                const trackingSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                const currentStep = trackingSteps.findIndex((step) => (
                  String(order.status).toLowerCase().includes(step.toLowerCase())
                ));
                return (
                  <article key={order.id} className="border border-[#E7E5E4]">
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FAFAF9] p-4">
                      <div>
                        <p className="font-mono text-xs font-semibold text-[#1C1917]">{order.orderNumber || `ORD-${order.id}`}</p>
                        <p className="mt-1 text-[11px] text-[#78716C]">Placed {formatDate(order.createdAt)} · {order.items?.length || 0} item(s)</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold tabular-nums text-[#1C1917]">{formatCurrency(order.total)}</span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                    {!isCancelled && (
                      <ol aria-label="Order tracking" className="grid grid-cols-4 gap-1 px-4 pt-4">
                        {trackingSteps.map((step, index) => (
                          <li key={step} className={`border-t-2 pt-2 text-[9px] sm:text-[10px] ${index <= currentStep ? 'border-[#1C1917] font-semibold text-[#1C1917]' : 'border-[#E7E5E4] text-[#A8A29E]'}`}>
                            {step}
                          </li>
                        ))}
                      </ol>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <p className="text-xs text-[#57534E]">
                        {order.items?.slice(0, 2).map((item) => `${item.title}${item.size ? ` (Size ${item.size})` : ''}`).join(', ')}
                        {(order.items?.length || 0) > 2 ? ` +${order.items.length - 2} more` : ''}
                      </p>
                      <button type="button" onClick={() => setExpandedOrderId(isExpanded ? null : order.id)} aria-expanded={isExpanded} className="inline-flex items-center gap-1 text-xs font-medium text-[#1C1917]">
                        Order details <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="space-y-4 border-t border-[#E7E5E4] p-4">
                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div key={`${item.id || item.title}-${item.size || 'one-size'}-${index}`} className="flex flex-wrap justify-between gap-2 text-xs">
                              <span className="text-[#57534E]">{item.title}{item.size ? ` · Size ${item.size}` : ''} × {item.quantity}</span>
                              <span className="font-medium tabular-nums text-[#1C1917]">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="grid gap-4 border-t border-[#F5F5F4] pt-3 sm:grid-cols-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">Payment</p>
                            <p className="mt-1 text-xs text-[#1C1917]">{order.paymentMethod || 'Payment method not recorded'}</p>
                            <p className="mt-1 text-[11px] text-[#78716C]">{order.paymentStatus || 'Payment confirmation is not available in this demo.'}</p>
                          </div>
                          {order.shippingAddress && (
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">Delivery address</p>
                              <p className="mt-1 text-xs leading-relaxed text-[#57534E]">
                                {[order.shippingAddress.fullName, order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.zip].filter(Boolean).join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </DashboardSection>

        <DashboardSection
          id="wishlist"
          title="My Wishlist"
          description="Your saved products"
          icon={Heart}
        >
          {!wishlistHydrated ? (
            <p className="py-6 text-center text-xs text-[#78716C]">Loading your wishlist...</p>
          ) : wishlistItems.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#57534E]">Your wishlist is empty.</p>
          ) : (
            <div className="divide-y divide-[#F5F5F4]">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <img src={item.thumbnail || '/images/category_craft_objects_1791282688777.jpg'} alt="" className="h-14 w-14 border border-[#E7E5E4] bg-[#F5F5F4] object-contain p-1" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.id}`} className="text-sm font-medium text-[#1C1917] hover:underline">{item.title}</Link>
                    <p className="mt-1 text-xs text-[#78716C]">{formatCurrency(item.price)}</p>
                  </div>
                  <button type="button" onClick={() => moveToCart(item)} className="border border-[#1C1917] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#1C1917] hover:bg-[#1C1917] hover:text-white">Add to cart</button>
                  <button type="button" onClick={() => removeFromWishlist(item.id, item.title)} aria-label={`Remove ${item.title} from wishlist`} className="p-2 text-[#A8A29E] hover:text-[#991B1B]"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>

        <DashboardSection
          id="payments"
          title="Payment Settings"
          description="Choose a preferred checkout method and review order payment records"
          icon={CreditCard}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label htmlFor="preferred-payment" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">Preferred payment method</label>
              <select id="preferred-payment" value={preferredPayment} onChange={handlePreferredPaymentChange} className="block w-full border border-[#D6D3D1] bg-white px-3 py-2.5 text-sm text-[#1C1917] focus:border-[#1C1917] focus:outline-none">
                {PAYMENT_METHODS.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}
              </select>
              <p className="mt-2 text-[11px] leading-relaxed text-[#78716C]">Your preference is linked to your account. Card numbers and other payment credentials are not saved.</p>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">Payment history</p>
              {orders.length === 0 ? (
                <p className="text-xs text-[#78716C]">No order payment records yet.</p>
              ) : (
                <ul className="space-y-2">
                  {orders.slice(0, 5).map((order) => (
                    <li key={order.id} className="flex justify-between gap-3 border-b border-[#F5F5F4] pb-2 text-xs">
                      <span className="text-[#57534E]">{order.orderNumber || `ORD-${order.id}`} · {order.paymentMethod || 'Method not recorded'}</span>
                      <span className="shrink-0 font-medium tabular-nums text-[#1C1917]">{formatCurrency(order.total)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-[10px] text-[#78716C]">Payment-provider transaction statuses are not available in this demo.</p>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection id="returns" title="Returns & Refunds" description="Return requests and refund updates" icon={RotateCcw}>
          <p className="text-sm text-[#57534E]">Return and refund requests are not supported yet. No return or refund status is currently available for your orders.</p>
        </DashboardSection>

        <DashboardSection id="reviews" title="Reviews & Ratings" description="Reviews you have submitted" icon={Star}>
          <p className="text-sm text-[#57534E]">Customer review management is not available yet. Your submitted reviews are not currently linked to this account.</p>
        </DashboardSection>

        <DashboardSection id="notifications" title="Notifications" description="Order and delivery updates" icon={Bell}>
          <p className="text-sm text-[#57534E]">Order status is shown in My Orders. Email, SMS, and in-app notification history are not available yet.</p>
        </DashboardSection>

        <DashboardSection id="account-settings" title="Account Settings" description="Account security and session controls" icon={ShieldCheck}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#1C1917]">Password and email verification</p>
              <p className="mt-1 text-xs text-[#78716C]">Password changes and email verification require an authentication service and are not available here.</p>
            </div>
            <button type="button" onClick={async () => {
              if (await logout()) router.replace('/');
            }} className="inline-flex shrink-0 items-center justify-center gap-2 border border-[#FECACA] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#991B1B] hover:bg-[#FEF2F2]">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </DashboardSection>

        <DashboardSection id="help" title="Help & Support" description="Find help with your account and orders" icon={CircleHelp}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#1C1917]">Need help with an order?</p>
              <p className="mt-1 text-xs text-[#78716C]">Browse common questions in the NexCart help section.</p>
            </div>
            <Link href="/#faq" className="inline-flex items-center gap-2 border border-[#D6D3D1] px-3 py-2 text-xs font-medium text-[#1C1917] hover:border-[#1C1917]">
              Visit FAQs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="mt-4 basis-full text-[11px] text-[#78716C]">A dedicated support contact channel is not configured yet.</p>
        </DashboardSection>

        <div className="flex items-center justify-center gap-2 py-2 text-[10px] text-[#78716C]">
          <Check className="h-3 w-3" /> Your account details and saved addresses are stored in this browser.
        </div>
      </div>
    </div>
  );
}
