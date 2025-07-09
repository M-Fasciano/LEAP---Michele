interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

export const successResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

export const errorResponse = (
  message: string,
  errors?: Record<string, string>
): ApiResponse<null> => ({
  success: false,
  error: message,
  ...(errors ? { errors } : {}),
});
