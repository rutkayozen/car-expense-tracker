'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { AppLayout } from '../../../../components/layout/AppLayout';
import { ExpensesApi } from '../../../../lib/api';

const expenseTypes = [
  { value: 'FUEL', label: 'Yakıt' },
  { value: 'MAINTENANCE', label: 'Bakım' },
  { value: 'INSURANCE', label: 'Sigorta' },
  { value: 'TAX', label: 'Vergi' },
  { value: 'REPAIR', label: 'Onarım' },
  { value: 'OTHER', label: 'Diğer' },
];

export default function AddExpensePage() {
  const params = useParams<{ id: string }>();
  const vehicleId = params?.id as string;
  const router = useRouter();

  const [form, setForm] = useState({
    type: 'FUEL',
    amount: 0,
    currency: 'TRY',
    date: new Date().toISOString().slice(0, 10),
    mileageAtExpense: '',
    notes: '',
    receiptFileUrl: '',
  });
  const [previewStatus, setPreviewStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  useEffect(() => {
    if (!form.receiptFileUrl) {
      setPreviewStatus('idle');
      return;
    }
    setPreviewStatus('loading');
  }, [form.receiptFileUrl]);

  const isImageUrl = useMemo(() => {
    if (!form.receiptFileUrl) {
      return false;
    }
    return /(\.png|\.jpe?g|\.gif|\.webp|\.bmp|\.svg)$/i.test(form.receiptFileUrl.split('?')[0]);
  }, [form.receiptFileUrl]);

  useEffect(() => {
    if (form.receiptFileUrl && !isImageUrl) {
      setPreviewStatus('loaded');
    }
  }, [form.receiptFileUrl, isImageUrl]);

  const createMutation = useMutation({
    mutationFn: () =>
      ExpensesApi.createForVehicle(vehicleId, {
        ...form,
        amount: Number(form.amount),
        mileageAtExpense: form.mileageAtExpense ? Number(form.mileageAtExpense) : undefined,
        source: form.receiptFileUrl ? 'OCR' : 'MANUAL',
      }),
    onSuccess: () => {
      router.push(`/vehicles/${vehicleId}`);
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate();
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold text-slate-800">Masraf Ekle</h1>
      <form className="mt-6 grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-slate-700">Masraf Türü</label>
          <select
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            {expenseTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Tutar</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: Number(e.target.value) }))}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Para Birimi</label>
          <input
            value={form.currency}
            onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Tarih</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Kilometre</label>
          <input
            type="number"
            value={form.mileageAtExpense}
            onChange={(e) => setForm((prev) => ({ ...prev, mileageAtExpense: e.target.value }))}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Notlar</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Fiş URL (OCR için)</label>
          <input
            value={form.receiptFileUrl}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                receiptFileUrl: e.target.value.trim(),
              }))
            }
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="https://..."
          />
          <p className="mt-2 text-xs text-slate-500">Gerçek yükleme entegrasyonu yerine şimdilik URL girebilirsin.</p>
          {form.receiptFileUrl && (
            <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fiş Önizlemesi</p>
              {isImageUrl ? (
                <div className="mt-3 flex justify-center">
                  <img
                    src={form.receiptFileUrl}
                    alt="Fiş önizleme"
                    className="max-h-64 rounded-md border border-slate-200 object-contain"
                    onLoad={() => setPreviewStatus('loaded')}
                    onError={() => setPreviewStatus('error')}
                  />
                </div>
              ) : (
                <div className="mt-3 rounded-md bg-white p-3 text-sm text-slate-600">
                  <p className="mb-2">Bu bağlantıyı yeni sekmede açarak fişi görüntüleyebilirsin.</p>
                  <a
                    className="font-medium text-slate-900 underline"
                    href={form.receiptFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setPreviewStatus('loaded')}
                  >
                    Bağlantıyı Aç
                  </a>
                </div>
              )}
              {previewStatus === 'loading' && isImageUrl && (
                <p className="mt-3 text-xs text-slate-500">Önizleme yükleniyor...</p>
              )}
              {previewStatus === 'error' && (
                <p className="mt-3 text-xs text-red-500">
                  Önizleme yüklenemedi. Lütfen URL'yi kontrol et veya başka bir bağlantı dene.
                </p>
              )}
            </div>
          )}
        </div>
        <div className="md:col-span-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
