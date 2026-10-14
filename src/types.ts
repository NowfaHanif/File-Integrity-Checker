export type Status = "Verified" | "Tampered" | "Hash only";

export interface HistoryEntry {
  id: number;
  name: string;
  size: number;
  hash: string;
  ref: string;
  status: Status;
  algo?: string;
  time: string;
}

export interface TrustedHash {
  id: number;
  label: string;
  hash: string;
  time: string;
}
