"use client";

import { useActionState } from "react";
import { Role } from "@prisma/client";

import { onSubmit } from "./action";
import {
  Button,
  CardUserAvatar,
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
import { roleLabel } from "@/schemas";

export default function UserListFilterPage() {
  const [state, formAction] = useActionState(onSubmit, {
    success: false,
    data: { users: [], filters: {} },
    error: { errors: [] },
  });

  return (
    <>
      <form action={formAction} className="flex flex-col gap-2 w-full">
        <Label htmlFor="query" className="font-semibold text-foreground">
          Buscar Usuários
        </Label>
        <Input
          name="query"
          type="text"
          defaultValue={state.data?.filters.query || ""}
          placeholder="Buscar por nome ou e-mail"
        />
        <Label htmlFor="role" className="font-semibold text-foreground">
          Filtrar por função
        </Label>
        <Select name="role" defaultValue="">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por função" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="p-2">Função</SelectLabel>
              {Object.values(Role).map((role) => (
                <SelectItem key={role} value={role}>
                  {roleLabel(role)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button className="mt-4" type="submit">
          Buscar
        </Button>
        <span role="alert" className="text-xs text-error text-center h-2">
          {state.error?.errors}
        </span>
      </form>
      <div className="grid grid-cols-2 gap-6">
        {state.data?.users?.map((user) => (
          <CardUserAvatar
            user={user}
            href={`/user/profile/${user.id}`}
            key={user.id}
          />
        ))}
      </div>
    </>
  );
}
