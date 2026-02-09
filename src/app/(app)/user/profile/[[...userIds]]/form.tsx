"use client";

import Image from "next/image";
import { Role, User } from "@prisma/client";
import { startTransition, useActionState } from "react";

import { roleAction, saveBaseInfoAction } from "./actions";
import {
  Badge,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components/ui";
import { roleLabel } from "@/schemas";
import { Trash } from "lucide-react";

interface ProfileFormProps {
  user: User;
  isOwnProfile: boolean;
  isAdmin: boolean;
}

export function ProfileForm({ user, isOwnProfile, isAdmin }: ProfileFormProps) {
  const roles = user.role;
  const availableRoles = Object.values(Role)
    .filter((r) => !roles.includes(r))
    .sort((a, b) => roleLabel(a).localeCompare(roleLabel(b)));

  const [state, formAction, isPending] = useActionState(saveBaseInfoAction, {
    data: {
      name: user.name || "",
      full_name: user.full_name || "",
      date_of_birth: user.date_of_birth
        ? typeof user.date_of_birth === "string"
          ? user.date_of_birth
          : user.date_of_birth.toISOString().slice(0, 10)
        : new Date("2000-01-01").toISOString().slice(0, 10),
      phone: user.phone || "",
    },
    success: false,
    error: { errors: [] },
  });

  const [roleState, roleFormAction, isRolePending] = useActionState(
    roleAction,
    { success: false, error: { errors: [] } },
  );

  const handleRoleAction = (action: "add" | "delete", role: Role) => {
    const formData = new FormData();
    formData.append("action", action);
    formData.append("userId", user.id);
    formData.append("role", role);
    startTransition(() => roleFormAction(formData));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3">
        <Image
          src={user.image || "/default-user.jpg"}
          alt="Foto do usuário"
          width={96}
          height={96}
          className="rounded-full border-1 border-p-tealwave p-0.25 object-cover"
        />
      </div>

      <form action={formAction} className="flex flex-col">
        <section className="flex flex-col gap-3 mt-2">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="full_name"
              className="font-semibold text-foreground"
            >
              Nome completo
            </Label>
            {isOwnProfile && <span className="text-xs">*Obrigatório</span>}
          </div>
          <Input
            type="text"
            id="full_name"
            name="full_name"
            placeholder="Nome completo"
            defaultValue={state.data?.full_name}
            aria-describedby="full_name-error"
            disabled={!isOwnProfile}
          />
          <span
            id="full_name-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.full_name?.errors}
          </span>

          <div className="flex justify-between items-center">
            <Label htmlFor="name" className="font-semibold text-foreground">
              Nome de exibição
            </Label>
            {isOwnProfile && <span className="text-xs">*Obrigatório</span>}
          </div>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Nome social"
            defaultValue={state.data?.name}
            aria-describedby="name-error"
            disabled={!isOwnProfile}
          />
          <span id="name-error" role="alert" className="text-xs text-error h-2">
            {state.error?.properties?.name?.errors}
          </span>

          <div className="flex justify-between items-center">
            <Label
              htmlFor="date_of_birth"
              className="font-semibold text-foreground"
            >
              Data de nascimento
            </Label>
            {isOwnProfile && <span className="text-xs">*Obrigatório</span>}
          </div>
          <Input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            placeholder="DD/MM/AAAA"
            defaultValue={
              state.data?.date_of_birth ? state.data.date_of_birth : undefined
            }
            aria-describedby="date_of_birth-error"
            disabled={!isOwnProfile}
          />
          <span
            id="date_of_birth-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.date_of_birth?.errors}
          </span>

          <div className="flex justify-between items-center">
            <Label htmlFor="phone" className="font-semibold text-foreground">
              Telefone
            </Label>
            {isOwnProfile && <span className="text-xs">*Obrigatório</span>}
          </div>
          <Input
            type="tel"
            id="phone"
            name="phone"
            placeholder="(99) 9 9999-9999"
            defaultValue={state.data?.phone}
            aria-describedby="phone-error"
            pattern="[\(\)\s\-\+\d]+"
            disabled={!isOwnProfile}
          />
          <span
            id="phone-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.phone?.errors}
          </span>
        </section>

        {isOwnProfile && (
          <Button className="mt-4" type="submit" disabled={isPending}>
            Salvar
          </Button>
        )}

        <span role="alert" className="text-xs text-center h-2">
          {state.error?.errors ? (
            <span className="text-error">{state.error.errors}</span>
          ) : state.success ? (
            <span className="text-success">Sucesso!</span>
          ) : undefined}
        </span>
      </form>

      {isAdmin && (
        <section className="flex flex-col gap-4">
          <Separator className="bg-s-silver-100" />

          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Funções</h4>
            <span className="text-xs">*Clique para remover</span>
          </div>

          <div className="flex flex-wrap gap-2 w-full">
            {roles.map((role, index) => (
              <Badge
                key={role + index}
                variant="destructive"
                onClick={() => handleRoleAction("delete", role)}
              >
                {roleLabel(role)}
                <Trash data-icon="inline-end" />
              </Badge>
            ))}
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const role = formData.get("role") as Role;
              handleRoleAction("add", role);
            }}
          >
            <Label className="font-semibold text-foreground">
              Adicionar função
            </Label>
            <Select
              name="role"
              disabled={isRolePending || availableRoles.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    availableRoles.length === 0
                      ? "Sem funções disponíveis"
                      : "Selecione..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="p-2">Função</SelectLabel>
                  {availableRoles.map((role, index) => (
                    <SelectItem key={role + index} value={role}>
                      {roleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="w-full"
              disabled={isRolePending || availableRoles.length === 0}
            >
              Adicionar
            </Button>
            <span role="alert" className="text-xs text-center">
              {roleState.error ? (
                <span className="text-error">{roleState.error.errors}</span>
              ) : roleState.success ? (
                <span className="text-success">Sucesso!</span>
              ) : undefined}
            </span>
          </form>
        </section>
      )}
    </div>
  );
}
