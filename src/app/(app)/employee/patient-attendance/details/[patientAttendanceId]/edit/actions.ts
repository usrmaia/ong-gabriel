"use server";

import { PatientAttendance } from "@prisma/client";

import { env } from "@/config/env";
import logger from "@/config/logger";
import { updatePatientAttendance } from "@/services";
import { Result } from "@/types";
import { sendEmail } from "@/infra";

export async function onSubmit(
  initialState: Result<PatientAttendance>,
  formData: FormData,
): Promise<Result<PatientAttendance>> {
  try {
    const formDataObject = Object.fromEntries(
      formData.entries(),
    ) as unknown as PatientAttendance;

    const updatedAttendanceResult = await updatePatientAttendance(
      initialState.data!.id || formDataObject.id,
      {
        dateAt: formDataObject.dateAt,
        durationMinutes: formDataObject.durationMinutes
          ? Number(formDataObject.durationMinutes)
          : undefined,
        note: formDataObject.note,
      },
    );

    sendEmail({
      to: "georgemaiaf@gmail.com",
      template: "pre-psycho-failed",
      context: {
        userName: "Josivânia",
        pendingNote: "Por favor, complete as informações pendentes.",
      },
    });
    if (!updatedAttendanceResult.success)
      return {
        success: false,
        data: { ...initialState.data!, ...formDataObject },
        error: updatedAttendanceResult.error,
      };
    return {
      success: true,
      data: { ...initialState.data!, ...updatedAttendanceResult.data },
    };
  } catch (error: any) {
    logger.error("Erro ao atualizar agendamento do paciente:", error);
    return {
      success: false,
      error: { errors: ["Erro ao atualizar agendamento do paciente!"] },
    };
  }
}
