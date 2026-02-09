"use client";

import Image from "next/image";
import { Role, User } from "@prisma/client";
import { useActionState, useMemo, useState, useTransition } from "react";

import {
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
} from "@/components/ui";

import { addRoleAction, deleteRoleAction, saveBaseInfoAction } from "./actions";

interface ProfileFormProps {
  user: User;
  isOwnProfile: boolean;
  isAdmin: boolean;
}

export function ProfileForm({ user, isOwnProfile, isAdmin }: ProfileFormProps) {
  const [roleError, setRoleError] = useState<string | null>(null);
  const [roleSuccess, setRoleSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const roles = user.role as Role[];

  const availableRoles = useMemo(() => {
    const all = Object.values(Role);
    return all.filter((r) => !roles.includes(r));
  }, [roles]);

  const [state, formAction] = useActionState(saveBaseInfoAction, {
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

  const handleAddRole = () => {
    setRoleError(null);
    setRoleSuccess(null);

    if (!selectedRole) {
      setRoleError("Selecione uma role para adicionar.");
      return;
    }
    if (roles.includes(selectedRole)) {
      setRoleError("Não é permitido adicionar duas Roles iguais.");
      return;
    }

    startTransition(async () => {
      const res = await addRoleAction(user.id, selectedRole);
      if (!res.success) {
        setRoleError(res.error?.errors?.[0] || "Erro ao adicionar role.");
        return;
      }
      setRoleSuccess("Role adicionada com sucesso!");
      // Recarregar a página simples: deixa o servidor trazer os dados atualizados
      window.location.reload();
    });
  };

  const handleDeleteRole = (role: Role) => {
    setRoleError(null);
    setRoleSuccess(null);

    startTransition(async () => {
      const res = await deleteRoleAction(user.id, role);
      if (!res.success) {
        setRoleError(res.error?.errors?.[0] || "Erro ao remover role.");
        return;
      }
      setRoleSuccess("Role removida com sucesso!");
      window.location.reload();
    });
  };
  const roleLabel = (role: Role) => {
    switch (role) {
      case "USER":
        return "Usuário";
      case "ADMIN":
        return "Administrador";
      case "EMPLOYEE":
        return "Psicologo/Colaborador";
      case "PATIENT":
        return "Paciente";
      case "PREPSYCHO":
        return "Pré-Psicólogo";
      default:
        return role;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3">
        <Image
          src={user.image || "/default-user.jpg"}
          alt="Foto do usuário"
          width={96}
          height={96}
          className="rounded-full object-cover"
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
            <span className="text-xs">*Obrigatório</span>
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
            <span className="text-xs">*Obrigatório</span>
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
            <span className="text-xs">*Obrigatório</span>
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
            <span className="text-xs">*Obrigatório</span>
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
          <Button className="mt-8" type="submit">
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
        <section className="flex flex-col gap-3 mt-2">
          <h4 className="font-semibold">Funções</h4>

          <div className="flex flex-col gap-2">
            {roles.map((role) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm">{roleLabel(role)}</span>

                <Button
                  type="button"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => handleDeleteRole(role)}
                >
                  Deletar
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label className="font-semibold text-foreground">
                Adicionar função
              </Label>

              <Select
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole((value as Role) || "")
                }
                disabled={isPending || availableRoles.length === 0}
              >
                <SelectTrigger className="mt-2 w-full">
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

                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {(() => {
                          switch (role) {
                            case "USER":
                              return "Usuário";
                            case "ADMIN":
                              return "Administrador";
                            case "EMPLOYEE":
                              return "Psicologo/Colaborador";
                            case "PATIENT":
                              return "Paciente";
                            case "PREPSYCHO":
                              return "Pré-Psicólogo";
                            default:
                              return role; // fallback se entrar role nova no enum
                          }
                        })()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={handleAddRole}
              disabled={isPending || !selectedRole}
            >
              Adicionar
            </Button>
          </div>

          <span role="alert" className="text-xs text-center">
            {roleError ? (
              <span className="text-error">{roleError}</span>
            ) : roleSuccess ? (
              <span className="text-success">{roleSuccess}</span>
            ) : null}
          </span>
        </section>
      )}
    </div>
  );
}
