import type { Metadata } from 'next';
import Providers from './providers';
import '@/shared/styles/index.css';
import 'sonner/dist/styles.css';
import Header from '@/shared/ui/header/header';
import Footer from '@/shared/ui/footer/footer';
import '@/mocks'; // MSW 초기화 (브라우저 환경에서만 동작)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.homerunnie.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Homerunnie | 직관 메이트 찾기',
    template: '%s | Homerunnie',
  },
  description:
    '야구 직관 메이트를 찾고 함께 응원하는 커뮤니티. KBO 경기에 같이 갈 메이트를 모집하고 채팅으로 소통하세요.',
  keywords: ['야구', '직관', '메이트', 'KBO', '응원', '직관 메이트', '직관 모집', '야구 커뮤니티'],
  applicationName: 'Homerunnie',
  authors: [{ name: 'Homerunnie' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: 'Homerunnie',
    title: 'Homerunnie | 직관 메이트 찾기',
    description:
      '야구 직관 메이트를 찾고 함께 응원하는 커뮤니티. KBO 경기에 같이 갈 메이트를 모집하고 채팅으로 소통하세요.',
    images: [
      {
        url: '/bg.png',
        width: 1200,
        height: 630,
        alt: 'Homerunnie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Homerunnie | 직관 메이트 찾기',
    description: '야구 직관 메이트를 찾고 함께 응원하는 커뮤니티',
    images: ['/bg.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="max-w-[1440px] mx-auto w-full flex-1 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-[120px]">
              <main>{children}</main>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
