import type { Metadata } from 'next';
import Providers from './providers';
import '@/shared/styles/index.css';
import 'sonner/dist/styles.css';
import Header from '@/shared/ui/header/header';
import Footer from '@/shared/ui/footer/footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.homerunnie.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '홈러니(Homerunnie) | 직관 메이트 찾기',
    template: '%s | 홈러니(Homerunnie)',
  },
  description:
    '홈러니(Homerunnie)는 야구 직관 메이트를 찾고 함께 응원하는 커뮤니티입니다. KBO 경기에 같이 갈 메이트를 모집하고 채팅으로 소통하세요.',
  keywords: [
    '홈러니',
    'Homerunnie',
    '홈러니앱',
    '야구',
    '직관',
    '메이트',
    'KBO',
    '응원',
    '직관 메이트',
    '직관 모집',
    '야구 커뮤니티',
  ],
  applicationName: '홈러니(Homerunnie)',
  authors: [{ name: '홈러니(Homerunnie)' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '홈러니(Homerunnie)',
    title: '홈러니(Homerunnie) | 직관 메이트 찾기',
    description:
      '홈러니(Homerunnie)는 야구 직관 메이트를 찾고 함께 응원하는 커뮤니티입니다. KBO 경기에 같이 갈 메이트를 모집하고 채팅으로 소통하세요.',
    images: [
      {
        url: '/bg.png',
        width: 1200,
        height: 630,
        alt: '홈러니(Homerunnie)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '홈러니(Homerunnie) | 직관 메이트 찾기',
    description: '홈러니는 야구 직관 메이트를 찾고 함께 응원하는 커뮤니티입니다.',
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
  verification: {
    google: 'HkyRdKLVQFDNB4zYYTWLXNFs_b-StRh6Vah7R0UPieM',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Homerunnie',
  alternateName: ['홈러니', '홈러니앱'],
  url: SITE_URL,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Homerunnie',
  alternateName: ['홈러니', '홈러니앱'],
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans bg-gray-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
