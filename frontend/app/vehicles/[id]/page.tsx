'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../../../components/layout/AppLayout';
import { AIAnalysisApi, ExpensesApi, RemindersApi, VehiclesApi } from '../../../lib/api';

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>();
  const vehicleId = params?.id as string;
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [typeFilter, setTypeFilter] = useState(searchParams?.get('type') ?? '');
  const [startDate, setStartDate] = useState(searchParams?.get('startDate') ?? '');
  const [endDate, setEndDate] = useState(searchParams?.get('endDate') ?? '');
  const [reminderForm, setReminderForm] = useState({ type: 'MAINTENANCE', dueDate: '', description: '' });

  const { data: vehicle } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => VehiclesApi.get(vehicleId),
    enabled: !!vehicleId,
  });

  const { data: expenses } = useQuery({
    queryKey: ['expenses', vehicleId, typeFilter, startDate, endDate],
    queryFn: () =>
      ExpensesApi.listForVehicle(vehicleId, {
        type: typeFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
    enabled: !!vehicleId,
  });

  const { data: reminders } = useQuery({
    queryKey: ['reminders', vehicleId],
    queryFn: () => RemindersApi.listForVehicle(vehicleId),
    enabled: !!vehicleId,
  });

  const analyzeMutation = useMutation({
    mutationFn: () => AIAnalysisApi.analyzeVehicle({ vehicleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', vehicleId] });
    },
  });

  const createReminderMutation = useMutation({
    mutationFn: () => RemindersApi.createForVehicle(vehicleId, reminderForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', vehicleId] });
      setReminderForm({ type: 'MAINTENANCE', dueDate: '', description: '' });
    },
  });

  const latestAnalysis = useMemo(() => vehicle?.aiResults?.[0], [vehicle]);

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            {vehicle?.brand} {vehicle?.model}
          </h1>
          <p className="text-sm text-slate-500">Kilometre: {vehicle?.currentMileage}</p>
        </div>
        <Link
          href={`/vehicles/${vehicleId}/add-expense`}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Masraf ekle
        </Link>
      </div>

      <section className="mt-6 rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-slate-800">Masraf Filtreleri</h2>
        <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Tür</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Tümü</option>
              <option value="FUEL">Yakıt</option>
              <option value="MAINTENANCE">Bakım</option>
              <option value="INSURANCE">Sigorta</option>
              <option value="TAX">Vergi</option>
              <option value="REPAIR">Onarım</option>
              <option value="OTHER">Diğer</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Başlangıç Tarihi</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Bitiş Tarihi</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="px-4 py-2">Tarih</th>
                <th className="px-4 py-2">Tür</th>
                <th className="px-4 py-2">Tutar</th>
                <th className="px-4 py-2">Not</th>
              </tr>
            </thead>
            <tbody>
              {expenses?.map((expense: any) => (
                <tr key={expense.id} className="border-t">
                  <td className="px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 capitalize">{expense.type.toLowerCase()}</td>
                  <td className="px-4 py-2">{Number(expense.amount).toFixed(2)} {expense.currency}</td>
                  <td className="px-4 py-2">{expense.notes ?? '-'}</td>
                </tr>
              ))}
              {(expenses?.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">AI Analizi</h2>
          <button
            onClick={() => analyzeMutation.mutate()}
            disabled={analyzeMutation.isPending}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {analyzeMutation.isPending ? 'Analiz ediliyor...' : 'Analiz çalıştır'}
          </button>
        </div>
        {latestAnalysis ? (
          <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
            {latestAnalysis.summaryText}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Henüz analiz bulunmuyor.</p>
        )}
      </section>

      <section className="mt-6 rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-slate-800">Hatırlatıcılar</h2>
        <form
          className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            createReminderMutation.mutate();
          }}
        >
          <div>
            <label className="text-sm font-medium text-slate-600">Tür</label>
            <select
              value={reminderForm.type}
              onChange={(e) => setReminderForm((prev) => ({ ...prev, type: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="INSPECTION">Muayene</option>
              <option value="INSURANCE">Sigorta</option>
              <option value="TAX">Vergi</option>
              <option value="MAINTENANCE">Bakım</option>
              <option value="CUSTOM">Özel</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Son Tarih</label>
            <input
              type="date"
              value={reminderForm.dueDate}
              onChange={(e) => setReminderForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-600">Açıklama</label>
            <input
              value={reminderForm.description}
              onChange={(e) => setReminderForm((prev) => ({ ...prev, description: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Örn. 10.000 km bakımı"
            />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={createReminderMutation.isPending}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              Hatırlatıcı ekle
            </button>
          </div>
        </form>
        <div className="mt-6 space-y-3">
          {reminders?.map((reminder: any) => (
            <div key={reminder.id} className="rounded-md border px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{reminder.type}</span>
                <span className="text-slate-500">{new Date(reminder.dueDate).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 text-slate-600">{reminder.description ?? 'Açıklama yok'}</p>
            </div>
          ))}
          {(reminders?.length ?? 0) === 0 && <p className="text-sm text-slate-500">Henüz hatırlatıcı eklenmemiş.</p>}
        </div>
      </section>
    </AppLayout>
  );
}
