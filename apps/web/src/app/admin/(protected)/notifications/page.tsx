'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  Building2,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  CheckCheck,
} from 'lucide-react';
import adminApi from '@/lib/admin-api';
import { cn } from '@/lib/cn';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  companyId: string | null;
  company: { name: string } | null;
  metadata: any;
  isRead: boolean;
  createdAt: string;
}

const typeConfig: Record<string, { icon: any; color: string }> = {
  NEW_COMPANY: { icon: Building2, color: 'text-blue-400 bg-blue-500/10' },
  PAYMENT_RECEIVED: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10' },
  PAYMENT_OVERDUE: { icon: AlertTriangle, color: 'text-red-400 bg-red-500/10' },
  SUBSCRIPTION_CANCELLED: { icon: XCircle, color: 'text-orange-400 bg-orange-500/10' },
  TRIAL_EXPIRING: { icon: Clock, color: 'text-amber-400 bg-amber-500/10' },
  SYSTEM: { icon: Info, color: 'text-gray-400 bg-gray-500/10' },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export default function AdminNotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['admin', 'notifications'],
    queryFn: async () => {
      const { data } = await adminApi.get('/admin/notifications');
      return data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => adminApi.patch(`/admin/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications', 'unread'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => adminApi.patch('/admin/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications', 'unread'] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Notificações</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} não ${unreadCount === 1 ? 'lida' : 'lidas'}`
              : 'Todas lidas'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#64748b]">
            <Bell className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1e2d4a]/50">
            {notifications.map((notif) => {
              const config = typeConfig[notif.type] ?? typeConfig.SYSTEM;
              const Icon = config.icon;
              return (
                <div
                  key={notif.id}
                  className={cn(
                    'flex items-start gap-4 px-5 py-4 transition-colors',
                    !notif.isRead
                      ? 'bg-primary-600/5 hover:bg-primary-600/10'
                      : 'hover:bg-[#0f1a2e]/50',
                  )}
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                      config.color.split(' ')[1],
                    )}
                  >
                    <Icon className={cn('w-4.5 h-4.5', config.color.split(' ')[0])} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn('text-sm font-medium', !notif.isRead ? 'text-white' : 'text-[#94a3b8]')}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[#64748b] text-sm mt-0.5">{notif.message}</p>
                    {notif.company && (
                      <p className="text-[#475569] text-xs mt-1">{notif.company.name}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-[#475569] text-xs">{timeAgo(notif.createdAt)}</span>
                    {!notif.isRead && (
                      <button
                        onClick={() => markReadMutation.mutate(notif.id)}
                        className="text-[10px] text-[#64748b] hover:text-primary-400 transition-colors"
                      >
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
