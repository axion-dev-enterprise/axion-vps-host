export type {
  ListPhonesQuery as ListPhonesParams,
  ListPhonesResponse as ListPhonesResult,
  Phone,
} from "@pontotecc/contract";

export type SyncPhonesResult = {
  imported: number;
  source: string;
  terms: string[];
};
