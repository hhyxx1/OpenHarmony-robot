if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    monitorData?: MonitorData | null;
    robotStatus?: RobotStatus;
    isProcessing?: boolean;
    isVoiceActive?: boolean;
    monitorPanelRef?: MonitorPanel;
    controlPanelRef?: ControlPanel;
    logPanelRef?: LogPanel;
    tcpService?: TcpCommunicationService;
    voiceService?: VoiceRecognitionService;
    refreshTimer?: number;
    context?;
    appStateManager?;
}
import type { MonitorData, RobotStatus, LogEntry, ControlCommand } from '../models/RobotModels';
import { MonitorPanel } from "@normalized:N&&&entry/src/main/ets/components/MonitorPanel&";
import { ControlPanel } from "@normalized:N&&&entry/src/main/ets/components/ControlPanel&";
import { LogPanel } from "@normalized:N&&&entry/src/main/ets/components/LogPanel&";
import { getTcpService } from "@normalized:N&&&entry/src/main/ets/services/TcpCommunicationService&";
import type { TcpCommunicationService } from "@normalized:N&&&entry/src/main/ets/services/TcpCommunicationService&";
import { getVoiceService } from "@normalized:N&&&entry/src/main/ets/services/VoiceRecognitionService&";
import type { VoiceRecognitionService } from "@normalized:N&&&entry/src/main/ets/services/VoiceRecognitionService&";
import { UI_CONFIG, JOINT_ANGLE_RANGE, POSTURE_RANGE } from "@normalized:N&&&entry/src/main/ets/constants/RobotConstants&";
import { AppStateManager, NetworkErrorHandler, CommandErrorHandler } from "@normalized:N&&&entry/src/main/ets/utils/ErrorHandler&";
import promptAction from "@ohos:promptAction";
import type common from "@ohos:app.ability.common";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__monitorData = new ObservedPropertyObjectPU(null, this, "monitorData");
        this.__robotStatus = new ObservedPropertyObjectPU({
            mode: 'stop',
            sim_status: 'stopped',
            sim_time: '--:--:--',
            connected: false
        }, this, "robotStatus");
        this.__isProcessing = new ObservedPropertySimplePU(false, this, "isProcessing");
        this.__isVoiceActive = new ObservedPropertySimplePU(false, this, "isVoiceActive");
        this.monitorPanelRef = new MonitorPanel();
        this.controlPanelRef = new ControlPanel();
        this.logPanelRef = new LogPanel();
        this.tcpService = getTcpService();
        this.voiceService = getVoiceService();
        this.refreshTimer = -1;
        this.context = getContext(this) as common.UIAbilityContext;
        this.appStateManager = AppStateManager.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.monitorData !== undefined) {
            this.monitorData = params.monitorData;
        }
        if (params.robotStatus !== undefined) {
            this.robotStatus = params.robotStatus;
        }
        if (params.isProcessing !== undefined) {
            this.isProcessing = params.isProcessing;
        }
        if (params.isVoiceActive !== undefined) {
            this.isVoiceActive = params.isVoiceActive;
        }
        if (params.monitorPanelRef !== undefined) {
            this.monitorPanelRef = params.monitorPanelRef;
        }
        if (params.controlPanelRef !== undefined) {
            this.controlPanelRef = params.controlPanelRef;
        }
        if (params.logPanelRef !== undefined) {
            this.logPanelRef = params.logPanelRef;
        }
        if (params.tcpService !== undefined) {
            this.tcpService = params.tcpService;
        }
        if (params.voiceService !== undefined) {
            this.voiceService = params.voiceService;
        }
        if (params.refreshTimer !== undefined) {
            this.refreshTimer = params.refreshTimer;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.appStateManager !== undefined) {
            this.appStateManager = params.appStateManager;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__monitorData.purgeDependencyOnElmtId(rmElmtId);
        this.__robotStatus.purgeDependencyOnElmtId(rmElmtId);
        this.__isProcessing.purgeDependencyOnElmtId(rmElmtId);
        this.__isVoiceActive.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__monitorData.aboutToBeDeleted();
        this.__robotStatus.aboutToBeDeleted();
        this.__isProcessing.aboutToBeDeleted();
        this.__isVoiceActive.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __monitorData: ObservedPropertyObjectPU<MonitorData | null>;
    get monitorData() {
        return this.__monitorData.get();
    }
    set monitorData(newValue: MonitorData | null) {
        this.__monitorData.set(newValue);
    }
    private __robotStatus: ObservedPropertyObjectPU<RobotStatus>;
    get robotStatus() {
        return this.__robotStatus.get();
    }
    set robotStatus(newValue: RobotStatus) {
        this.__robotStatus.set(newValue);
    }
    private __isProcessing: ObservedPropertySimplePU<boolean>;
    get isProcessing() {
        return this.__isProcessing.get();
    }
    set isProcessing(newValue: boolean) {
        this.__isProcessing.set(newValue);
    }
    private __isVoiceActive: ObservedPropertySimplePU<boolean>;
    get isVoiceActive() {
        return this.__isVoiceActive.get();
    }
    set isVoiceActive(newValue: boolean) {
        this.__isVoiceActive.set(newValue);
    }
    private monitorPanelRef: MonitorPanel;
    private controlPanelRef: ControlPanel;
    private logPanelRef: LogPanel;
    private tcpService: TcpCommunicationService;
    private voiceService: VoiceRecognitionService;
    private refreshTimer: number;
    private context;
    private appStateManager;
    aboutToAppear(): void {
        this.setupTcpService();
        this.setupVoiceService();
        this.setupControlPanel();
        this.setupLogPanel();
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
            this.monitorPanelRef.setRobotStatus(this.robotStatus);
            this.controlPanelRef.setConnected(false);
        }
    }
    onPageHide(): void {
        this.appStateManager.onAppBackground();
    }
    private setupTcpService(): void {
        this.tcpService.setCallback({
            onConnected: () => {
                this.robotStatus.connected = true;
                this.monitorPanelRef.setRobotStatus(this.robotStatus);
                this.controlPanelRef.setConnected(true);
                this.showToast({ "id": 16777268, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string);
                this.startDataRefresh();
            },
            onDisconnected: () => {
                this.robotStatus.connected = false;
                this.monitorPanelRef.setRobotStatus(this.robotStatus);
                this.controlPanelRef.setConnected(false);
                this.stopDataRefresh();
            },
            onDataReceived: (data) => {
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
        this.voiceService.setCallback({
            onWakeWordDetected: () => {
                this.isVoiceActive = true;
                this.controlPanelRef.setVoiceActive(true);
                this.showToast({ "id": 16777318, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string);
            },
            onCommandRecognized: (command, text) => {
                this.controlPanelRef.setVoicePreview(text, command);
            },
            onRecognitionFailed: (error) => {
                this.showToast(error);
            },
            onPermissionDenied: () => {
                this.showToast({ "id": 16777289, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string);
            }
        });
    }
    private setupControlPanel(): void {
        this.controlPanelRef.setCommandSendCallback((command, param, source) => {
            this.sendCommand(command, param, source);
        });
        this.controlPanelRef.setVoiceToggleCallback(() => {
            this.toggleVoiceRecognition();
        });
        this.controlPanelRef.setVoiceConfirmCallback(() => {
            this.controlPanelRef.clearVoicePreview();
        });
        this.controlPanelRef.setVoiceCancelCallback(() => {
            this.controlPanelRef.clearVoicePreview();
        });
    }
    private setupLogPanel(): void {
        this.logPanelRef.setRetryCallback((log) => {
            if (log.command) {
                this.sendCommand(log.command.cmd_type, log.command.param, log.command.source);
            }
        });
    }
    private setupMonitorPanel(): void {
        this.monitorPanelRef.setRefreshCallback(() => {
            this.refreshData();
        });
    }
    private async connectToSimulation(): Promise<void> {
        this.monitorPanelRef.setLoading(true);
        try {
            const connected = await this.tcpService.connect();
            this.monitorPanelRef.setLoading(false);
            if (!connected) {
                const errorMsg = NetworkErrorHandler.handleConnectionError({ code: -1, message: 'Connection failed' });
                this.showToast(errorMsg);
                this.addSystemLog(errorMsg);
            }
        }
        catch (error) {
            this.monitorPanelRef.setLoading(false);
            const errorMsg = NetworkErrorHandler.handleConnectionError(error);
            this.showToast(errorMsg);
            this.addSystemLog(errorMsg);
        }
    }
    private async sendCommand(command: string, param: object, source: 'manual' | 'voice'): Promise<void> {
        if (this.isProcessing) {
            return;
        }
        const validation = this.appStateManager.validateCommand(command);
        if (!validation.valid) {
            this.showToast(validation.error || '指令无效');
            this.addSystemLog(validation.error || '指令无效');
            return;
        }
        this.isProcessing = true;
        this.controlPanelRef.setProcessing(true);
        const commandObj: ControlCommand = {
            type: 'control_cmd',
            timestamp: this.getCurrentTimestamp(),
            cmd_type: command as any,
            param: param,
            source: source,
            request_id: this.generateRequestId()
        };
        const logContent = `${source === 'voice' ? '语音' : '手动'}指令：${this.getCommandText(command)}`;
        this.addLog(logContent, source, undefined, commandObj);
        try {
            const response = await this.tcpService.sendCommand(commandObj);
            this.updateLogResult(commandObj.request_id, response.result === 'success' ? 'success' : 'fail');
            if (response.result === 'success') {
                this.showToast({ "id": 16777265, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string);
            }
            else {
                const errorMsg = CommandErrorHandler.handleExecutionError(response);
                this.showToast(errorMsg);
            }
        }
        catch (error) {
            this.updateLogResult(commandObj.request_id, 'fail', true);
            const errorMsg = NetworkErrorHandler.handleTimeoutError();
            this.showToast(errorMsg);
        }
        finally {
            this.isProcessing = false;
            this.controlPanelRef.setProcessing(false);
        }
    }
    private async toggleVoiceRecognition(): Promise<void> {
        if (this.voiceService.isListeningStatus()) {
            this.voiceService.stopListening();
            this.isVoiceActive = false;
            this.controlPanelRef.setVoiceActive(false);
        }
        else {
            const started = await this.voiceService.startListening();
            if (started) {
                this.showToast({ "id": 16777321, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string);
            }
        }
    }
    private handleMonitorData(data: any): void {
        if (data.status === 'success') {
            this.monitorData = data.data;
            this.robotStatus.mode = data.data.robot_status;
            this.robotStatus.sim_time = data.timestamp;
            this.monitorPanelRef.setMonitorData(this.monitorData);
            this.monitorPanelRef.setRobotStatus(this.robotStatus);
            this.checkRobotAbnormal();
        }
        else {
            this.showToast({ "id": 16777271, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string);
            this.addSystemLog({ "id": 16777271, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string);
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
            this.showToast({ "id": 16777303, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string);
            this.addSystemLog({ "id": 16777303, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string);
            this.sendCommand('stop_sim', {}, 'manual');
        }
    }
    private refreshData(): void {
        this.monitorPanelRef.setLoading(true);
        setTimeout(() => {
            this.monitorPanelRef.setLoading(false);
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
    private addLog(content: string, type: 'manual' | 'voice' | 'system', result?: 'success' | 'fail', command?: ControlCommand): void {
        const log: LogEntry = {
            id: this.generateRequestId(),
            timestamp: this.getCurrentTime(),
            type: type,
            content: content,
            result: result,
            canRetry: result === 'fail',
            command: command
        };
        this.logPanelRef.addLog(log);
    }
    private addSystemLog(content: string): void {
        this.addLog(content, 'system');
    }
    private updateLogResult(requestId: string, result: 'success' | 'fail', canRetry: boolean = false): void {
        const logs = this.logPanelRef['logs'];
        const logIndex = logs.findIndex((log: LogEntry) => log.command?.request_id === requestId);
        if (logIndex !== -1) {
            logs[logIndex].result = result;
            logs[logIndex].canRetry = canRetry;
            this.logPanelRef['logs'] = [...logs];
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
    private showToast(message: string): void {
        promptAction.showToast({
            message: message,
            duration: UI_CONFIG.TOAST_DURATION
        });
    }
    private cleanup(): void {
        this.stopDataRefresh();
        this.tcpService.destroy();
        this.voiceService.destroy();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(357:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777222, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(358:7)", "entry");
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 16, right: 16 });
            Row.backgroundColor({ "id": 16777221, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777262, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/pages/Index.ets(359:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.robotStatus.connected) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel({ "id": 16777297, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(366:11)", "entry");
                        Button.fontSize(14);
                        Button.fontColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.connectToSimulation();
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(380:7)", "entry");
            Column.width('100%');
            Column.layoutWeight(4);
            Column.padding({ left: 12, right: 12, top: 12, bottom: 6 });
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(387:7)", "entry");
            Column.width('100%');
            Column.layoutWeight(2.5);
            Column.padding({ left: 12, right: 12, top: 6, bottom: 6 });
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(394:7)", "entry");
            Column.width('100%');
            Column.layoutWeight(3);
            Column.padding({ left: 12, right: 12, top: 6, bottom: 12 });
        }, Column);
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.dudh.roboctrl", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
