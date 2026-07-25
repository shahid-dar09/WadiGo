import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store, Plus, Save, MapPin, Clock, Loader2,
  CheckCircle2, AlertCircle, Package, Phone, Mail
} from 'lucide-react';
import { useMerchantStore } from '../../store/merchantStore';
import { Container } from '../../components/ui/Container';

export const MerchantProfilePage: React.FC = () => {
  const { profile, selectedStore, isLoading, fetchProfile, createProfile, updateProfile, createStore } = useMerchantStore();

  const [mode, setMode] = useState<'view' | 'editProfile' | 'addStore'>('view');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile form
  const [bizName, setBizName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Store form
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeRadius, setStoreRadius] = useState(10);
  const [storePrepTime, setStorePrepTime] = useState(15);

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, []);

  useEffect(() => {
    if (profile) {
      setBizName(profile.businessName);
      setContactEmail(profile.contactEmail);
      setContactPhone(profile.contactPhone);
    }
  }, [profile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (profile) {
        await updateProfile({ businessName: bizName, contactEmail, contactPhone });
      } else {
        await createProfile({ businessName: bizName, contactEmail, contactPhone });
      }
      setSuccess('Profile saved successfully!');
      setMode('view');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createStore({ name: storeName, address: storeAddress, latitude: 0, longitude: 0, radiusKm: storeRadius, prepTimeMinutes: storePrepTime });
      setSuccess('Store created successfully!');
      setMode('view');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create store');
    }
  };

  return (
    <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
      <Container size="lg" className="space-y-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-amber-900 dark:text-white">Merchant Profile</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage your business profile and store locations.</p>
        </div>

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />{success}
          </motion.div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />{error}
          </div>
        )}

        {/* Business Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-amber-100/70 dark:border-white/10 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-amber-50 dark:border-white/5 pb-4">
            <h2 className="font-bold text-lg text-amber-900 dark:text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-600" />
              Business Information
            </h2>
            {mode !== 'editProfile' && (
              <button onClick={() => setMode('editProfile')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/30">
                {profile ? 'Edit' : 'Create Profile'}
              </button>
            )}
          </div>

          {mode === 'editProfile' ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Business Name *</label>
                  <input required value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="Your Business Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Contact Email *</label>
                  <input required type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="business@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Contact Phone *</label>
                  <input required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setMode('view')} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500">Cancel</button>
                <button type="submit" disabled={isLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Profile
                </button>
              </div>
            </form>
          ) : profile ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Business Name</p>
                <p className="font-bold text-slate-900 dark:text-white">{profile.businessName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Status</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                  profile.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  profile.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>{profile.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-300">{profile.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-300">{profile.contactPhone}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No profile created yet. Click "Create Profile" to get started.</p>
          )}
        </div>

        {/* Stores */}
        {profile && (
          <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-amber-100/70 dark:border-white/10 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-amber-50 dark:border-white/5 pb-4">
              <h2 className="font-bold text-lg text-amber-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                Store Locations ({profile.stores?.length ?? 0})
              </h2>
              <button onClick={() => setMode(mode === 'addStore' ? 'view' : 'addStore')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                <Plus className="w-3.5 h-3.5" /> Add Store
              </button>
            </div>

            {mode === 'addStore' && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateStore}
                className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-900/80 border border-amber-100 dark:border-white/10 space-y-4"
              >
                <h4 className="font-bold text-sm text-amber-900 dark:text-white">New Store Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Store Name *</label>
                    <input required value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="e.g. Main Branch"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Store Address *</label>
                    <input required value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} placeholder="Full address"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Service Radius (km)</label>
                    <input type="number" min="1" max="100" value={storeRadius} onChange={(e) => setStoreRadius(+e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Prep Time (minutes)</label>
                    <input type="number" min="1" max="120" value={storePrepTime} onChange={(e) => setStorePrepTime(+e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setMode('view')} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500">Cancel</button>
                  <button type="submit" disabled={isLoading}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Create Store
                  </button>
                </div>
              </motion.form>
            )}

            {profile.stores?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No store locations yet. Add your first store above.</p>
            ) : (
              <div className="space-y-3">
                {profile.stores.map((store) => (
                  <div key={store.id} className="p-4 rounded-2xl border border-amber-100 dark:border-white/10 bg-amber-50/50 dark:bg-slate-900/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-amber-900 dark:text-white">{store.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${store.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {store.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{store.address}</p>
                    <div className="flex gap-4 text-[10px] text-slate-400">
                      <span>Radius: {store.radiusKm}km</span>
                      <span>Prep: {store.prepTimeMinutes}min</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};
