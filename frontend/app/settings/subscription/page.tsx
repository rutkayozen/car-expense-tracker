'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../../../components/layout/AppLayout';
import { SubscriptionApi } from '../../../lib/api';

const plans = [
  { id: 'FREE', name: 'Free', description: 'Tek araç için temel özellikler' },
  { id: 'PREMIUM', name: 'Premium', description: 'AI analizleri ve sınırsız araç' },
  { id: 'FLEET_SMALL', name: 'Fleet Small', description: '5 araca kadar filo yönetimi' },
  { id: 'FLEET_MEDIUM', name: 'Fleet Medium', description: '20 araca kadar gelişmiş raporlama' },
  { id: 'FLEET_LARGE', name: 'Fleet Large', description: '20+ araç için sınırsız kullanım' },
];

export default function SubscriptionSettingsPage() {
  const queryClient = useQueryClient();
  const { data: subscription } = useQuery({ queryKey: ['subscription'], queryFn: SubscriptionApi.getMine });

  const changePlanMutation = useMutation({
    mutationFn: (plan: string) => SubscriptionApi.changePlan(plan),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscription'] }),
  });

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold text-slate-800">Abonelik Ayarları</h1>
      <p className="mt-2 text-sm text-slate-500">
        Planını yönet ve AI destekli özelliklerden en iyi şekilde faydalan.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const isActive = subscription?.plan === plan.id;
          return (
            <div key={plan.id} className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-slate-800">{plan.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
              <button
                onClick={() => changePlanMutation.mutate(plan.id)}
                disabled={changePlanMutation.isPending}
                className={`mt-4 rounded-md px-4 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-900 text-white hover:bg-slate-700'
                }`}
              >
                {isActive ? 'Aktif Plan' : 'Planı Seç'}
              </button>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
