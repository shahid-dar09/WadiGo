import React from 'react';
import { Container } from '../ui/Container';

export const CustomerFooter: React.FC = () => {
  return (
    <footer className="py-6 border-t border-indigo-50 dark:border-white/5 bg-white/50 dark:bg-black/20 text-xs text-slate-500 dark:text-slate-400 select-none">
      <Container size="lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} WadiGo Inc. AI Hyperlocal Customer Portal.</p>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
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
      </Container>
    </footer>
  );
};
