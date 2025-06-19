import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


export default function PersonalPage() {
    return (
        <div className="flex flex-col items-center">
            <div>
                Barras de progresso aqui
            </div>

            <h1 className="text-center">Olá, Fulano, conte mais sobre você!</h1>

            <section className="flex w-full flex-col items-center gap-8 p-4 mt-8">
                {/* Name */}
                <div className="grid w-full max-w-sm items-center gap-3">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="name" className="font-semibold">Qual o seu nome completo?</Label>
                        <span className="text-xs">*Obrigatório</span>
                    </div>
                    <Input type="text" id="name" placeholder="Nome" />
                </div>

                {/* Apelido */}
                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="alias" className="font-semibold">Como devemos chamar você?</Label>
                    <Input type="text" id="alias" placeholder="Nome social" />
                </div>

                {/* Date of Birth */}
                <div className="grid w-full max-w-sm items-center gap-3">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="dateBirth" className="font-semibold">Qual o seu nome completo?</Label>
                        <span className="text-xs">*Obrigatório</span>
                    </div>
                    <Input type="date" id="dateBirth" placeholder="DD/MM/AAAA" />
                </div>

                {/* Phone Number */}
                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="alias" className="font-semibold">Qual o seu número de telefone?</Label>
                    <Input type="text" id="alias" placeholder="Ex.: (99) 9 9999-9999" />
                </div>

                {/* Live with*/}
                <div className="grid w-full max-w-sm items-center gap-3">
                    <div className="flex justify-between items-center">
                        <Label className="font-semibold">Com quem você mora?</Label>
                        <span className="text-xs">*Obrigatório</span>
                    </div>

                    <RadioGroup defaultValue="LiveWith" className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="family" id="family" />
                            <Label htmlFor="family" className="text-">Com minha família</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="friends" id="friends" />
                            <Label htmlFor="friends">Com amigos</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="ortherPersons" id="persons" />
                            <Label htmlFor="persons">Outras pessoas</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="alone" id="alone" />
                            <Label htmlFor="alone">Sozinho</Label>
                        </div>
                    </RadioGroup>
                </div>
            </section>

      <Button className="w-screen max-w-sm mt-8">Continuar</Button>
        </div>
    );
}