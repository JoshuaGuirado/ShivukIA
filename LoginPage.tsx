import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
  ShieldCheck,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { supabase } from '../config/supabase';
import { AuthError } from '@supabase/supabase-js';

type ViewMode = 'login' | 'register' | 'forgot';

export const LoginPage: React.FC = () => {
  const [view, setView] = useState<ViewMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear states when switching views
  useEffect(() => {
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  }, [view]);

  const getErrorMessage = (err: AuthError) => {
    if (err.message.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
    if (err.message.includes('User already registered')) return 'Este e-mail já está em uso.';
    if (err.message.includes('Password should be')) return 'A senha é muito fraca.';
    return `Erro: ${err.message}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(getErrorMessage(error));
    }
    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(getErrorMessage(error));
    } else {
      setSuccess('Conta criada. Verifique seu e-mail ou faça login (se e-mail confirmation off).');
      setTimeout(() => setView('login'), 3000);
    }
    setIsSubmitting(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError(getErrorMessage(error));
    } else {
      setSuccess('Instruções enviadas para seu e-mail.');
      setTimeout(() => setView('login'), 3000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full bg-cyber-dark flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-200">
      {/* Dynamic Animated Background with New Colors */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyber-indigo/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyber-electric/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass border border-white/10 rounded-[40px] p-8 md:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 shadow-inner mb-6">
              <Logo className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-brand font-extrabold text-white tracking-tight uppercase">
              Shivuk AI
            </h1>
            <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">
              Content Studio 2.0
            </p>
          </div>

          {/* Feedback Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-wider"
              >
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-bold uppercase tracking-wider"
              >
                <CheckCircle2 size={16} className="shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms Container */}
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">E-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyber-electric transition-colors" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@acesso.ai"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyber-electric/50 focus:ring-4 focus:ring-cyber-electric/5 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Senha</label>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-[10px] font-bold text-cyber-electric hover:underline"
                    >
                      Esqueceu?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyber-electric transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-cyber-electric/50 focus:ring-4 focus:ring-cyber-electric/5 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-gradient-to-r from-cyber-indigo to-cyber-electric text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-cyber-indigo/20 hover:opacity-95 active:scale-[0.98] transition-all mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Entrar no Estúdio <ArrowRight size={20} /></>}
                </button>

                <p className="text-center text-xs text-slate-500 pt-4">
                  Não possui conta? {' '}
                  <button
                    type="button"
                    onClick={() => setView('register')}
                    className="text-cyber-electric font-black hover:underline uppercase tracking-tighter"
                  >
                    Cadastre-se
                  </button>
                </p>
              </motion.form>
            )}

            {view === 'register' && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegister}
                className="space-y-5"
              >
                <div className="space-y-2 text-center mb-6">
                  <h2 className="text-xl font-display font-bold text-white">Crie sua Conta</h2>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Inicie sua jornada criativa</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-cyber-electric/50 transition-all"
                    placeholder="seu@acesso.ai"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Nova Senha</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-cyber-electric/50 transition-all"
                    placeholder="No mínimo 6 caracteres"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Confirmar Senha</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-cyber-electric/50 transition-all"
                    placeholder="Repita sua senha"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-gradient-to-r from-cyber-indigo to-cyber-electric text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-cyber-indigo/20 mt-4 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Cadastrar e Entrar <UserPlus size={20} /></>}
                </button>

                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 hover:text-white transition-colors pt-2 uppercase tracking-widest"
                >
                  <ChevronLeft size={16} />
                  Voltar para o Login
                </button>
              </motion.form>
            )}

            {view === 'forgot' && (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleForgot}
                className="space-y-6"
              >
                <div className="space-y-2 text-center mb-6">
                  <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Recuperar Acesso</h2>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Enviaremos um link de seguridad</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">E-mail Cadastrado</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-cyber-electric/50 transition-all"
                    placeholder="seu@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !!success}
                  className="w-full py-5 bg-cyber-indigo text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-cyber-indigo/20 disabled:opacity-50 active:scale-[0.98] transition-all"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Enviar Link <ShieldCheck size={20} /></>}
                </button>

                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 hover:text-white transition-colors pt-2 uppercase tracking-widest"
                >
                  <ChevronLeft size={16} />
                  Cancelar e Voltar
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-slate-700 text-[10px] mt-10 uppercase tracking-[0.5em] font-black">
          Shivuk AI • Padrão de Segurança Enterprise
        </p>
      </motion.div>
    </div>
  );
};