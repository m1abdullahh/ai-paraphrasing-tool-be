interface IResponseMappings<T> {
  status?: number;
  message?: string;
  data?: T;
  success?: boolean;
  error?: string;
}
