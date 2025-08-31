import Image from "next/image";

export default function SuccessPage() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h2 className="!text-success text-center">
        Seu cadastro foi realizado com sucesso!
      </h2>
      <p className="font-raleway text-xl text-center text-s-charcoal-100">
        Nossa equipe vai entrar em contato com você para avaliar a sua
        contribuição com a ONG Gabriel.
      </p>
      <Image
        src="/hands.png"
        alt="Mãos unidas"
        width={144}
        height={144}
        className="max-w-md md:max-w-md lg:max-w-md w-full h-auto"
      />
    </div>
  );
}
