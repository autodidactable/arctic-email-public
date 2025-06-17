import { useContextData } from '@/hooks/use-context-data';
import {
  Briefcase,
  Handshake,
  DollarSign,
  Workflow,
} from 'lucide-react';
import { formatStageLabel } from '@/lib/utils';
import { DealStageSelector } from '../deal-stage-selector';

export function ContextHeader({ email }: { email?: string }) {
  const { data, isLoading } = useContextData(email);
  if (!email || isLoading || !data?.contact) return null;

  const account = data.contact.companyName;
  const deal = data.deals?.[0];

  return (
    <div className="px-4 pt-3 pb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Account */}
        {account && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1 text-sm shadow-sm ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700">
            <Briefcase className="h-3.5 w-3.5 opacity-70 relative top-[0.5px]" />
            <span className="font-semibold">Account:</span>
            <span className="font-normal text-zinc-500 dark:text-zinc-400">{account}</span>
          </span>
        )}

        {/* Opportunity */}
        {deal?.name && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1 text-sm shadow-sm ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700">
            <Handshake className="h-3.5 w-3.5 opacity-70 relative top-[0.5px]" />
            <span className="font-semibold">Opportunity:</span>
            <span className="font-normal text-zinc-500 dark:text-zinc-400">{deal.name}</span>
          </span>
        )}

        {/* Amount */}
        {deal?.amount && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1 text-sm shadow-sm ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700">
            <DollarSign className="h-3.5 w-3.5 opacity-70 relative top-[0.5px]" />
            <span className="font-semibold">:</span>
            <span className="font-normal text-zinc-500 dark:text-zinc-400">
              {Number(deal.amount).toLocaleString()}
            </span>
          </span>
        )}

        {/* Stage (editable) */}
        {deal?.stage && deal?.id && (
          <DealStageSelector
            dealId={deal.id}
            currentStageId={deal.stage}
            label="Stage"
            icon={Workflow}
          />
        )}
      </div>
    </div>
  );
}
