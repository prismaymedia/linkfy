import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useLoginModal } from '@/contexts/LoginModalContext';
import { ROUTES } from '@/lib/routes';

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { openModal } = useLoginModal();
  const [loadingMessage, setLoadingMessage] = useState('Processing login...');

  useEffect(() => {
    // If user navigates directly to /auth, open the modal instead
    // This serves as a fallback for direct navigation or OAuth callbacks
    openModal();
    
    // If authenticated, redirect to dashboard; if not, redirect to home
    // The modal handles most flows but we keep this as a fallback
    const checkSession = async () => {
      const { getSession } = await import('@/lib/supabaseClient');
      const session = await getSession();
      if (session) {
        setLoadingMessage('Redirecting to dashboard...');
        // small delay to show the message briefly
        setTimeout(() => setLocation(ROUTES.DASHBOARD), 150);
      } else {
        setLoadingMessage('Session closed. Redirecting to home...');
        // small delay so user sees loading message while redirecting
        setTimeout(() => setLocation(ROUTES.HOME), 150);
      }
    };
    checkSession();
  }, [openModal, setLocation]);

  // This page now just serves as a fallback that opens the modal
  // The actual login UI is in the LoginModal component
  return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        {loadingMessage}
      </div>
  );
}
