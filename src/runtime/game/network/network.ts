/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PacketType {
  CONNECT = 'CONNECT',
  CONNECT_ACK = 'CONNECT_ACK',
  DISCONNECT = 'DISCONNECT',
  STATE_UPDATE = 'STATE_UPDATE',
  INPUT_EVENT = 'INPUT_EVENT',
  RPC = 'RPC',
  PING = 'PING',
  PONG = 'PONG',
  CUSTOM = 'CUSTOM',
}

export interface NetworkPacket<T = unknown> {
  id: string;
  type: PacketType;
  senderId: string;
  targetId?: string;
  timestamp: number;
  seqNumber: number;
  payload: T;
}

export class PacketSerializer {
  public static serialize<T>(packet: NetworkPacket<T>): string {
    return JSON.stringify(packet);
  }

  public static deserialize<T = unknown>(raw: string): NetworkPacket<T> {
    const parsed = JSON.parse(raw);
    if (!parsed.id || !parsed.type || !parsed.senderId || typeof parsed.timestamp !== 'number') {
      throw new Error('Paket jaringan tidak valid: kolom header wajib tidak lengkap');
    }
    return parsed as NetworkPacket<T>;
  }
}

export type PacketHandler<T = unknown> = (packet: NetworkPacket<T>) => void;

export class GameNetworkClient {
  public clientId: string;
  public isConnected: boolean = false;
  public latencyMs: number = 0;
  private seqCounter: number = 0;
  private handlers: Map<PacketType | string, PacketHandler[]> = new Map();
  private serverRef?: GameNetworkServer;

  constructor(clientId: string = `klien_${Math.random().toString(36).substring(2, 9)}`) {
    this.clientId = clientId;
  }

  public connect(server: GameNetworkServer): boolean {
    this.serverRef = server;
    const success = server.registerClient(this);
    if (success) {
      this.isConnected = true;
      const connectPacket = this.createPacket(PacketType.CONNECT, { clientId: this.clientId });
      this.send(connectPacket);
    }
    return success;
  }

  public disconnect(): void {
    if (this.isConnected && this.serverRef) {
      const disc = this.createPacket(PacketType.DISCONNECT, { reason: 'client_quit' });
      this.send(disc);
      this.serverRef.unregisterClient(this.clientId);
      this.isConnected = false;
      this.serverRef = undefined;
    }
  }

  public createPacket<T>(type: PacketType, payload: T, targetId?: string): NetworkPacket<T> {
    return {
      id: `pkt_${Date.now()}_${++this.seqCounter}`,
      type,
      senderId: this.clientId,
      targetId,
      timestamp: Date.now(),
      seqNumber: this.seqCounter,
      payload,
    };
  }

  public send<T>(packet: NetworkPacket<T>): void {
    if (!this.isConnected || !this.serverRef) {
      throw new Error(`Klien '${this.clientId}' tidak terhubung ke server`);
    }
    this.serverRef.receiveFromClient(this.clientId, packet);
  }

  public on(type: PacketType | string, handler: PacketHandler): void {
    const list = this.handlers.get(type) || [];
    list.push(handler);
    this.handlers.set(type, list);
  }

  public receivePacket(packet: NetworkPacket): void {
    const list = this.handlers.get(packet.type) || [];
    for (const h of list) {
      h(packet);
    }
    const anyList = this.handlers.get('*') || [];
    for (const h of anyList) {
      h(packet);
    }
  }
}

export class GameNetworkServer {
  public serverId: string;
  public isRunning: boolean = false;
  private clients: Map<string, GameNetworkClient> = new Map();
  private handlers: Map<PacketType | string, PacketHandler[]> = new Map();
  private seqCounter: number = 0;

  constructor(serverId: string = 'server_utama') {
    this.serverId = serverId;
  }

  public start(): void {
    this.isRunning = true;
  }

  public stop(): void {
    for (const [clientId] of this.clients) {
      this.sendTo(clientId, {
        id: `pkt_${Date.now()}_${++this.seqCounter}`,
        type: PacketType.DISCONNECT,
        senderId: this.serverId,
        targetId: clientId,
        timestamp: Date.now(),
        seqNumber: this.seqCounter,
        payload: { reason: 'server_shutdown' },
      });
    }
    this.clients.clear();
    this.isRunning = false;
  }

  public registerClient(client: GameNetworkClient): boolean {
    if (!this.isRunning) return false;
    this.clients.set(client.clientId, client);
    return true;
  }

  public unregisterClient(clientId: string): boolean {
    return this.clients.delete(clientId);
  }

  public getConnectedClientCount(): number {
    return this.clients.size;
  }

  public getConnectedClientIds(): string[] {
    return Array.from(this.clients.keys());
  }

  public broadcast<T>(packet: NetworkPacket<T>, exceptClientId?: string): void {
    for (const [clientId, client] of this.clients) {
      if (clientId !== exceptClientId) {
        client.receivePacket(packet);
      }
    }
  }

  public sendTo<T>(clientId: string, packet: NetworkPacket<T>): boolean {
    const client = this.clients.get(clientId);
    if (client) {
      client.receivePacket(packet);
      return true;
    }
    return false;
  }

  public receiveFromClient(clientId: string, packet: NetworkPacket): void {
    if (packet.type === PacketType.DISCONNECT) {
      this.unregisterClient(clientId);
    }

    const list = this.handlers.get(packet.type) || [];
    for (const h of list) {
      h(packet);
    }
    const anyList = this.handlers.get('*') || [];
    for (const h of anyList) {
      h(packet);
    }
  }

  public on(type: PacketType | string, handler: PacketHandler): void {
    const list = this.handlers.get(type) || [];
    list.push(handler);
    this.handlers.set(type, list);
  }
}
