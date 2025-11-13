'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../../components/layout/AppLayout';
import { VehiclesApi } from '../../lib/api';

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  currentMileage: number;
  plate?: string;
};

export default function VehiclesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ brand: '', model: '', year: 2020, currentMileage: 0, plate: '' });

  const { data: vehicles } = useQuery<Vehicle[]>({ queryKey: ['vehicles'], queryFn: VehiclesApi.list });

  const createMutation = useMutation({
    mutationFn: () => VehiclesApi.create({ ...form, year: Number(form.year), currentMileage: Number(form.currentMileage) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setShowForm(false);
      setForm({ brand: '', model: '', year: new Date().getFullYear(), currentMileage: 0, plate: '' });
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate();
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Araçlarım</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          {showForm ? 'Vazgeç' : 'Yeni araç ekle'}
        </button>
      </div>

      {showForm && (
        <form className="mt-6 grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700">Marka</label>
            <input
              value={form.brand}
              onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Model</label>
            <input
              value={form.model}
              onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Yıl</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm((prev) => ({ ...prev, year: Number(e.target.value) }))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Kilometre</label>
            <input
              type="number"
              value={form.currentMileage}
              onChange={(e) => setForm((prev) => ({ ...prev, currentMileage: Number(e.target.value) }))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Plaka</label>
            <input
              value={form.plate}
              onChange={(e) => setForm((prev) => ({ ...prev, plate: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Kaydet
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {vehicles?.map((vehicle) => (
          <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`} className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-800">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="mt-2 text-sm text-slate-500">Yıl: {vehicle.year}</p>
            <p className="text-sm text-slate-500">Kilometre: {vehicle.currentMileage}</p>
            {vehicle.plate && <p className="text-sm text-slate-500">Plaka: {vehicle.plate}</p>}
          </Link>
        ))}
        {(vehicles?.length ?? 0) === 0 && (
          <div className="rounded-lg bg-white p-6 text-center text-slate-500 shadow">
            Henüz araç eklenmedi.
          </div>
        )}
      </div>
    </AppLayout>
  );
}
