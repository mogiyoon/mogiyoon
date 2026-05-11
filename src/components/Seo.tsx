import React from 'react';
import { Helmet } from 'react-helmet-async';
import { formatSectionTitle, type SeoLocale } from '../seo-copy';

export const SITE_URL = 'https://mogiyoon.com';
export const SITE_NAME = 'Mogiyoon';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

const toAbsoluteUrl = (input: string | undefined, base: string): string | undefined => {
  if (!input) return undefined;
  if (/^https?:\/\//i.test(input)) return input;
  if (input.startsWith('/')) return `${base}${input}`;
  return `${base}/${input}`;
};

const localeToOg = (locale: SeoLocale): 'ko_KR' | 'en_US' =>
  locale === 'en' ? 'en_US' : 'ko_KR';

export interface SeoProps {
  section?: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  locale?: SeoLocale;
  keywords?: string;
  noindex?: boolean;
}

const Seo: React.FC<SeoProps> = ({
  section,
  description,
  path = '/',
  image,
  type = 'website',
  locale = 'ko',
  keywords,
  noindex = false,
}) => {
  const title = formatSectionTitle(section, locale, SITE_NAME);
  const canonical = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImage = toAbsoluteUrl(image, SITE_URL) ?? DEFAULT_OG_IMAGE;
  const ogLocale = localeToOg(locale);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default Seo;
