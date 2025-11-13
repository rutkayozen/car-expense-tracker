'use client';

import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: replace with real logout implementation when backend ready for cookie clearing
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-4">
      <div>
        <p className="text-sm text-slate-500">AI Destekli Araç Masraf Takibi</p>
        <h1 className="text-lg font-semibold text-slate-800">Kontrol Paneli</h1>
      </div>
      <button
        onClick={handleLogout}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-700"
      >
        Logout
      </button>
    </header>
  );
}
