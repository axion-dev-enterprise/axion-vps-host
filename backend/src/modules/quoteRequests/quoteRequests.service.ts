import type { QuoteRequestInput } from "./quoteRequests.models";
import { QuoteRequestsRepository } from "./quoteRequests.repository";

export class QuoteRequestsService {
  constructor(private readonly repository: QuoteRequestsRepository) {}

  async create(input: QuoteRequestInput) {
    return this.repository.create(input);
  }
}
