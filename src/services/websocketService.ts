import * as signalR from '@aspnet/signalr';

const initConnection = (connectionString: string) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(connectionString)
    .build();
  return connection;
};

export default initConnection;
