export interface ResponseFromWebsocket<T> {
  data: T;
  now: string;
  accountId?: string;
}
