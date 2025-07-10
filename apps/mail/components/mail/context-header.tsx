import { useContextData } from '@/hooks/use-context-data';
import { Briefcase, Handshake, DollarSign, Workflow } from 'lucide-react';
import { formatStageLabel } from '@/lib/utils';
import { DealStageSelector } from '../deal-stage-selector';

export function ContextHeader({ email }: { email?: string }) {
  const { data, isLoading } = useContextData(email);
  if (!email || isLoading || !data?.contact) return null;
  console.log('🧠 ContextHeader: data', data);

  const account = data.contact.companyName;
  const deal = data.deals?.[0];

  return (
    <div className="px-4 pt-3 pb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Account */}
        {account && (
          <Tag icon={Briefcase} label="Account" value={account} />
        )}

        {/* Opportunity */}
        {deal?.name && (
          <Tag icon={Handshake} label="Opportunity" value={deal.name} />
        )}

        {/* Amount */}
        {deal?.amount && (
          <Tag
            icon={DollarSign}
            value={`$ ${Number(deal.amount).toLocaleString()}`}
          />
        )}

        {/* Stage (Editable) */}
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

function Tag({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label?: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1 text-sm shadow-sm ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700">
      <Icon className="h-3.5 w-3.5 opacity-70 relative top-[0.5px]" />
      {label && <span className="font-semibold">{label}:</span>}
      <span className="font-normal text-zinc-500 dark:text-zinc-400">{value}</span>
    </span>
  );
}
