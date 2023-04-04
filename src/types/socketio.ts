export type addConsumption = {
  consumptionType: string;
};

export type GameOver = {
  id: string;
};

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  addConsumption: (data: addConsumption) => void;
  exchangePromotion: () => void;
  gameOver: (data: GameOver) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
