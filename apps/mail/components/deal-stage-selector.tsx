import { useEffect, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Check, Loader2 } from 'lucide-react';

type Stage = {
  id: string;
  label: string;
};

type Props = {
  dealId: string | number;
  currentStageId: string;
  label?: string;
  icon?: React.ElementType;
};

export function DealStageSelector({
  dealId,
  currentStageId,
  label,
  icon: Icon,
}: Props) {
  const [stages, setStages] = useState<Stage[]>([]);
  const [selected, setSelected] = useState(currentStageId);
  const [loading, setLoading] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_PUBLIC_BACKEND_URL || 'http://localhost:8787';
    const fetchStages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/deal-stages`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error('❌ Expected array of stages, got:', data);
          return;
        }

        setStages(data);
        if (data.some((s) => s.id === currentStageId)) {
          setSelected(currentStageId);
        }
      } catch (err) {
        console.error('❌ Failed to fetch stages', err);
      }
    };

    fetchStages();
  }, [currentStageId]);

  const handleChange = async (newStageId: string) => {
    const API_BASE = import.meta.env.VITE_PUBLIC_BACKEND_URL || 'http://localhost:8787';
    setSelected(newStageId);
    setLoading(true);
    setJustUpdated(false);

    try {
      const res = await fetch(`${API_BASE}/api/deal-stages/update-stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, stageId: newStageId }),
      });

      if (!res.ok) throw new Error('Failed to update stage');

      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2000);
    } catch (err) {
      console.error('Stage update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1 text-sm shadow-sm ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
    >
      {Icon && <Icon className="h-3.5 w-3.5 opacity-70 relative top-[0.5px]" />}
      {label && <span className="font-semibold">{label}:</span>}

      <Select value={selected} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger
          className="bg-transparent px-0 py-0 h-auto min-h-0 border-none ring-0 shadow-none focus:outline-none focus:ring-0 cursor-pointer data-[state=open]:bg-transparent"
        >
          <div className="flex items-center gap-1">
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
            ) : (
              <>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {stages.find((s) => s.id === selected)?.label ?? 'Select Stage'}
                </span>
                {justUpdated && (
                  <Check className="h-3.5 w-3.5 text-green-500 animate-fade-in" />
                )}
              </>
            )}
          </div>
        </SelectTrigger>

        <SelectContent className="z-50" side="bottom" align="start">
          {stages.length === 0 ? (
            <div className="px-3 py-2 text-muted-foreground text-sm">Loading stages…</div>
          ) : (
            stages.map((stage) => (
              <SelectItem key={stage.id} value={stage.id}>
                {stage.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
