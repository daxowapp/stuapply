import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string, city: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'Turkey' });
  const temp = t(resolvedParams.city);
  return { title: temp ? temp + ' - Study in Turkey' : 'Study in Turkey' };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
