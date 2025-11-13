'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../../components/layout/AppLayout';
import { AIAnalysisApi, ExpensesApi, VehiclesApi } from '../../lib/api';

type Expense = {
  id: string;
  vehicleId: string;
  amount: string;
  currency: string;
  date: string;
  type: string;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  plate?: string;
};

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const { data: vehicles } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: VehiclesApi.list,
  });

  useEffect(() => {
    if (vehicles && vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ['expenses', 'all'],
    enabled: !!vehicles?.length,
    queryFn: async () => {
      if (!vehicles) return [];
      const expenseResponses = await Promise.all(
        vehicles.map((vehicle) => ExpensesApi.listForVehicle(vehicle.id)),
      );
      return expenseResponses.flat();
    },
  });

  const monthlyTotal = useMemo(() => {
    if (!expenses) return 0;
    const now = new Date();
    return expenses
      .filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [expenses]);

  const latestExpenses = useMemo(() => {
    if (!expenses) return [];
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  const analyzeMutation = useMutation({
    mutationFn: () =>
      AIAnalysisApi.analyzeVehicle({
        vehicleId: selectedVehicleId!,
      }),
    onSuccess: (data) => {
      setAnalysis(data);
      queryClient.invalidateQueries({ queryKey: ['ai-analysis', selectedVehicleId] });
    },
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-slate-500">Toplam Araç</p>
            <p className="mt-2 text-3xl font-semibold text-slate-800">{vehicles?.length ?? 0}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-slate-500">Bu Ayki Toplam Masraf</p>
            <p className="mt-2 text-3xl font-semibold text-slate-800">{monthlyTotal.toFixed(2)} ₺</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-slate-500">Seçili Araç</p>
            <select
              className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
              value={selectedVehicleId ?? ''}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
            >
              {vehicles?.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} {vehicle.plate ? `(${vehicle.plate})` : ''}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Son Masraflar</h2>
            <button
              onClick={() => analyzeMutation.mutate()}
              disabled={!selectedVehicleId || analyzeMutation.isPending}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {analyzeMutation.isPending ? 'Analiz yapılıyor...' : 'AI analizi çalıştır'}
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="px-4 py-2">Tarih</th>
                  <th className="px-4 py-2">Tür</th>
                  <th className="px-4 py-2">Tutar</th>
                </tr>
              </thead>
              <tbody>
                {latestExpenses.map((expense) => (
                  <tr key={expense.id} className="border-t">
                    <td className="px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 capitalize">{expense.type.toLowerCase()}</td>
                    <td className="px-4 py-2">{Number(expense.amount).toFixed(2)} {expense.currency}</td>
                  </tr>
                ))}
                {latestExpenses.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                      Henüz masraf eklenmedi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {analysis && (
            <div className="mt-6 rounded-md bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-700">AI Analiz Sonucu</h3>
              <p className="mt-2 text-sm text-slate-600">{analysis.summaryText}</p>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
