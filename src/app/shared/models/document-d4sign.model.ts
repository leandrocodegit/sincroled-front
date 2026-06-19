import { SignatarioD4sign } from "./signatario-d4sign.model";

export interface DocumentD4sign {
uuidDoc: string;
  nameDoc: string;
  type: string;
  size: number;
  pages: number;
  uuidSafe: string;
  safeName: string;
  statusId: string;
  statusName: string;
  statusComment: string | null;
  whoCanceled: string | null;
  list: SignatarioD4sign[]
}
