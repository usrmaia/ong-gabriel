"use client";

import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { CloudUpload, Download } from "lucide-react";

import { onSubmit } from "./actions";
import {
  Button,
  ButtonDownloadDocument,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { PsychProfile } from "./type";
import { MAX_PDF_SIZE_IN_BYTES } from "@/config/consts";

export function PrePsychFormRegistration({ psych }: { psych?: PsychProfile }) {
  const [state, formAction] = useActionState(onSubmit, {
    data: psych || undefined,
    success: false,
    error: { errors: [] },
  });

  const [hasXpSuicidePrevention, setHasXpSuicidePrevention] = useState<
    string | null
  >(
    state.data?.hasXpSuicidePrevention == undefined
      ? null
      : state.data?.hasXpSuicidePrevention
        ? "true"
        : "false",
  );

  const [fileName, setFileName] = useState({
    curriculumVitae: "",
    proofAddress: "",
  });

  const handleFileChange = (
    field: "curriculumVitae" | "proofAddress",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    console.log("File Size:", file?.size);
    if (file && file.size > MAX_PDF_SIZE_IN_BYTES) {
      alert("O arquivo selecionado é muito grande. O tamanho máximo é 500KB.");
      e.target.value = ""; // Clear the input
      return;
    }
    if (file) setFileName((prev) => ({ ...prev, [field]: file.name }));
    else setFileName((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    if (psych?.id) formData.append("id", psych.id);
    startTransition(() => formAction(formData));
  };

  useEffect(() => {
    if (state.success) return;

    const timeout = setTimeout(() => {
      const firstErrorKey = Object.keys(state.error?.properties || {})[0];
      if (firstErrorKey) {
        const errorElement = document.getElementById(`${firstErrorKey}-label`);
        if (errorElement) {
          errorElement.focus();
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }, 100);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.error]);

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col">
      <h3 className="text-center">Onde você vive hoje?</h3>

      <section className="flex flex-col gap-3 mt-4">
        <div className="flex justify-between items-center">
          <Label
            id="zipCode-label"
            htmlFor="zipCode"
            className="font-semibold text-foreground"
          >
            CEP
          </Label>
          <span className="text-xs">*Obrigatório</span>
        </div>
        <Input
          type="text"
          id="zipCode"
          name="zipCode"
          placeholder="00000-000"
          pattern="\d{5}-?\d{3}"
          maxLength={9}
          defaultValue={state.data?.zipCode || undefined}
          required
        />
        <span
          id="zipCode-error"
          role="alert"
          className="text-xs text-error h-2"
        >
          {state.error?.properties?.zipCode?.errors}
        </span>

        <div className="flex justify-between items-center">
          <Label
            id="street-label"
            htmlFor="street"
            className="font-semibold text-foreground"
          >
            Endereço
          </Label>
          <span className="text-xs">*Obrigatório</span>
        </div>
        <Input
          type="text"
          id="street"
          name="street"
          placeholder="Rua, Avenida, etc."
          defaultValue={state.data?.street || undefined}
          required
        />
        <span id="street-error" role="alert" className="text-xs text-error h-2">
          {state.error?.properties?.street?.errors}
        </span>

        <div className="flex justify-between items-center">
          <Label
            id="number-label"
            htmlFor="number"
            className="font-semibold text-foreground"
          >
            Número
          </Label>
          <span className="text-xs">*Obrigatório</span>
        </div>
        <Input
          type="text"
          id="number"
          name="number"
          placeholder="123"
          defaultValue={state.data?.number || undefined}
          required
        />
        <span id="number-error" role="alert" className="text-xs text-error h-2">
          {state.error?.properties?.number?.errors}
        </span>

        <Label
          id="complement-label"
          htmlFor="complement"
          className="font-semibold text-foreground"
        >
          Complemento
        </Label>
        <Input
          type="text"
          id="complement"
          name="complement"
          placeholder="Apt, Bloco, etc."
          defaultValue={state.data?.complement || undefined}
        />
        <span
          id="complement-error"
          role="alert"
          className="text-xs text-error h-2"
        >
          {state.error?.properties?.complement?.errors}
        </span>

        <div className="flex justify-between items-center">
          <Label
            id="city-label"
            htmlFor="city"
            className="font-semibold text-foreground"
          >
            Cidade
          </Label>
          <span className="text-xs">*Obrigatório</span>
        </div>
        <Input
          type="text"
          id="city"
          name="city"
          placeholder="Nome da cidade"
          defaultValue={state.data?.city || undefined}
          required
        />
        <span id="city-error" role="alert" className="text-xs text-error h-2">
          {state.error?.properties?.city?.errors}
        </span>

        <div className="flex justify-between items-center">
          <Label
            id="district-label"
            htmlFor="district"
            className="font-semibold text-foreground"
          >
            Bairro
          </Label>
          <span className="text-xs">*Obrigatório</span>
        </div>
        <Input
          type="text"
          id="district"
          name="district"
          placeholder="Nome do bairro"
          defaultValue={state.data?.district || undefined}
          required
        />
        <span
          id="district-error"
          role="alert"
          className="text-xs text-error h-2"
        >
          {state.error?.properties?.district?.errors}
        </span>

        <div className="flex justify-between items-center">
          <Label
            id="state-label"
            htmlFor="state"
            className="font-semibold text-foreground"
          >
            Estado
          </Label>
          <span className="text-xs">*Obrigatório</span>
        </div>
        <Select name="state" defaultValue={state.data?.state || undefined}>
          <SelectTrigger aria-required className="w-full">
            <SelectValue placeholder="UF" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Estados</SelectLabel>
              {stateCodes.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <span id="state-error" role="alert" className="text-xs text-error h-2">
          {state.error?.properties?.state?.errors}
        </span>
      </section>

      <h3 className="text-center">
        Queremos saber um pouco sobre você profissional
      </h3>

      <section className="flex flex-col gap-3 mt-4">
        <div className="flex justify-between items-center">
          <Label
            id="CRP-label"
            htmlFor="CRP"
            className="font-semibold text-foreground"
          >
            CRP
          </Label>
          <span className="text-xs">*Obrigatório</span>
        </div>
        <Input
          type="text"
          id="CRP"
          name="CRP"
          placeholder="12345678"
          maxLength={8}
          minLength={8}
          pattern="\d{8}"
          defaultValue={state.data?.CRP || undefined}
          required
        />
        <span id="CRP-error" role="alert" className="text-xs text-error h-2">
          {state.error?.properties?.CRP?.errors}
        </span>

        <div className="flex justify-between items-center">
          <Label
            htmlFor="hasXpSuicidePrevention"
            className="font-semibold text-foreground"
          >
            Você tem experiência na prevenção ao suicídio?
          </Label>
          <span className="text-xs">*Obrigatório</span>
        </div>
        <RadioGroup
          name="hasXpSuicidePrevention"
          value={hasXpSuicidePrevention || ""}
          onValueChange={setHasXpSuicidePrevention}
          className="flex gap-8"
          required
        >
          <div className="flex gap-2 items-center">
            <RadioGroupItem value="true" />
            <Label>Sim</Label>
          </div>
          <div className="flex gap-2 items-center">
            <RadioGroupItem value="false" />
            <Label>Não</Label>
          </div>
        </RadioGroup>
        <span
          id="hasXpSuicidePrevention-error"
          role="alert"
          className="text-xs text-error h-2"
        >
          {state.error?.properties?.hasXpSuicidePrevention?.errors}
        </span>

        <Label
          id="note-label"
          htmlFor="note"
          className="font-semibold text-foreground"
        >
          Quer compartilhar algo com a gente?
        </Label>
        <Textarea
          id="note"
          name="note"
          placeholder="Conte-nos um pouco mais sobre você, suas experiências, motivações..."
          rows={4}
          maxLength={2048}
          defaultValue={state.data?.note || undefined}
        />
        <span id="note-error" role="alert" className="text-xs text-error h-2">
          {state.error?.properties?.note?.errors}
        </span>
      </section>

      <h3 className="text-center">Precisamos de alguns documentos!</h3>

      <p className="text-sm text-gray-600 text-center mb-6">
        Nesse momento de triagem, precisamos que você nos envie seu currículo e
        uma imagem do seu CIP (Cédula de Identidade Profissional).
      </p>
      <p className="text-sm text-gray-600 text-center mb-6">
        Caso queira, pode compartilhar arquivos complementares com a gente.
      </p>

      <section className="flex flex-col gap-3 mt-4">
        {psych?.curriculumVitaeId && (
          <ButtonDownloadDocument documentId={psych?.curriculumVitaeId}>
            <span className="text-sm underline inline-flex items-center gap-1">
              Baixar currículo enviado <Download size={16} />
            </span>
          </ButtonDownloadDocument>
        )}
        <div className="flex justify-between items-center">
          <Label
            id="curriculumVitaeId-label"
            htmlFor="curriculumVitaeId"
            className="font-semibold text-foreground"
          >
            Carregar Currículo em PDF
          </Label>
          <span className="text-xs">*Obrigatório</span>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Input
              type="file"
              id="curriculumVitae"
              name="curriculumVitae"
              accept=".pdf"
              required={!state.data?.id}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange("curriculumVitae", e)}
            />
            <span className="items-center justify-between p-2 file:text-foreground placeholder:text-s-taupe-gray-100 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-s-silver-100 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-sm">
              {fileName.curriculumVitae ||
                state.data?.curriculumVitae?.name ||
                "Escolha seu currículo"}
            </span>
          </div>
          <Label
            id="curriculumVitaeId-label"
            htmlFor="curriculumVitae"
            className="cursor-pointer text-sm rounded-full p-2 bg-s-saffron-100 hover:bg-s-saffron-200 text-s-brass-300 hover:text-s-brass-200"
          >
            <CloudUpload size={20} />
          </Label>
        </div>
        <span
          id="curriculumVitaeId-error"
          role="alert"
          className="text-xs text-error h-2"
        >
          {state.error?.properties?.curriculumVitaeId?.errors}
        </span>

        {psych?.curriculumVitaeId && (
          <ButtonDownloadDocument documentId={psych?.proofAddressId}>
            <span className="text-sm underline inline-flex items-center gap-1">
              Baixar comprovante enviado <Download size={16} />
            </span>
          </ButtonDownloadDocument>
        )}
        <div className="flex justify-between items-center">
          <Label
            id="proofAddressId-label"
            htmlFor="proofAddressId"
            className="font-semibold text-foreground"
          >
            Carregar Comprovante de Endereço em PDF
          </Label>
          <span className="text-xs">*Obrigatório</span>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Input
              type="file"
              id="proofAddress"
              name="proofAddress"
              accept=".pdf"
              required={!state.data?.id}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange("proofAddress", e)}
            />
            <span className="items-center justify-between p-2 file:text-foreground placeholder:text-s-taupe-gray-100 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-s-silver-100 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-sm">
              {fileName.proofAddress ||
                state.data?.proofAddress?.name ||
                "Escolha seu comprovante de endereço"}
            </span>
          </div>
          <Label
            id="proofAddressId-label"
            htmlFor="proofAddress"
            className="cursor-pointer text-sm rounded-full p-2 bg-s-saffron-100 hover:bg-s-saffron-200 text-s-brass-300 hover:text-s-brass-200"
          >
            <CloudUpload size={20} />
          </Label>
        </div>
        <span
          id="proofAddressId-error"
          role="alert"
          className="text-xs text-error h-2"
        >
          {state.error?.properties?.proofAddressId?.errors}
        </span>
      </section>

      <Button className="mt-8" type="submit">
        Enviar Candidatura
      </Button>

      <span role="alert" className="text-xs text-error text-center h-2">
        {state.error?.errors}
      </span>
    </form>
  );
}

const stateCodes = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];
