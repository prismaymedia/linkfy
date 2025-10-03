import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { getSession } from '@/lib/supabaseClient';
import Header from '@/components/header';
import { ArrowRight, Music, Zap, Shield } from 'lucide-react';
import { SiYoutubemusic, SiSpotify } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/routes';

export default function Home() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

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
    setLocation(ROUTES.AUTH);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <div className="flex items-center justify-center mb-6">
            <SiYoutubemusic className="text-youtube text-5xl mr-3" />
            <ArrowRight className="text-gray-400 mx-3" size={32} />
            <SiSpotify className="text-spotify text-5xl ml-3" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('home.title', 'Convert Music Links Instantly')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('home.subtitle', 'Convert YouTube Music links to Spotify seamlessly. Fast, accurate, and free.')}
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="text-lg px-8 py-6"
          >
            {t('home.getStarted', 'Get Started')}
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-blue-100 rounded-full">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('home.feature1.title', 'Lightning Fast')}
                </h3>
                <p className="text-gray-600">
                  {t('home.feature1.desc', 'Convert your music links in seconds with our optimized conversion engine.')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-green-100 rounded-full">
                  <Music className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('home.feature2.title', 'High Accuracy')}
                </h3>
                <p className="text-gray-600">
                  {t('home.feature2.desc', 'Advanced matching algorithms ensure you get the right track every time.')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-purple-100 rounded-full">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('home.feature3.title', 'Privacy Focused')}
                </h3>
                <p className="text-gray-600">
                  {t('home.feature3.desc', 'We don\'t store your URLs or personal data. Your privacy is our priority.')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('home.howItWorks', 'How It Works')}
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('home.step1.title', 'Copy YouTube Music URL')}
                </h3>
                <p className="text-gray-600">
                  {t('home.step1.desc', 'Find the song on YouTube Music and copy its URL from your browser.')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('home.step2.title', 'Paste and Convert')}
                </h3>
                <p className="text-gray-600">
                  {t('home.step2.desc', 'Paste the URL into Linkfy and click the convert button.')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('home.step3.title', 'Get Spotify Link')}
                </h3>
                <p className="text-gray-600">
                  {t('home.step3.desc', 'Copy the generated Spotify URL and enjoy your music on Spotify.')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12 bg-blue-600 rounded-lg text-white">
          <h2 className="text-3xl font-bold mb-4">
            {t('home.cta.title', 'Ready to Convert Your Music?')}
          </h2>
          <p className="text-xl mb-6">
            {t('home.cta.subtitle', 'Join thousands of users converting music links every day.')}
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            {t('home.getStarted', 'Get Started')}
          </Button>
        </div>
      </main>
    </div>
  );
}
