import RegisterConfirmationForm from "./form";

export default async function RegisterConfirmationPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h3 className="text-center">Obrigado por se cadastrar!</h3>
      <p className="text-center">
        Enviamos um email com um código de confirmação para o endereço fornecido
        durante o cadastro. Preencha o código para ativar sua conta e começar a
        usar nossos serviços.
      </p>
      <RegisterConfirmationForm userId={userId} />
    </div>
  );
}
