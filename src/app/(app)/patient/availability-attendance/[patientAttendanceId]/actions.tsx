"use server";

import { redirect } from "next/navigation";

import {
  getPatientAttendanceById,
  updatePatientAttendanceFromAvailability,
} from "@/services";
import { Result } from "@/types";

export async function onSubmit(
  patientAttendanceId: string,
  prev: Result,
  formData: FormData,
): Promise<Result> {
  const formDataObject = Object.fromEntries(formData.entries());

  const availabilityId = formDataObject.availabilityAttendanceId as string;

  if (availabilityId) {
    const patientAttendanceResult =
      await getPatientAttendanceById(patientAttendanceId);

    if (!patientAttendanceResult.success)
      return {
        success: false,
        error: patientAttendanceResult.error,
      };

    const updatedAttendanceResult =
      await updatePatientAttendanceFromAvailability(patientAttendanceId, {
        availabilityId: availabilityId,
      });

    if (!updatedAttendanceResult.success) return updatedAttendanceResult;
  }

  redirect("/patient/form-anamnesis/success");
}
