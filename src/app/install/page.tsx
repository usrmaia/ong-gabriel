"use client";

import {
  Smartphone,
  Download,
  CheckCircle,
  Info,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PWAInstallBanner } from "@/components/pwa-install-banner";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import Link from "next/link";
import Image from "next/image";

export default function InstallAppPage() {
  const { canInstall, isInstalled } = usePWAInstall();

  const benefits = [
    {
      icon: <Download size={20} />,
      title: "Acesso Instantâneo",
      description: "Abra o app diretamente da tela inicial do seu dispositivo",
    },
    {
      icon: <Smartphone size={20} />,
      title: "Experiência Nativa",
      description: "Interface otimizada que funciona como um app nativo",
    },
    {
      icon: <CheckCircle size={20} />,
      title: "Notificações",
      description: "Receba lembretes sobre suas consultas e agendamentos",
    },
  ];

  const instructionsAndroid = [
    "Toque no botão 'Instalar' abaixo ou no ícone de menu do navegador (⋮)",
    "Selecione 'Adicionar à tela inicial' ou 'Instalar app'",
    "Confirme a instalação tocando em 'Instalar' ou 'Adicionar'",
    "O app aparecerá na sua tela inicial",
  ];

  const instructionsIOS = [
    "Abra este site no Safari do seu iPhone/iPad",
    "Toque no ícone de compartilhamento (□↗) na parte inferior",
    "Role para baixo e toque em 'Adicionar à Tela de Início'",
    "Toque em 'Adicionar' no canto superior direito",
  ];

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-s-powder-100 to-s-saffron-100/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-success" />
          </div>
          <h1 className="text-2xl font-bold text-s-charcoal-100 mb-4">
            App Já Instalado!
          </h1>
          <p className="text-s-taupe-gray-100 mb-6">
            O app da ONG Gabriel já está instalado no seu dispositivo. Você pode
            acessá-lo diretamente da tela inicial.
          </p>
          <Link href="/">
            <Button className="w-full bg-s-navy-100 text-s-butter-100">
              Ir para o App
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-s-powder-100 to-s-saffron-100/30">
      {/* Header */}
      <div className="bg-white border-b border-s-silver-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/ong-gabriel-logo.svg"
              alt="Logo ONG Gabriel"
              width={40}
              height={40}
            />
            <span className="font-semibold text-s-navy-100">ONG Gabriel</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Banner de instalação se disponível */}
        {canInstall && (
          <div className="mb-8">
            <PWAInstallBanner variant="card" showDismiss={false} />
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-s-saffron-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone size={40} className="text-s-brass-300" />
          </div>
          <h1 className="text-3xl font-bold text-s-charcoal-100 mb-4">
            Instale o App da ONG Gabriel
          </h1>
          <p className="text-lg text-s-taupe-gray-100 max-w-2xl mx-auto">
            Tenha acesso rápido e conveniente aos seus atendimentos
            psicológicos. Instale nosso app e mantenha-se conectado com o
            suporte que você precisa.
          </p>
        </div>

        {/* Benefícios */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-s-silver-100"
            >
              <div className="w-12 h-12 bg-s-saffron-100 rounded-lg flex items-center justify-center mb-4 text-s-brass-300">
                {benefit.icon}
              </div>
              <h3 className="font-semibold text-s-charcoal-100 mb-2">
                {benefit.title}
              </h3>
              <p className="text-s-taupe-gray-100 text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Seção de Instalação */}
        <div className="bg-white rounded-xl shadow-sm border border-s-silver-100 p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-s-charcoal-100 mb-4">
              Como Instalar
            </h2>
            {canInstall ? (
              <div>
                <p className="text-s-taupe-gray-100 mb-6">
                  Seu navegador suporta instalação automática. Clique no botão
                  abaixo:
                </p>
                <PWAInstallBanner
                  variant="button"
                  className="mx-auto text-lg px-8 py-3"
                  showDismiss={false}
                />
              </div>
            ) : (
              <p className="text-s-taupe-gray-100">
                Siga as instruções abaixo para instalar o app no seu
                dispositivo:
              </p>
            )}
          </div>

          {/* Instruções para diferentes plataformas */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Android/Chrome */}
            <div>
              <h3 className="font-semibold text-s-charcoal-100 mb-4 flex items-center gap-2">
                <Info size={20} className="text-s-brass-300" />
                Android / Chrome
              </h3>
              <ol className="space-y-3">
                {instructionsAndroid.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="bg-s-saffron-100 text-s-brass-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-s-taupe-gray-100 text-sm">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* iOS/Safari */}
            <div>
              <h3 className="font-semibold text-s-charcoal-100 mb-4 flex items-center gap-2">
                <Info size={20} className="text-s-brass-300" />
                iPhone / iPad (Safari)
              </h3>
              <ol className="space-y-3">
                {instructionsIOS.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="bg-s-saffron-100 text-s-brass-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-s-taupe-gray-100 text-sm">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-s-charcoal-100 mb-4">
            Pronto para começar?
          </h3>
          <p className="text-s-taupe-gray-100 mb-6">
            Instale o app agora e tenha acesso rápido aos seus atendimentos
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button
                variant="outline"
                className="border-s-navy-100 text-s-navy-100"
              >
                Continuar no Navegador
              </Button>
            </Link>
            {!canInstall && (
              <Button
                onClick={() => window.location.reload()}
                className="bg-s-navy-100 text-s-butter-100"
              >
                Verificar Novamente
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
