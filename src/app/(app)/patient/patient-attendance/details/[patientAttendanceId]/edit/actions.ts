"use server";

import { PatientAttendance } from "@prisma/client";

import { updatePatientAttendanceFromPatient } from "@/services";
import { Result } from "@/types";

export async function onSubmit(
  patientAttendanceId: string,
  prev: Result<PatientAttendance>,
  formData: FormData,
): Promise<Result<PatientAttendance>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as PatientAttendance;

  const updatedAttendanceResult = await updatePatientAttendanceFromPatient(
    patientAttendanceId,
    { feedback: formDataObject.feedback! },
  );

  return {
    ...updatedAttendanceResult,
    data: formDataObject,
  };
}
