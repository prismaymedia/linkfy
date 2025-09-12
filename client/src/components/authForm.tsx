import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AuthForm({
  onSubmit,
}: {
  onSubmit: (email: string, password: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-sm mx-auto bg-white rounded-2xl shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        {t('auth.login')}
      </h2>

      <input
        type="email"
        placeholder={t('auth.emailPlaceholder')}
        className="border rounded-md p-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder={t('auth.passwordPlaceholder')}
        className="border rounded-md p-2 w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        {t('auth.signInButton')}
      </button>
    </form>
  );
}
