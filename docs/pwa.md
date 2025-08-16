# Progressive Web App (PWA) - ONG Gabriel

## Visão Geral

A aplicação da ONG Gabriel foi configurada como uma Progressive Web App (PWA), permitindo que os usuários instalem o aplicativo em seus dispositivos móveis e desktop para uma experiência similar a aplicativos nativos.

## Funcionalidades PWA Implementadas

### 1. Manifesto Web App (`/manifest.json`)

- **Nome da aplicação**: ONG Gabriel - Atendimento Psicológico Gratuito
- **Nome curto**: ONG Gabriel
- **Modo de exibição**: standalone (sem barra de navegação do browser)
- **Tema**: Azul (#1e40af) alinhado com a identidade visual
- **Ícones**: Múltiplos tamanhos para diferentes dispositivos
- **Screenshot**: Para prévia na instalação
- **Categorias**: health, medical, lifestyle

### 2. Service Worker (`/sw.js`)

- **Cache estratégico**: Recursos essenciais são armazenados em cache
- **Fallback offline**: Página offline customizada quando não há conexão
- **Atualizações automáticas**: Gerenciamento inteligente de versões de cache

### 3. Componentes React

#### PWAProvider

- Gerencia a instalação e atualização da PWA
- Detecta se o dispositivo suporta instalação
- Mostra prompts personalizados baseados no dispositivo

#### InstallPWA

- Interface amigável para instalação
- Instruções específicas para iOS
- Design responsivo e acessível

#### useServiceWorker Hook

- Registra o Service Worker automaticamente
- Gerencia ciclo de vida e atualizações

### 4. Configurações de Metadata

- Meta tags específicas para PWA
- Configurações Apple Web App
- Tema colors e splash screens
- Ícones para diferentes plataformas

### 5. Middleware Otimizado

- Headers de cache apropriados para recursos PWA
- Configuração de Content-Type para Service Worker
- Otimização de performance para assets estáticos

## Como Testar a PWA

### Desktop (Chrome/Edge)

1. Abra a aplicação no navegador
2. Aguarde o prompt de instalação aparecer
3. Clique em "Instalar" ou use o ícone na barra de endereço
4. O app será instalado como aplicativo standalone

### Mobile (Android)

1. Abra no Chrome mobile
2. Aguarde o banner de instalação
3. Toque em "Adicionar à tela inicial"
4. Confirme a instalação

### Mobile (iOS - Safari)

1. Abra no Safari
2. Aguarde o prompt personalizado aparecer
3. Siga as instruções:
   - Toque no ícone de compartilhar
   - Role e toque em "Adicionar à Tela de Início"
   - Confirme com "Adicionar"

## Recursos Offline

### Página Offline

- Interface amigável quando não há conexão
- Botão para tentar reconectar
- Design consistente com a aplicação

### Cache Strategy

- **Network First**: Para conteúdo dinâmico
- **Cache First**: Para recursos estáticos (ícones, CSS, JS)
- **Offline Fallback**: Para navegação quando offline

## Monitoramento e Analytics

### Service Worker Events

- Logs de instalação e ativação
- Métricas de uso offline
- Atualizações de cache

### User Experience

- Prompts não-intrusivos
- Timing otimizado para mostrar instalação
- Personalização por dispositivo

## Configurações de Desenvolvimento

### Build e Deploy

```bash
# Build da aplicação com PWA
npm run build

# Start da aplicação
npm start
```

### Variáveis de Ambiente

```env
# URL da aplicação (necessário para PWA)
NEXT_PUBLIC_URL=https://onggabriel.org.br

# Ambiente de produção
NODE_ENV=production
```

## Arquivos PWA

```
public/
├── manifest.json           # Web App Manifest
├── sw.js                   # Service Worker
├── offline.html           # Página offline
├── icon-16x16.png         # Favicon 16x16
├── icon-32x32.png         # Favicon 32x32
├── icon-192x192.png       # Ícone Android
├── icon-512x512.png       # Ícone Android/Desktop
├── apple-touch-icon.png   # Ícone iOS
└── robots.txt             # Incluindo arquivos PWA

src/
├── components/
│   ├── pwa-provider.tsx   # Provider principal PWA
│   └── install-pwa.tsx    # Componente de instalação
├── hooks/
│   └── useServiceWorker.ts # Hook do Service Worker
└── middleware.ts          # Headers PWA otimizados
```

## Benefícios da PWA

### Para Usuários

- **Acesso rápido**: Ícone na tela inicial
- **Experiência nativa**: Interface fullscreen
- **Funcionalidade offline**: Acesso mesmo sem internet
- **Performance**: Carregamento mais rápido com cache
- **Menor uso de dados**: Recursos em cache local

### Para a Organização

- **Maior engajamento**: Usuários instalam e retornam mais
- **Notificações push**: Possibilidade futura de notificações
- **Analytics melhorados**: Métricas de instalação e uso
- **SEO**: Melhor classificação em mecanismos de busca
- **Custo-efetivo**: Uma aplicação para todas as plataformas

## Próximos Passos

1. **Push Notifications**: Implementar notificações para agendamentos
2. **Background Sync**: Sincronização offline de dados
3. **App Shortcuts**: Atalhos para funcionalidades principais
4. **Web Share API**: Compartilhamento nativo
5. **Analytics PWA**: Métricas específicas de instalação e uso

## Suporte e Compatibilidade

### Navegadores Suportados

- ✅ Chrome 76+ (Android/Desktop)
- ✅ Safari 11.1+ (iOS)
- ✅ Firefox 79+ (Android/Desktop)
- ✅ Edge 79+ (Desktop)
- ✅ Samsung Internet 12+

### Funcionalidades por Plataforma

| Funcionalidade        | Android | iOS | Desktop |
| --------------------- | ------- | --- | ------- |
| Instalação            | ✅      | ✅  | ✅      |
| Ícone na tela inicial | ✅      | ✅  | ✅      |
| Splash screen         | ✅      | ✅  | ✅      |
| Fullscreen            | ✅      | ✅  | ✅      |
| Service Worker        | ✅      | ✅  | ✅      |
| Cache offline         | ✅      | ✅  | ✅      |
| Push notifications    | ✅      | ❌  | ✅      |

## Troubleshooting

### PWA não aparece para instalação

1. Verifique se está em HTTPS
2. Confirme que o manifest.json está acessível
3. Verifique se o Service Worker está registrado
4. Teste em modo incógnito

### Service Worker não funciona

1. Verifique o console do navegador
2. Confirme que o arquivo sw.js está acessível
3. Teste a estratégia de cache
4. Verifique se não há conflitos com outros SWs

### Ícones não aparecem

1. Verifique se os arquivos de ícone existem
2. Confirme os caminhos no manifest.json
3. Teste diferentes tamanhos
4. Valide o formato dos ícones (PNG recomendado)
