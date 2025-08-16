import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://onggabriel.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    template: '%s | ONG Gabriel',
    default: 'ONG Gabriel',
  },
  description: 'ONG Gabriel - falar é a melhor soluçao.',
  applicationName: 'ONG Gabriel',
  generator: 'Next.js',
  keywords: ['prevenção ao suicídio','prevencao ao suicidio','saúde mental','saude mental','apoio emocional','apoio psicológico','apoio psicologico','atendimento psicológico','atendimento psicologico','psicologia','psicoterapia','bem-estar emocional','bem estar emocional','ajuda psicológica gratuita','ajuda psicologica gratuita','ajuda para depressão','ajuda para depressao','crise emocional','pensamentos suicidas','ideação suicida','como buscar ajuda psicológica','como buscar ajuda psicologica','onde procurar ajuda emocional','ONG de saúde mental','ong de saude mental','projeto social saúde mental','projeto social saude mental','atendimento online psicologia','escuta ativa','acolhimento psicológico','acolhimento psicologico','ONG Gabriel','Ong Gabriel','organização sem fins lucrativos','organizacao sem fins lucrativos','terceiro setor','voluntariado','doações','doacoes','Brasil','serviço gratuito','servico gratuito'],
  category: 'ONG',
  viewport: { width: 'device-width', initialScale: 1 },
  referrer: 'strict-origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      maxImagePreview: 'large',
      maxSnippet: -1,
      maxVideoPreview: -1,
    },
  },
  themeColor: '#ffffff',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: [{ rel: 'icon', url: '/favicon.ico' }],
  },
  openGraph: {
    title: 'ONG Gabriel',
    description: 'Prevenção ao suicídio - você não está sozinho.',
    url: 'https://onggabriel.com',
    siteName: 'ONG Gabriel',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: 'https://durable.sfo3.cdn.digitaloceanspaces.com/blocks/85VApAlnDchgoYqMrh1TlVycndZzKdzSxHvpElnPjia2rsCGXAhkZ9pWy8BQIqkY.png',
        width: 759,
        height: 641,
        alt: 'ONG Gabriel - amor, diversão, educação',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'ONG Gabriel',
    statusBarStyle: 'default',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};
