import React from 'react';
import { mockInvoiceData } from '../../data/mock';

const getProgressWidth = (amount: number) => {
  if (amount >= 189300) return 'w-full';
  if (amount >= 42100) return 'w-2/3';
  return 'w-1/3';
};

export const InvoiceOverviewCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Invoice Overview</p>
          <h2 className="text-3xl font-extrabold text-ink mt-2">Latest Payments</h2>
        </div>
        <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-ink">Yearly</div>
      </div>

      <div className="space-y-6">
        {mockInvoiceData.map((invoice) => (
          <div key={invoice.status} className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-ink">{invoice.status}</p>
                <p className="text-sm text-muted">{invoice.count} invoices</p>
              </div>
              <p className="text-base font-semibold text-ink">${invoice.amount.toLocaleString()}</p>
            </div>
            <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r from-purple-700 to-indigo-500 ${getProgressWidth(invoice.amount)}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
