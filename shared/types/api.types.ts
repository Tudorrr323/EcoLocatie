// api.types — tipuri pentru viitoarele response-uri API: ApiResponse<T>, PaginatedResponse<T>, ErrorResponse.
// Pregatite pentru cand vine backend-ul real.

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
}
