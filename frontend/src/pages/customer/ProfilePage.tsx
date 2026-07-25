import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Plus, Trash2, CheckCircle2,
  Home, Lock, Sparkles, LogOut, Loader2, Star
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { useAuthStore } from '../../store/authStore';
import { useAddressStore } from '../../store/addressStore';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { addresses, selectedAddress, isLoading, fetchAddresses, addAddress, deleteAddress, setSelectedAddress } = useAddressStore();
  const navigate = useNavigate();

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState<string>('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newCity.trim() || !newState.trim() || !newPostalCode.trim()) return;

    setIsAdding(true);
    try {
      await addAddress({
        label: newLabel,
        street: newStreet,
        city: newCity,
        state: newState,
        postalCode: newPostalCode,
        latitude: 0,
        longitude: 0,
        isDefault: addresses.length === 0,
      });

      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewPostalCode('');
      setShowAddAddress(false);
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    await deleteAddress(addressId);
  };

  return (
    <div className="min-h-screen page-bg py-8">
      <Container size="lg" className="space-y-8">

        {/* ── HEADER */}
        <div>
          <span className="section-badge text-xs mb-1">
            <User className="w-3.5 h-3.5" />
            Customer Account & Addresses
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-primary dark:text-white">
            Profile & Saved Addresses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal contact details, security, and hyperlocal delivery pins.
          </p>
        </div>

        {savedBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>New delivery address saved successfully!</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

          {/* ── LEFT: USER PROFILE */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-xl space-y-5">
              
              <div className="flex items-center gap-4 border-b border-indigo-50 dark:border-white/5 pb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl text-white shadow-lg shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
                >
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-brand-primary dark:text-white">
                    {user?.name || 'User Account'}
                  </h3>
                  <p className="text-xs text-slate-400">Verified WadiGo Customer</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-white/10 text-indigo-700 dark:text-indigo-300">
                    Email OTP Verified
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input type="text" readOnly value={user?.name || ''} placeholder="Not specified"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input type="email" readOnly value={user?.email || ''} placeholder="Not specified"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium" />
                  </div>
                </div>

                {user?.phone && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input type="text" readOnly value={user.phone}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium" />
                    </div>
                  </div>
                )}
              </div>

              {/* Sign Out Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors shadow-sm"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out of WadiGo</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: SAVED ADDRESSES */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-indigo-50 dark:border-white/5 pb-4">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-brand-primary dark:text-white">
                    Delivery Addresses
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Saved locations for fast hyperlocal delivery.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>

              {/* Add Address Form */}
              <AnimatePresence>
                {showAddAddress && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleCreateAddress}
                    className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-slate-900/90 border border-indigo-100 dark:border-white/10 space-y-4 overflow-hidden shadow-lg"
                  >
                    <h4 className="font-bold text-sm text-brand-primary dark:text-white">Add Delivery Location</h4>

                    <div className="grid grid-cols-3 gap-2">
                      {(['Home', 'Work', 'Other']).map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setNewLabel(label)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            newLabel === label
                              ? 'bg-brand-primary dark:bg-gradient-to-r dark:from-brand-rose dark:to-brand-violet text-white border-transparent shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-brand-secondary'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Street / House No / Area</label>
                      <input required type="text" placeholder="e.g. Flat 402, 12th Main Street" value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-secondary" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">City</label>
                        <input required type="text" placeholder="City" value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-secondary" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">State</label>
                        <input required type="text" placeholder="State" value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-secondary" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Postal Code</label>
                        <input required type="text" placeholder="e.g. 560001" value={newPostalCode}
                          onChange={(e) => setNewPostalCode(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-secondary" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setShowAddAddress(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                        Cancel
                      </button>
                      <button type="submit" disabled={isAdding}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-2">
                        {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        Save Location
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Addresses List */}
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-secondary dark:text-brand-rose" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="py-12 text-center space-y-3 rounded-2xl bg-slate-50/50 dark:bg-white/3 border border-slate-200/60 dark:border-white/5">
                  <MapPin className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="font-bold text-xs text-slate-700 dark:text-slate-300">No Saved Delivery Addresses</p>
                  <p className="text-[11px] text-slate-400">Click "+ Add New" above to save your first delivery location.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-brand-secondary bg-indigo-50/90 dark:bg-indigo-950/70 dark:border-brand-rose shadow-md'
                            : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-brand-secondary dark:bg-brand-rose text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-brand-primary dark:text-white">{addr.label}</span>
                                {isSelected && (
                                  <span className="px-2 py-0.5 rounded-full bg-brand-secondary dark:bg-brand-rose text-[9px] font-bold text-white">
                                    Active
                                  </span>
                                )}
                                {addr.isDefault && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[9px] font-bold text-emerald-700 dark:text-emerald-300">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                                {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-secondary dark:text-brand-rose shrink-0" />}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};
