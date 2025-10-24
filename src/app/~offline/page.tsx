import Image from "next/image";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-5">
      <div className="text-center max-w-sm">
        <div className="mb-5">
          <Image
            src="/icon-192x192.png"
            alt="ONG Gabriel Logo"
            width={50}
            height={50}
            className="mx-auto object-contain"
          />
        </div>

        <h1 className="text-2xl font-semibold text-slate-700 mb-4">
          Você está offline
        </h1>

        <p className="text-slate-500 leading-relaxed mb-6">
          Não foi possível conectar à internet. Verifique sua conexão e tente
          novamente.
        </p>
      </div>
    </div>
  );
}
