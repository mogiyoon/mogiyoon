import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { AwardItem, CertItem } from './types';
import { itemVariants, listVariants } from './animations';

const AwardsAndCertsTab: React.FC<{ awards: AwardItem[]; certs: CertItem[] }> = ({ awards, certs }) => {
  const { t } = useTranslation('introduction');
  const { t: tCommon } = useTranslation('common');

  return (
    <motion.div variants={listVariants} className="space-y-8">
      {/* Awards */}
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-content-muted">
          {tCommon('info.awards')}
        </p>
        <div className="relative">
          <div className="absolute left-[11px] top-3 bottom-3 w-px bg-slate-200 hidden sm:block" />
          <div className="space-y-3">
            {awards.map((item) => {
              const desc = t(`awards.${item.id}.description`, {
                returnObjects: true,
                defaultValue: [],
              }) as string[];

              return (
                <motion.div key={item.id} variants={itemVariants} className="sm:pl-8 relative">
                  <div className="absolute left-0 top-5 w-[23px] h-[23px] rounded-full border-2 border-slate-900 bg-surface hidden sm:flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                  </div>
                  <div className="rounded-3xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h3 className="text-base font-bold text-content">
                        {t(`awards.${item.id}.title`)}
                      </h3>
                      <span className="shrink-0 text-sm font-medium text-content-muted bg-surface-muted px-3 py-1 rounded-full">
                        {t(`awards.${item.id}.period`)}
                      </span>
                    </div>
                    {Array.isArray(desc) && desc.filter(Boolean).length > 0 && (
                      <ul className="mt-4 space-y-1.5">
                        {desc.filter(Boolean).map((d, i) => (
                          <li key={i} className="flex gap-2 text-sm text-content-meta">
                            <span className="shrink-0 text-slate-300 mt-0.5">—</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-sm font-semibold uppercase tracking-widest text-content-muted">
          {tCommon('info.certificates')}
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Certificates */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {certs.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="rounded-3xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center mb-3">
              <svg className="w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-content">
              {t(`certificate.${item.id}.title`)}
            </h3>
            <p className="mt-2 text-sm text-content-muted">
              {t(`certificate.${item.id}.period`)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AwardsAndCertsTab;
