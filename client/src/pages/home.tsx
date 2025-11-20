import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { getSession } from '@/lib/supabaseClient';
import Header from '@/components/header';
import { ArrowRight, Music, Zap, Shield } from 'lucide-react';
import { SiYoutubemusic, SiSpotify } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import MusicConverter from '@/components/music-converter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/routes';
import { useLoginModal } from '@/contexts/LoginModalContext';

export default function Home() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { openModal } = useLoginModal();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        // If authenticated, redirect to dashboard
        setLocation(ROUTES.DASHBOARD);
      }
    };
    checkSession();
  }, [setLocation]);

  const handleGetStarted = () => {
    openModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-x-hidden">
      <Header />

      <main className="container mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 pt-4 sm:pt-8">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <SiYoutubemusic className="text-youtube text-3xl sm:text-4xl md:text-5xl mr-2 sm:mr-3" />
            <ArrowRight className="text-gray-400 mx-2 sm:mx-3" size={24} />
            <SiSpotify className="text-spotify text-3xl sm:text-4xl md:text-5xl ml-2 sm:ml-3" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            {t('home.title', 'Convert Music Links Instantly')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            {t(
              'home.subtitle',
              'Convert YouTube Music links to Spotify seamlessly. Fast, accurate, and free.',
            )}
          </p>
          <div className="max-w-3xl mx-auto">
            <MusicConverter size="full" />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          <Card>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-100 rounded-full">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {t('home.feature1.title', 'Lightning Fast')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t(
                    'home.feature1.desc',
                    'Convert your music links in seconds with our optimized conversion engine.',
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-green-100 rounded-full">
                  <Music className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {t('home.feature2.title', 'High Accuracy')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t(
                    'home.feature2.desc',
                    'Advanced matching algorithms ensure you get the right track every time.',
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-purple-100 rounded-full">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {t('home.feature3.title', 'Privacy Focused')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t(
                    'home.feature3.desc',
                    "We don't store your URLs or personal data. Your privacy is our priority.",
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 px-4">
            {t('home.howItWorks', 'How It Works')}
          </h2>
          <div className="space-y-6 sm:space-y-8 px-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                1
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {t('home.step1.title', 'Copy YouTube Music URL')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t(
                    'home.step1.desc',
                    'Find the song on YouTube Music and copy its URL from your browser.',
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                2
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {t('home.step2.title', 'Paste and Convert')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t(
                    'home.step2.desc',
                    'Paste the URL into Linkfy and click the convert button.',
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                3
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {t('home.step3.title', 'Get Spotify Link')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t(
                    'home.step3.desc',
                    'Copy the generated Spotify URL and enjoy your music on Spotify.',
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section with Compact Converter */}
        <div className="py-8 sm:py-12 bg-blue-600 rounded-lg text-white mx-4 sm:mx-0">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-4">
              {t('home.cta.title', 'Ready to Convert Your Music?')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-4 px-4">
              {t(
                'home.cta.subtitle',
                'Join thousands of users converting music links every day.',
              )}
            </p>
          </div>

          {/* Quick Converter - Compact */}
          <div className="max-w-2xl mx-auto px-4">
            <MusicConverter size="compact" />
          </div>
        </div>
      </main>
    </div>
  );
}
