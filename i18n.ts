import { getRequestConfig } from 'next-intl/server';

export const locales = ['nl', 'fr'];
export const defaultLocale = 'nl';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
