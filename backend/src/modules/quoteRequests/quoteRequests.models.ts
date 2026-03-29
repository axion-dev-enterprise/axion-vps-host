export type QuoteRequestInput = {
  name: string;
  email: string;
  phone: string;
  product?: string;
  message: string;
  sourcePage?: string;
};

export type QuoteRequestRecord = QuoteRequestInput & {
  id: string;
  createdAt: string;
};
