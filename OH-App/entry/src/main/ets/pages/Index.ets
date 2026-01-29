import { MonitorData, RobotStatus, ControlCommand, VoiceCommand, MonitorDataMessage, Message, CommandType } from '../models/RobotModels';
import { MonitorPanel } from '../components/MonitorPanel';
import { ControlPanel } from '../components/ControlPanel';
import { getTcpService, TcpCommunicationService } from '../services/TcpCommunicationService';
import { getVoiceService, VoiceRecognitionService } from '../services/VoiceRecognitionService';
import { UI_CONFIG, NETWORK_CONFIG, JOINT_ANGLE_RANGE, POSTURE_RANGE, FPS_MIN } from '../constants/RobotConstants';
import { AppStateManager, NetworkErrorHandler, VoiceErrorHandler, CommandErrorHandler, CommandError, NetworkError } from '../utils/ErrorHandler';
import promptAction from '@ohos.promptAction';
import { common } from '@kit.AbilityKit';
import { UIAbility } from '@kit.AbilityKit';

@Entry
@Component
struct Index {
  @State monitorData: MonitorData | null = null;
  @State robotStatus: RobotStatus = {
    mode: 'stop',
    sim_status: 'stopped',
    sim_time: '--:--:--',
    connected: false
  };
  @State isProcessing: boolean = false;
  @State isVoiceActive: boolean = false;
  @State isMonitorLoading: boolean = false;
  @State controlPanelSpeedValue: string = '50';
  @State controlPanelForceValue: string = '50';
  @State controlPanelVoicePreviewText: string = '';
  @State controlPanelPendingVoiceCommand: VoiceCommand | null = null;
  private tcpService: TcpCommunicationService = getTcpService();
  private voiceService: VoiceRecognitionService | null = null;
  private refreshTimer: number = -1;
  private context = getContext(this) as common.UIAbilityContext;
  private appStateManager = AppStateManager.getInstance();

  aboutToAppear(): void {
    this.voiceService = getVoiceService(this.context);
    this.setupTcpService();
    this.setupVoiceService();
    this.setupControlPanel();
    this.setupMonitorPanel();
    this.setupAppStateManager();
    this.connectToSimulation();
  }

  aboutToDisappear(): void {
    this.cleanup();
  }

  private setupAppStateManager(): void {
    this.appStateManager.onAppBackground();
  }

  onPageShow(): void {
    const shouldReconnect = this.appStateManager.onAppForeground();
    if (!shouldReconnect && this.appStateManager.isConnected()) {
      this.showToast('请重新连接仿真环境');
      this.appStateManager.setConnected(false);
      this.robotStatus.connected = false;
    }
  }

  onPageHide(): void {
    this.appStateManager.onAppBackground();
  }

  private setupTcpService(): void {
    this.tcpService.setCallback({
      onConnected: () => {
        this.robotStatus.connected = true;
        this.showToast('已连接到仿真环境');
        this.startDataRefresh();
      },
      onDisconnected: () => {
        this.robotStatus.connected = false;
        this.stopDataRefresh();
      },
      onDataReceived: (data: Message) => {
        if (data.type === 'monitor_data') {
          this.handleMonitorData(data);
        }
      },
      onError: (error) => {
        this.showToast(error);
      }
    });
  }

  private setupVoiceService(): void {
    if (!this.voiceService) {
      return;
    }
    this.voiceService.setCallback({
      onWakeWordDetected: () => {
        this.isVoiceActive = true;
        this.showToast('语音已激活');
      },
      onCommandRecognized: (command, text) => {
        this.controlPanelVoicePreviewText = text;
        this.controlPanelPendingVoiceCommand = command;
      },
      onRecognitionFailed: (error) => {
        this.showToast(error);
      },
      onPermissionDenied: () => {
        this.showToast('请开启麦克风权限');
      }
    });
  }

  private setupControlPanel(): void {
  }

  private setupMonitorPanel(): void {
  }

  private async connectToSimulation(): Promise<void> {
    try {
      const connected = await this.tcpService.connect();
      
      if (!connected) {
        const errorObj = new NetworkError();
        errorObj.code = -1;
        errorObj.message = 'Connection failed';
        const errorMsg = NetworkErrorHandler.handleConnectionError(errorObj);
        this.showToast(errorMsg);
      }
    } catch {
      const errorObj = new NetworkError();
      errorObj.message = 'Connection failed';
      const errorMsg = NetworkErrorHandler.handleConnectionError(errorObj);
      this.showToast(errorMsg);
    }
  }

  private async sendCommand(command: string, param: object, source: 'manual' | 'voice'): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    const validation = this.appStateManager.validateCommand(command);
    if (!validation.valid) {
      this.showToast(validation.error || '指令无效');
      return;
    }

    this.isProcessing = true;

    const commandObj: ControlCommand = {
      type: 'control_cmd',
      timestamp: this.getCurrentTimestamp(),
      cmd_type: command as CommandType,
      param: param,
      source: source,
      request_id: this.generateRequestId()
    };

