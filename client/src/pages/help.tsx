import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { 
  HelpCircle, 
  MessageCircle, 
  ExternalLink, 
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { SiYoutubemusic, SiSpotify, SiGithub } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';
import { useState } from 'react';

const faqData = [
  {
    question: 'How does Linkfy work?',
    answer: 'Linkfy uses YouTube Data API and Spotify Web API to extract track information and find matching songs between platforms.',
  },
  {
    question: 'What platforms are supported?',
    answer: 'Currently, Linkfy supports conversion from YouTube Music to Spotify. More platforms will be added in future updates.',
  },
  {
    question: 'How accurate are the conversions?',
    answer: 'Linkfy uses advanced matching algorithms to find the best matches. Accuracy depends on the availability of songs on both platforms and the quality of metadata.',
  },
  {
    question: 'Is Linkfy free to use?',
    answer: 'Yes, Linkfy is completely free to use. No subscription or payment required.',
  },
  {
    question: 'What about my privacy?',
    answer: 'Linkfy is privacy-focused. We don\'t store your URLs or personal data. All conversions are processed temporarily and securely.',
  },
];

export default function Help() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-surface p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('help.title', 'Help & Support')}
          </h1>
          <p className="text-gray-600">
            {t('help.subtitle', 'Get help with Linkfy and learn how to use it effectively')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Quick Start Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                {t('help.quickStart', 'Quick Start Guide')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">{t('help.step1.title', 'Copy YouTube Music URL')}</h3>
                    <p className="text-sm text-gray-600">
                      {t('help.step1.desc', 'Go to YouTube Music and copy the URL of the song you want to convert')}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <SiYoutubemusic className="h-4 w-4 text-youtube" />
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        https://music.youtube.com/watch?v=...
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">{t('help.step2.title', 'Paste and Convert')}</h3>
                    <p className="text-sm text-gray-600">
                      {t('help.step2.desc', 'Paste the URL in Linkfy and click "Convert to Spotify"')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">{t('help.step3.title', 'Get Spotify Link')}</h3>
                    <p className="text-sm text-gray-600">
                      {t('help.step3.desc', 'Copy the generated Spotify URL and enjoy your music')}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <SiSpotify className="h-4 w-4 text-spotify" />
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        https://open.spotify.com/track/...
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {t('help.faqTitle', 'Frequently Asked Questions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {faqData.map((faq, index) => (
                  <div key={index} className="border rounded-lg">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-4 text-sm text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Support Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {t('help.support', 'Get Support')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <SiGithub className="h-6 w-6" />
                    <h3 className="font-medium">{t('help.github', 'GitHub Issues')}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {t('help.githubDesc', 'Report bugs or request features on our GitHub repository')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://github.com/prismaymedia/linkfy/issues', '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('help.openIssue', 'Open Issue')}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="h-6 w-6" />
                    <h3 className="font-medium">{t('help.community', 'Community')}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {t('help.communityDesc', 'Join our community for discussions and help')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="w-full"
                  >
                    {t('help.comingSoon', 'Coming Soon')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips & Tricks */}
          <Card>
            <CardHeader>
              <CardTitle>{t('help.tips', 'Tips & Tricks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {t('help.tip1', 'Make sure the YouTube Music URL is for a specific song, not a playlist or channel')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {t('help.tip2', 'If a song is not found on Spotify, try searching for alternative versions or covers')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {t('help.tip3', 'Use the history feature to keep track of your successful conversions')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {t('help.tip4', 'Check the settings page to customize your conversion preferences')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={() => setLocation(ROUTES.DASHBOARD)} variant="outline">
              {t('help.backToDashboard', 'Back to Dashboard')}
            </Button>
            <Button onClick={() => setLocation(ROUTES.SETTINGS)} variant="outline">
              {t('help.settings', 'Settings')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}