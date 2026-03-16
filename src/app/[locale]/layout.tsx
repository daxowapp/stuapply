import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import "../globals.css";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | StudentApply',
    default: 'StudentApply | Free University Placement in Turkey',
  },
  description: 'Apply to top universities in Turkey with StudentApply. Free and transparent university application process.',
};


const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} min-h-screen bg-neutral-50 flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