    try {
      const response = await this.tcpService.sendCommand(commandObj);
      if (response.result === 'success') {
        this.showToast('指令执行成功');
      } else {
        const errorObj = new CommandError();
        errorObj.msg = response.msg;
        const errorMsg = CommandErrorHandler.handleExecutionError(errorObj);
        this.showToast(errorMsg);
      }
    } catch {
      this.showToast('指令执行超时');
    } finally {
      this.isProcessing = false;
    }
  }

  private async toggleVoiceRecognition(): Promise<void> {
    if (!this.voiceService) {
      return;
    }
    if (this.voiceService.isListeningStatus()) {
      this.voiceService.stopListening();
      this.isVoiceActive = false;
    } else {
      const started = await this.voiceService.startListening();
      if (started) {
        this.showToast('开始语音识别');
      }
    }
  }

  private handleMonitorData(data: MonitorDataMessage): void {
    if (data.status === 'success') {
      this.monitorData = data.data;
      this.robotStatus.mode = data.data.robot_status;
      this.robotStatus.sim_time = data.timestamp;
      
      this.checkRobotAbnormal();
    } else {
      this.showToast('数据异常');
    }
  }

  private checkRobotAbnormal(): void {
    if (!this.monitorData) {
      return;
    }

    let isAbnormal = false;
    
    for (const angle of this.monitorData.joint_angle) {
      if (angle < JOINT_ANGLE_RANGE.min || angle > JOINT_ANGLE_RANGE.max) {
        isAbnormal = true;
        break;
      }
    }

    if (!isAbnormal && (this.monitorData.posture.pitch < POSTURE_RANGE.min || 
        this.monitorData.posture.pitch > POSTURE_RANGE.max ||
        this.monitorData.posture.roll < POSTURE_RANGE.min || 
        this.monitorData.posture.roll > POSTURE_RANGE.max)) {
      isAbnormal = true;
    }

    if (isAbnormal) {
      this.showToast('机器人状态异常');
      const emptyParam: Record<string, Object> = {};
      this.sendCommand('stop_sim', emptyParam, 'manual');
    }
  }

  private refreshData(): void {
    this.isMonitorLoading = true;
    setTimeout(() => {
      this.isMonitorLoading = false;
    }, UI_CONFIG.LOADING_ANIMATION_DURATION);
  }

  private startDataRefresh(): void {
    this.stopDataRefresh();
    this.refreshTimer = setInterval(() => {
      this.refreshData();
    }, UI_CONFIG.REFRESH_INTERVAL);
  }

  private stopDataRefresh(): void {
    if (this.refreshTimer !== -1) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = -1;
    }
  }

  private getCurrentTimestamp(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  private getCurrentTime(): string {
    return this.getCurrentTimestamp();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCommandText(command: string): string {
    const commandMap: Record<string, string> = {
      'move_forward': '前进',
      'move_back': '后退',
      'turn_left': '左转',
      'turn_right': '右转',
      'grab': '抓取',
      'release': '释放',
      'start_sim': '启动仿真',
      'pause_sim': '暂停仿真',
      'stop_sim': '停止仿真',
      'adjust_param': '参数调节'
    };
    return commandMap[command] || command;
  }

  private showToast(message: string | Resource): void {
    promptAction.showToast({
      message: message,
      duration: UI_CONFIG.TOAST_DURATION
    });
  }

  private cleanup(): void {
    this.stopDataRefresh();
    this.tcpService.destroy();
    if (this.voiceService) {
      this.voiceService.destroy();
    }
  }

  build() {
    Column() {
      Row() {
        Text($r('app.string.app_title'))
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)

        if (!this.robotStatus.connected) {
          Button($r('app.string.reconnect'))
            .fontSize(14)
            .fontColor($r('app.color.primary_blue'))
            .backgroundColor(Color.Transparent)
            .onClick(() => {
              this.connectToSimulation();
            })
        }
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor($r('app.color.background_card'))

      Column() {
        MonitorPanel({
          monitorData: this.monitorData,
          robotStatus: this.robotStatus,
          isLoading: this.isMonitorLoading,
          showPlaceholder: this.monitorData === null
        })
      }
      .width('100%')
      .layoutWeight(4)
      .padding({ left: 12, right: 12, top: 12, bottom: 6 })

      Column() {
        ControlPanel({
          isConnected: this.robotStatus.connected,
          isVoiceActive: this.isVoiceActive,
          voicePreviewText: this.controlPanelVoicePreviewText,
          pendingVoiceCommand: this.controlPanelPendingVoiceCommand,
          speedValue: this.controlPanelSpeedValue,
          forceValue: this.controlPanelForceValue,
          isProcessing: this.isProcessing
        })
      }
      .width('100%')
      .layoutWeight(6)
      .padding({ left: 12, right: 12, top: 6, bottom: 12 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.background_page'))
  }
}