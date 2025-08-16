"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";

interface InstallPWAProps {
  onClose?: () => void;
}

export function InstallPWA({ onClose }: InstallPWAProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Já está instalado
  }

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  const handleClose = () => {
    setShowInstructions(false);
    onClose?.();
  };

  if (showInstructions && isIOS) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Instalar ONG Gabriel</h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-600">Para instalar no iOS:</div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 text-xs rounded-full flex items-center justify-center font-semibold">
                  1
                </span>
                <span className="text-sm">
                  Toque no ícone de compartilhar na parte inferior da tela
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 text-xs rounded-full flex items-center justify-center font-semibold">
                  2
                </span>
                <span className="text-sm">
                  Role para baixo e toque em &ldquo;Adicionar à Tela de
                  Início&rdquo;
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 text-xs rounded-full flex items-center justify-center font-semibold">
                  3
                </span>
                <span className="text-sm">
                  Toque em &ldquo;Adicionar&rdquo; no canto superior direito
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 p-4 m-4 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Smartphone className="h-6 w-6 text-blue-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Instale o app da ONG Gabriel
          </h3>
          <p className="mt-1 text-sm text-blue-700">
            Tenha acesso rápido aos nossos serviços direto da sua tela inicial
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={isIOS ? handleShowInstructions : onClose}
              className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
            >
              <Download className="h-3 w-3" />
              {isIOS ? "Ver instruções" : "Instalar"}
            </button>
            <button
              onClick={handleClose}
              className="text-xs text-blue-600 hover:text-blue-800 px-3 py-1.5"
            >
              Agora não
            </button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleClose}
            className="text-blue-400 hover:text-blue-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
