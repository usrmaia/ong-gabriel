"use client";

import { CalendarFold, Trash2 } from "lucide-react";
import { AvailabilityAttendance } from "@prisma/client";

import { Card, CardAction, CardContent } from "./card";
import { Result } from "@/types";

export const CardAvailabilityAttendance = (props: {
  availabilityAttendance: AvailabilityAttendance;
  state?: Result<string>;
  onDelete?: () => void;
}) => {
  return (
    <div className="w-full">
      <Card className="flex flex-row justify-between items-center w-full p-4">
        <CardContent className="flex items-center gap-2 p-0 w-0">
          <CalendarFold className="text-s-azure-100 flex-shrink-0" />
          <p className="text-nowrap font-raleway font-black text-s-charcoal-100">
            {props.availabilityAttendance.startAt.toLocaleDateString(
              "pt-BR",
              {},
            )}
          </p>
          <p className="text-nowrap font-raleway text-s-charcoal-100">
            {props.availabilityAttendance.startAt.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            às{" "}
            {props.availabilityAttendance.endAt.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </CardContent>
        {props.onDelete && (
          <CardAction>
            <div
              className="p-2 border text-white rounded-full bg-error flex items-center justify-center"
              onClick={() => props.onDelete && props.onDelete()}
            >
              <Trash2 />
            </div>
          </CardAction>
        )}
      </Card>
      {props.state && !props.state.success && (
        <div className="text-error font-raleway text-sm text-center mt-2">
          {props.state.error?.errors?.[0]}
        </div>
      )}
    </div>
  );
};
