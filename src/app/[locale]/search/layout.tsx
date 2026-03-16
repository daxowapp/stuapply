import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'Search' });
  return { title: t('title') };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
