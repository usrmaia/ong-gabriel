import { Document, Psych } from "@prisma/client";

export type PsychProfile = Psych & {
  user: {
    role: string[];
  };
  curriculumVitae: Document | null;
  proofAddress: Document | null;
};
