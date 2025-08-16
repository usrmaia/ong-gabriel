/**
 * Script para testar funcionalidades PWA
 * Execute no console do navegador após carregar a aplicação
 */

// Testar se Service Worker está registrado
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready
    .then((registration) => {
      console.log("✅ Service Worker registrado:", registration);
    })
    .catch((error) => {
      console.log("❌ Erro no Service Worker:", error);
    });
} else {
  console.log("❌ Service Worker não suportado");
}

// Testar se o manifesto está carregado
fetch("/manifest.json")
  .then((response) => response.json())
  .then((manifest) => {
    console.log("✅ Manifesto carregado:", manifest);
  })
  .catch((error) => {
    console.log("❌ Erro ao carregar manifesto:", error);
  });

// Verificar se a aplicação pode ser instalada
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("✅ PWA pode ser instalada");
});

// Verificar se está rodando como PWA
if (window.matchMedia("(display-mode: standalone)").matches) {
  console.log("✅ Aplicação rodando como PWA instalada");
} else {
  console.log("ℹ️ Aplicação rodando no navegador");
}

// Verificar cache do Service Worker
if ("caches" in window) {
  caches.keys().then((cacheNames) => {
    console.log("📦 Caches disponíveis:", cacheNames);

    cacheNames.forEach((cacheName) => {
      caches.open(cacheName).then((cache) => {
        cache.keys().then((keys) => {
          console.log(
            `📂 Cache ${cacheName}:`,
            keys.map((req) => req.url),
          );
        });
      });
    });
  });
}

// Testar conectividade offline
console.log("🌐 Status da rede:", navigator.onLine ? "Online" : "Offline");

window.addEventListener("online", () => {
  console.log("✅ Conexão restaurada");
});

window.addEventListener("offline", () => {
  console.log("⚠️ Conexão perdida");
});
