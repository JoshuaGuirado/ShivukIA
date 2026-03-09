
import React, { useState } from 'react';
import { 
  MessageSquarePlus, Lightbulb, Briefcase, LayoutGrid, 
  Info, Settings, User, LogOut, Zap, ChevronRight, CheckCircle, BarChart2, CreditCard,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { View } from '../types';
import { Logo } from './Logo';
import { useSettings } from '../contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  onLogout?: () => void;
  isOpen: boolean; // Control visibility on mobile
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onLogout, isOpen, onClose }) => {
  const { t } = useSettings();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainItems = [
    { id: View.CHAT, label: t.sidebar.chat, icon: MessageSquarePlus },
    { id: View.TEMPLATES, label: t.sidebar.ideas, icon: Lightbulb },
    { id: View.BRANDS, label: t.sidebar.brands, icon: Briefcase },
    { id: View.LIBRARY, label: t.sidebar.library, icon: LayoutGrid },
    { id: View.ANALYTICS, label: t.sidebar.analytics, icon: BarChart2 },
  ];

  // Moving System/Management Items to a separate list to be placed at the bottom
  const systemItems = [
    { id: View.PLANS, label: t.sidebar.manage, icon: CreditCard },
    { id: View.SETTINGS, label: t.sidebar.settings, icon: Settings },
    { id: View.PROFILE, label: t.sidebar.profile, icon: User },
    { id: View.ABOUT, label: t.sidebar.about, icon: Info },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('shivuk_logged_in');
      window.location.reload();
    }
  };

  const handleNavClick = (view: View) => {
    onViewChange(view);
    onClose(); // Auto close on mobile
  };

  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    const isActive = activeView === item.id;
    
    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
          isActive 
          ? 'bg-cyber-electric text-cyber-dark shadow-lg shadow-cyber-electric/20 font-bold' 
          : 'text-slate-400 hover:bg-cyber-electric/10 hover:text-cyber-electric'
        } ${isCollapsed ? 'justify-center' : ''}`}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon size={20} className={`shrink-0 ${isActive ? 'text-cyber-dark' : 'group-hover:text-cyber-electric transition-colors'}`} />
        
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden">{item.label}</span>
            {isActive && <ChevronRight size={14} className="opacity-50" />}
          </>
        )}
        
        {isActive && !isCollapsed && (
          <motion.div 
            layoutId="activeSideIndicator"
            className="absolute left-0 w-1 h-6 bg-cyber-dark rounded-r-full opacity-50"
          />
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 h-full bg-cyber-light backdrop-blur-xl border-r border-cyber-electric/10 flex flex-col z-50 transition-all duration-300 lg:static 
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72 w-64'}
        `}
      >
        {/* Header: Logo + Toggle */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between gap-3'}`}>
          <div className="flex items-center gap-3">
             <Logo className="w-8 h-8 shrink-0" />
             {!isCollapsed && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex flex-col overflow-hidden"
                >
                    <span className="text-xl font-brand font-black tracking-tighter text-white uppercase whitespace-nowrap">SHIVUK AI</span>
                    <span className="text-[9px] font-black text-cyber-galaxy uppercase tracking-widest whitespace-nowrap">Studio 2.0</span>
                </motion.div>
             )}
          </div>
          
          {/* Desktop Toggle Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 space-y-1 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
          {!isCollapsed && <div className="mb-2 px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Menu</div>}
          {mainItems.map(renderNavItem)}

          {/* Spacer to push Management/System items to bottom */}
          <div className="flex-1 min-h-[20px]" />

          {/* Divider */}
          <div className="h-px w-full bg-white/5 my-2" />

          {/* System Items (Management, Settings, Profile) */}
          {!isCollapsed && <div className="mb-2 px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Gestão</div>}
          {systemItems.map(renderNavItem)}
        </nav>

        {/* Footer Area: Plan & Logout */}
        <div className="p-3 space-y-3">
          {/* Plan Card (Simplified if collapsed) */}
          <button 
            onClick={() => handleNavClick(View.PLANS)}
            className={`w-full rounded-2xl bg-gradient-to-br from-cyber-light to-cyber-dark border border-cyber-electric/20 hover:shadow-lg hover:shadow-cyber-electric/10 transition-all text-left group overflow-hidden ${
                isCollapsed ? 'p-3 flex justify-center items-center' : 'p-4 space-y-3'
            }`}
            title="Gerenciar Assinatura"
          >
             {isCollapsed ? (
                 <Zap size={20} className="text-cyber-electric animate-pulse" fill="currentColor" />
             ) : (
                <>
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyber-electric font-black text-[9px] uppercase tracking-widest">
                        <Zap size={14} fill="currentColor" /> {t.sidebar.plan}
                    </div>
                    <CheckCircle size={14} className="text-cyber-galaxy" />
                    </div>
                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-cyber-electric w-full group-hover:animate-pulse" />
                    </div>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Gerenciar Assinatura</p>
                </>
             )}
          </button>

          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? t.sidebar.logout : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-bold uppercase tracking-tight">{t.sidebar.logout}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
