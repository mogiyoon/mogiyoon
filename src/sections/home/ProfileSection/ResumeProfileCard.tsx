import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ResumeProfileSourceData } from '../../../utils/resumePreview';
import { resumeLinkOrder } from './animations';

const ResumeProfileCard: React.FC<{
  profile: ResumeProfileSourceData;
  onOpenPreview: () => void;
}> = ({ profile, onOpenPreview }) => {
  const { t } = useTranslation('common');

  return (
    <div className="rounded-3xl border border-line bg-surface/85 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-content">{profile.name}</h2>
          <p className="mt-1 text-sm font-medium text-content-secondary">{profile.targetRole}</p>
        </div>
        <button
          type="button"
          onClick={onOpenPreview}
          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          {t('resume.preview')}
        </button>
      </div>

      <div className={`mt-5 grid gap-3 ${profile.phone ? 'sm:grid-cols-2' : ''}`}>
        <div className="rounded-2xl bg-surface-subtle px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-content-muted">
            {t('resume.builder.email')}
          </p>
          <p className="mt-1 text-sm font-medium text-content-secondary">{profile.email}</p>
        </div>
        {profile.phone && (
          <div className="rounded-2xl bg-surface-subtle px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-content-muted">
              {t('resume.builder.phone')}
            </p>
            <p className="mt-1 text-sm font-medium text-content-secondary">{profile.phone}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {resumeLinkOrder.map((key) =>
          profile.links[key] ? (
            <a
              key={`profile-link-${key}`}
              href={profile.links[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-content-secondary transition-colors hover:border-slate-400 hover:text-content"
            >
              {t(`resume.linkLabel.${key}`, { defaultValue: key })}
            </a>
          ) : null
        )}
      </div>

      <p className="mt-5 text-sm leading-6 text-content-secondary">{profile.intro.line}</p>
      <ul className="mt-4 space-y-2">
        {profile.intro.bullets.map((bullet, index) => (
          <li key={`resume-bullet-${index}`} className="flex gap-3 text-sm text-content-meta">
            <span className="mt-1 text-slate-300">•</span>
            <span>{bullet.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeProfileCard;
