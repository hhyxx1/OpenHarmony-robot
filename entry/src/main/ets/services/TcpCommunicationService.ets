import socket from '@ohos.net.socket';
import { Message, MonitorDataMessage, CommandResponse, ControlCommand } from '../models/RobotModels';
import { NETWORK_CONFIG } from '../constants/RobotConstants';

export interface TcpConnectionCallback {
  onConnected: () => void;
  onDisconnected: () => void;
  onDataReceived: (data: Message) => void;
  onError: (error: string) => void;
}

interface PendingRequest {
  resolve: (value: CommandResponse) => void;
  reject: (reason: string) => void;
  timeoutId: number;
}

export class TcpCommunicationService {
  private tcpSocket: socket.TCPSocket | null = null;
  private isConnected: boolean = false;
  private host: string = NETWORK_CONFIG.DEFAULT_HOST;
  private port: number = NETWORK_CONFIG.DEFAULT_PORT;
  private callback: TcpConnectionCallback | null = null;
  private pendingRequests: Map<string, PendingRequest> = new Map();

  constructor() {
    this.tcpSocket = socket.constructTCPSocketInstance();
  }

  setCallback(callback: TcpConnectionCallback): void {
    this.callback = callback;
  }

  setConnectionParams(host: string, port: number): void {
    this.host = host;
    this.port = port;
  }

  async connect(): Promise<boolean> {
    if (!this.tcpSocket) {
      return false;
    }

    try {
      await this.tcpSocket.connect({
        address: {
          address: this.host,
          port: this.port,
          family: 1
        },
        timeout: NETWORK_CONFIG.CONNECT_TIMEOUT
      });

      this.isConnected = true;
      this.setupMessageListener();
      this.callback?.onConnected();
      return true;
    } catch (error) {
      this.isConnected = false;
      this.callback?.onError(`连接失败: ${error}`);
      return false;
    }
  }

  disconnect(): void {
    if (this.tcpSocket && this.isConnected) {
      try {
        this.tcpSocket.close();
      } catch (error) {
        console.error('关闭连接失败:', error);
      }
      this.isConnected = false;
      this.callback?.onDisconnected();
    }
  }

  private setupMessageListener(): void {
    if (!this.tcpSocket) {
      return;
    }

  }

  private handleMessage(message: Message): void {
    if (message.type === 'cmd_response') {
      const response = message as CommandResponse;
      const pending = this.pendingRequests.get(response.request_id);
      if (pending) {
        clearTimeout(pending.timeoutId);
        this.pendingRequests.delete(response.request_id);
        if (response.result === 'success') {
          pending.resolve(response);
        } else {
          pending.reject(response.msg);
        }
      }
    } else if (message.type === 'monitor_data') {
      this.callback?.onDataReceived(message);
    }
  }

  async sendCommand(command: ControlCommand): Promise<CommandResponse> {
    if (!this.isConnected || !this.tcpSocket) {
      throw new Error('未连接到仿真环境');
    }

    return new Promise((resolve, reject) => {
      try {
        const jsonData = JSON.stringify(command);
        this.tcpSocket!.send({ data: jsonData });

        const timeoutId: number = setTimeout(() => {
          this.pendingRequests.delete(command.request_id);
          reject('请求超时');
        }, NETWORK_CONFIG.REQUEST_TIMEOUT);

        this.pendingRequests.set(command.request_id, { resolve, reject, timeoutId });
      } catch (error) {
        reject(`发送指令失败: ${error}`);
      }
    });
  }

  isConnectedStatus(): boolean {
    return this.isConnected;
  }

  getPendingCommandIds(): string[] {
    return Array.from(this.pendingRequests.keys());
  }

  clearPendingRequests(): void {
    this.pendingRequests.forEach((pending) => {
      clearTimeout(pending.timeoutId);
      pending.reject('连接已断开');
    });
    this.pendingRequests.clear();
  }

  destroy(): void {
    this.clearPendingRequests();
    this.disconnect();
    this.tcpSocket = null;
    this.callback = null;
  }
}

let tcpServiceInstance: TcpCommunicationService | null = null;

export function getTcpService(): TcpCommunicationService {
  if (!tcpServiceInstance) {
    tcpServiceInstance = new TcpCommunicationService();
  }
  return tcpServiceInstance;
}
