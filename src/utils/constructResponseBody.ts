export const constructResponseBody: any  = (
  data: any,
  message?: string,
  status?: number
) => {
  return {
    success: true,
    data,
    message,
    status,
  };
};
