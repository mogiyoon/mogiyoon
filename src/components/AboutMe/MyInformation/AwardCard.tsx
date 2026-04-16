import type React from "react";

const medalByRank: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export const AwardCard: React.FC<{
  rank?: number;
  title: React.ReactNode;
  period: React.ReactNode;
  description?: string[];
}> = ({ rank, title, period, description }) => {
  const medal = rank ? medalByRank[rank] : undefined;

  return (
    <div className="my-5 rounded-3xl border border-line bg-surface/80 shadow-sm backdrop-blur">
      <div className="grid grid-cols-[84px_1fr] gap-4 p-6">
        {/* Rank/Medal */}
        <div className="flex flex-col items-center justify-center rounded-modal border border-line/70 bg-surface p-3">
          <div className="text-3xl">{medal ?? "🏆"}</div>
          <div className="mt-2 text-xs font-semibold text-content-secondary">
            {rank ? `#${rank}` : "Award"}
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0">
          <h3 className="text-base font-bold text-content leading-snug">{title}</h3>
          <p className="mt-1 text-sm text-content-tertiary">{period}</p>

          {description?.filter(Boolean).length ? (
            <ul className="mt-3 list-disc pl-5 text-sm text-content-meta">
              {description.filter(Boolean).map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
};