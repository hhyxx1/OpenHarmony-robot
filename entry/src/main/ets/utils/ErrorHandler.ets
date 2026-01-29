import { RobotStatus, MonitorData } from '../models/RobotModels';
import { JOINT_ANGLE_RANGE, POSTURE_RANGE, FPS_MIN, NETWORK_CONFIG } from '../constants/RobotConstants';

export class NetworkError {
  code?: number;
  message?: string;
}

export class VoiceError {
  code?: number;
  message?: string;
}

export class CommandError {
  msg?: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

interface MonitorDataValidationResult {
  valid: boolean;
  errors: string[];
}

export class AppStateManager {
  private static instance: AppStateManager;
  private robotStatus: RobotStatus = {
    mode: 'stop',
    sim_status: 'stopped',
    sim_time: '--:--:--',
    connected: false
  };
  private monitorData: MonitorData | null = null;
  private isProcessing: boolean = false;
  private lastBackgroundTime: number = 0;
  private backgroundTimeout: number = 5 * 60 * 1000;

  private constructor() {
  }

  static getInstance(): AppStateManager {
    if (!AppStateManager.instance) {
      AppStateManager.instance = new AppStateManager();
    }
    return AppStateManager.instance;
  }

  getRobotStatus(): RobotStatus {
    const result: RobotStatus = {
      mode: this.robotStatus.mode,
      sim_status: this.robotStatus.sim_status,
      sim_time: this.robotStatus.sim_time,
      connected: this.robotStatus.connected
    };
    return result;
  }

  setRobotStatus(status: Partial<RobotStatus>): void {
    if (status.mode !== undefined) {
      this.robotStatus.mode = status.mode;
    }
    if (status.sim_status !== undefined) {
      this.robotStatus.sim_status = status.sim_status;
    }
    if (status.sim_time !== undefined) {
      this.robotStatus.sim_time = status.sim_time;
    }
    if (status.connected !== undefined) {
      this.robotStatus.connected = status.connected;
    }
  }

  getMonitorData(): MonitorData | null {
    return this.monitorData;
  }

  setMonitorData(data: MonitorData): void {
    this.monitorData = data;
  }

  isConnected(): boolean {
    return this.robotStatus.connected;
  }

  setConnected(connected: boolean): void {
    this.robotStatus.connected = connected;
  }

  isProcessingCommand(): boolean {
    return this.isProcessing;
  }

  setProcessing(processing: boolean): void {
    this.isProcessing = processing;
  }

  isSimRunning(): boolean {
    return this.robotStatus.sim_status === 'started';
  }

  isRobotRunning(): boolean {
    return this.robotStatus.mode === 'running';
  }

  onAppBackground(): void {
    this.lastBackgroundTime = Date.now();
  }

  onAppForeground(): boolean {
    const timeInBackground = Date.now() - this.lastBackgroundTime;
    if (timeInBackground > this.backgroundTimeout) {
      this.setConnected(false);
      return false;
    }
    return true;
  }

  validateCommand(command: string): ValidationResult {
    const result: ValidationResult = { valid: true };
    if (!this.isConnected()) {
      result.valid = false;
      result.error = '请先连接到仿真环境';
      return result;
    }

    if (command !== 'start_sim' && command !== 'stop_sim' && !this.isSimRunning()) {
      result.valid = false;
      result.error = '仿真未启动';
      return result;
    }

    return result;
  }

  validateMonitorData(data: MonitorData): MonitorDataValidationResult {
    const result: MonitorDataValidationResult = { valid: true, errors: [] };

    if (!data.joint_angle || data.joint_angle.length === 0) {
      result.errors.push('关节角度数据缺失');
    } else {
      data.joint_angle.forEach((angle, index) => {
        if (angle < JOINT_ANGLE_RANGE.min || angle > JOINT_ANGLE_RANGE.max) {
          result.errors.push(`关节${index + 1}角度超出范围`);
        }
      });
    }

    if (!data.joint_speed || data.joint_speed.length === 0) {
      result.errors.push('关节转速数据缺失');
    }

    if (!data.end_effector) {
      result.errors.push('末端执行器数据缺失');
    }

    if (!data.posture) {
      result.errors.push('机器人姿态数据缺失');
    } else {
      if (data.posture.pitch < POSTURE_RANGE.min || data.posture.pitch > POSTURE_RANGE.max) {
        result.errors.push('俯仰角超出范围');
      }
      if (data.posture.roll < POSTURE_RANGE.min || data.posture.roll > POSTURE_RANGE.max) {
        result.errors.push('横滚角超出范围');
      }
    }

    if (!data.fps || data.fps < FPS_MIN) {
      result.errors.push('仿真帧率过低');
    }

    result.valid = result.errors.length === 0;
    return result;
  }

  hasAbnormalData(): boolean {
    if (!this.monitorData) {
      return false;
    }

    const validation = this.validateMonitorData(this.monitorData);
    return !validation.valid;
  }

  getAbnormalErrors(): string[] {
    if (!this.monitorData) {
      return [];
    }

    const validation = this.validateMonitorData(this.monitorData);
    return validation.errors;
  }

  reset(): void {
    this.robotStatus = {
      mode: 'stop',
      sim_status: 'stopped',
      sim_time: '--:--:--',
      connected: false
    };
    this.monitorData = null;
    this.isProcessing = false;
    this.lastBackgroundTime = 0;
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorCallbacks: Map<string, (error: Error) => void> = new Map();

  private constructor() {
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  registerErrorHandler(type: string, callback: (error: Error) => void): void {
    this.errorCallbacks.set(type, callback);
  }

  unregisterErrorHandler(type: string): void {
    this.errorCallbacks.delete(type);
  }

  handleError(type: string, error: Error): void {
    console.error(`[${type}] Error:`, error);
    const callback = this.errorCallbacks.get(type);
    if (callback) {
      callback(error);
    }
  }

  handleNetworkError(error: Error): void {
    this.handleError('network', error);
  }

  handleVoiceError(error: Error): void {
    this.handleError('voice', error);
  }

  handleDataError(error: Error): void {
    this.handleError('data', error);
  }

  handleCommandError(error: Error): void {
    this.handleError('command', error);
  }
}

export class NetworkErrorHandler {
  static handleConnectionError(error: NetworkError): string {
    if (error.code === -1) {
      return '网络连接失败，请检查网络设置';
    } else if (error.code === -2) {
      return '连接超时，请检查仿真服务是否启动';
    } else if (error.code === -3) {
      return '连接被拒绝，请检查端口配置';
    } else {
      return `连接失败: ${error.message || '未知错误'}`;
    }
  }

  static handleTimeoutError(): string {
    return '请求超时，请检查仿真服务状态并重试';
  }

  static handleDataError(): string {
    return '数据格式异常，请刷新数据';
  }
}

export class VoiceErrorHandler {
  static handlePermissionError(): string {
    return '请开启麦克风权限以使用语音控制';
  }

  static handleRecognitionError(error: VoiceError): string {
    if (error.code === -1) {
      return '语音识别失败，请重试';
    } else if (error.code === -2) {
      return '未检测到语音，请重试';
    } else {
      return `语音识别错误: ${error.message || '未知错误'}`;
    }
  }

  static handleTimeoutError(): string {
    return '语音识别超时，请重试';
  }
}

export class CommandErrorHandler {
  static handleInvalidCommand(command: string): string {
    return `无效指令: ${command}`;
  }

  static handleExecutionError(error: CommandError): string {
    if (error.msg) {
      return error.msg;
    }
    return '指令执行失败，请重试';
  }

  static handleValidationError(error: string): string {
    return error;
  }
}
