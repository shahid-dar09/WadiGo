import React from 'react';
import { Zap } from 'lucide-react';
import { Container } from '../ui/Container';
import { useThemeStore } from '../../store/themeStore';

export const CustomerFooter: React.FC<{ showFull?: boolean }> = ({ showFull = true }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <footer className="py-6 border-t border-indigo-100/70 dark:border-white/10 bg-white/70 dark:bg-brand-darkSurface/60 text-xs text-slate-500 dark:text-slate-400 select-none">
      <Container size="lg" className="space-y-4">
        {/* Full App Info Row (Dashboard Only) */}
        {showFull && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-50 dark:border-white/5 pb-5">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                  style={{
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #F43F5E, #8B5CF6)'
                      : 'linear-gradient(135deg, #4C1D95, #7C3AED)',
                  }}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-display font-extrabold text-sm text-brand-primary dark:text-white">
                  WadiGo Customer Platform
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                WadiGo is a product-first AI hyperlocal commerce engine. Search any item directly — our smart routing engine aggregates stock, compares nearby verified local merchants, and dispatches your order in under 15 minutes.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <a href="#" className="hover:text-brand-secondary dark:hover:text-brand-rose transition-colors">
                Help & Support
              </a>
              <span>·</span>
              <a href="#" className="hover:text-brand-secondary dark:hover:text-brand-rose transition-colors">
                Privacy Policy
              </a>
              <span>·</span>
              <a href="#" className="hover:text-brand-secondary dark:hover:text-brand-rose transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        )}

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} WadiGo Inc. All rights reserved.</p>
          {!showFull ? (
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-brand-secondary dark:hover:text-brand-rose">Support</a>
              <span>·</span>
              <a href="#" className="hover:text-brand-secondary dark:hover:text-brand-rose">Privacy</a>
            </div>
          ) : (
            <p className="text-[10px]">Product-First Commerce · Verified Local Merchants · Sub-15 Min Dispatch</p>
          )}
        </div>
      </Container>
    </footer>
  );
};
