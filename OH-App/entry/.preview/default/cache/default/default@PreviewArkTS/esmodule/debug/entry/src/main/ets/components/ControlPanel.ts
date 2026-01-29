if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ControlPanel_Params {
    isConnected?: boolean;
    isVoiceActive?: boolean;
    voicePreviewText?: string;
    pendingVoiceCommand?: VoiceCommand | null;
    speedValue?: string;
    forceValue?: string;
    isProcessing?: boolean;
    onCommandSend?: (command: CommandType, param: ControlParam, source: 'manual' | 'voice') => void;
    onVoiceToggle?: () => void;
    onVoiceConfirm?: () => void;
    onVoiceCancel?: () => void;
}
import type { CommandType, ControlParam, VoiceCommand } from '../models/RobotModels';
import { PARAM_RANGES } from "@normalized:N&&&entry/src/main/ets/constants/RobotConstants&";
export class ControlPanel extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isConnected = new ObservedPropertySimplePU(false, this, "isConnected");
        this.__isVoiceActive = new ObservedPropertySimplePU(false, this, "isVoiceActive");
        this.__voicePreviewText = new ObservedPropertySimplePU('', this, "voicePreviewText");
        this.__pendingVoiceCommand = new ObservedPropertyObjectPU(null, this, "pendingVoiceCommand");
        this.__speedValue = new ObservedPropertySimplePU('50', this, "speedValue");
        this.__forceValue = new ObservedPropertySimplePU('50', this, "forceValue");
        this.__isProcessing = new ObservedPropertySimplePU(false, this, "isProcessing");
        this.onCommandSend = undefined;
        this.onVoiceToggle = undefined;
        this.onVoiceConfirm = undefined;
        this.onVoiceCancel = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ControlPanel_Params) {
        if (params.isConnected !== undefined) {
            this.isConnected = params.isConnected;
        }
        if (params.isVoiceActive !== undefined) {
            this.isVoiceActive = params.isVoiceActive;
        }
        if (params.voicePreviewText !== undefined) {
            this.voicePreviewText = params.voicePreviewText;
        }
        if (params.pendingVoiceCommand !== undefined) {
            this.pendingVoiceCommand = params.pendingVoiceCommand;
        }
        if (params.speedValue !== undefined) {
            this.speedValue = params.speedValue;
        }
        if (params.forceValue !== undefined) {
            this.forceValue = params.forceValue;
        }
        if (params.isProcessing !== undefined) {
            this.isProcessing = params.isProcessing;
        }
        if (params.onCommandSend !== undefined) {
            this.onCommandSend = params.onCommandSend;
        }
        if (params.onVoiceToggle !== undefined) {
            this.onVoiceToggle = params.onVoiceToggle;
        }
        if (params.onVoiceConfirm !== undefined) {
            this.onVoiceConfirm = params.onVoiceConfirm;
        }
        if (params.onVoiceCancel !== undefined) {
            this.onVoiceCancel = params.onVoiceCancel;
        }
    }
    updateStateVars(params: ControlPanel_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isConnected.purgeDependencyOnElmtId(rmElmtId);
        this.__isVoiceActive.purgeDependencyOnElmtId(rmElmtId);
        this.__voicePreviewText.purgeDependencyOnElmtId(rmElmtId);
        this.__pendingVoiceCommand.purgeDependencyOnElmtId(rmElmtId);
        this.__speedValue.purgeDependencyOnElmtId(rmElmtId);
        this.__forceValue.purgeDependencyOnElmtId(rmElmtId);
        this.__isProcessing.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isConnected.aboutToBeDeleted();
        this.__isVoiceActive.aboutToBeDeleted();
        this.__voicePreviewText.aboutToBeDeleted();
        this.__pendingVoiceCommand.aboutToBeDeleted();
        this.__speedValue.aboutToBeDeleted();
        this.__forceValue.aboutToBeDeleted();
        this.__isProcessing.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isConnected: ObservedPropertySimplePU<boolean>;
    get isConnected() {
        return this.__isConnected.get();
    }
    set isConnected(newValue: boolean) {
        this.__isConnected.set(newValue);
    }
    private __isVoiceActive: ObservedPropertySimplePU<boolean>;
    get isVoiceActive() {
        return this.__isVoiceActive.get();
    }
    set isVoiceActive(newValue: boolean) {
        this.__isVoiceActive.set(newValue);
    }
    private __voicePreviewText: ObservedPropertySimplePU<string>;
    get voicePreviewText() {
        return this.__voicePreviewText.get();
    }
    set voicePreviewText(newValue: string) {
        this.__voicePreviewText.set(newValue);
    }
    private __pendingVoiceCommand: ObservedPropertyObjectPU<VoiceCommand | null>;
    get pendingVoiceCommand() {
        return this.__pendingVoiceCommand.get();
    }
    set pendingVoiceCommand(newValue: VoiceCommand | null) {
        this.__pendingVoiceCommand.set(newValue);
    }
    private __speedValue: ObservedPropertySimplePU<string>;
    get speedValue() {
        return this.__speedValue.get();
    }
    set speedValue(newValue: string) {
        this.__speedValue.set(newValue);
    }
    private __forceValue: ObservedPropertySimplePU<string>;
    get forceValue() {
        return this.__forceValue.get();
    }
    set forceValue(newValue: string) {
        this.__forceValue.set(newValue);
    }
    private __isProcessing: ObservedPropertySimplePU<boolean>;
    get isProcessing() {
        return this.__isProcessing.get();
    }
    set isProcessing(newValue: boolean) {
        this.__isProcessing.set(newValue);
    }
    private onCommandSend?: (command: CommandType, param: ControlParam, source: 'manual' | 'voice') => void;
    private onVoiceToggle?: () => void;
    private onVoiceConfirm?: () => void;
    private onVoiceCancel?: () => void;
    public setConnected(connected: boolean): void {
        this.isConnected = connected;
    }
    public setVoiceActive(active: boolean): void {
        this.isVoiceActive = active;
    }
    public setVoicePreview(text: string, command: VoiceCommand): void {
        this.voicePreviewText = text;
        this.pendingVoiceCommand = command;
    }
    public clearVoicePreview(): void {
        this.voicePreviewText = '';
        this.pendingVoiceCommand = null;
    }
    public setProcessing(processing: boolean): void {
        this.isProcessing = processing;
    }
    public setCommandSendCallback(callback: (command: CommandType, param: ControlParam, source: 'manual' | 'voice') => void): void {
        this.onCommandSend = callback;
    }
    public setVoiceToggleCallback(callback: () => void): void {
        this.onVoiceToggle = callback;
    }
    public setVoiceConfirmCallback(callback: () => void): void {
        this.onVoiceConfirm = callback;
    }
    public setVoiceCancelCallback(callback: () => void): void {
        this.onVoiceCancel = callback;
    }
    private handleCommand(command: CommandType, param: ControlParam = {}): void {
        if (!this.isConnected || this.isProcessing) {
            return;
        }
        this.onCommandSend?.(command, param, 'manual');
    }
    private handleVoiceConfirm(): void {
        if (this.pendingVoiceCommand) {
            this.onCommandSend?.(this.pendingVoiceCommand.command, this.pendingVoiceCommand.param || {}, 'voice');
            this.onVoiceConfirm?.();
        }
    }
    private handleVoiceCancel(): void {
        this.onVoiceCancel?.();
    }
    private validateSpeed(value: string): boolean {
        const num = parseFloat(value);
        return !isNaN(num) && num >= PARAM_RANGES.speed.min && num <= PARAM_RANGES.speed.max;
    }
    private validateForce(value: string): boolean {
        const num = parseFloat(value);
        return !isNaN(num) && num >= PARAM_RANGES.force.min && num <= PARAM_RANGES.force.max;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/ControlPanel.ets(85:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777221, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777269, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/ControlPanel.ets(86:7)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.width('100%');
            Text.padding({ left: 16, right: 16, top: 12, bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/components/ControlPanel.ets(93:7)", "entry");
            Scroll.width('100%');
            Scroll.layoutWeight(1);
            Scroll.scrollBar(BarState.Auto);
            Scroll.edgeEffect(EdgeEffect.Spring);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/ControlPanel.ets(94:9)", "entry");
            Column.width('100%');
            Column.padding({ left: 16, right: 16, bottom: 12 });
        }, Column);
        this.VoiceSection.bind(this)();
        this.DirectionControlSection.bind(this)();
        this.ExecutorControlSection.bind(this)();
        this.SimControlSection.bind(this)();
        this.ParamSection.bind(this)();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    VoiceSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/ControlPanel.ets(117:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(118:7)", "entry");
            Button.width('100%');
            Button.height(44);
            Button.backgroundColor(this.isVoiceActive ? { "id": 16777238, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } : { "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.borderRadius(8);
            Button.enabled(!this.isProcessing);
            Button.onClick(() => {
                this.onVoiceToggle?.();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/ControlPanel.ets(119:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125831758, "type": 40000, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/ControlPanel.ets(120:11)", "entry");
            Image.width(20);
            Image.height(20);
            Image.fillColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Image.margin({ right: 8 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isVoiceActive ? { "id": 16777318, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } : { "id": 16777323, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/ControlPanel.ets(126:11)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.voicePreviewText && this.pendingVoiceCommand) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/ControlPanel.ets(141:9)", "entry");
                        Column.width('100%');
                        Column.padding(12);
                        Column.backgroundColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Column.borderRadius(8);
                        Column.margin({ top: 8 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777320, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Text.debugLine("entry/src/main/ets/components/ControlPanel.ets(142:11)", "entry");
                        Text.fontSize(12);
                        Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Text.margin({ bottom: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.voicePreviewText);
                        Text.debugLine("entry/src/main/ets/components/ControlPanel.ets(147:11)", "entry");
                        Text.fontSize(16);
                        Text.fontColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/ControlPanel.ets(153:11)", "entry");
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel({ "id": 16777263, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(154:13)", "entry");
                        Button.fontSize(14);
                        Button.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Button.backgroundColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Button.layoutWeight(1);
                        Button.margin({ right: 8 });
                        Button.onClick(() => {
                            this.handleVoiceCancel();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel({ "id": 16777266, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(164:13)", "entry");
                        Button.fontSize(14);
                        Button.fontColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Button.backgroundColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Button.layoutWeight(1);
                        Button.onClick(() => {
                            this.handleVoiceConfirm();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    DirectionControlSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/ControlPanel.ets(189:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('方向控制');
            Text.debugLine("entry/src/main/ets/components/ControlPanel.ets(190:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/ControlPanel.ets(195:7)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(196:9)", "entry");
            Button.width(56);
            Button.height(56);
            Button.backgroundColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.borderRadius(8);
            Button.enabled(this.isConnected && !this.isProcessing);
            Button.onClick(() => {
                this.handleCommand('move_forward');
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125832671, "type": 40000, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/ControlPanel.ets(197:11)", "entry");
            Image.width(24);
            Image.height(24);
            Image.fillColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
        }, Image);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/ControlPanel.ets(211:9)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(212:11)", "entry");
            Button.width(56);
            Button.height(56);
            Button.backgroundColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.borderRadius(8);
            Button.enabled(this.isConnected && !this.isProcessing);
            Button.margin({ right: 8 });
            Button.onClick(() => {
                this.handleCommand('turn_left');
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125832679, "type": 40000, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/ControlPanel.ets(213:13)", "entry");
            Image.width(24);
            Image.height(24);
            Image.fillColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
        }, Image);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(228:11)", "entry");
            Button.width(56);
            Button.height(56);
            Button.backgroundColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.borderRadius(8);
            Button.enabled(this.isConnected && !this.isProcessing);
            Button.onClick(() => {
                this.handleCommand('turn_right');
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125832680, "type": 40000, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/ControlPanel.ets(229:13)", "entry");
            Image.width(24);
            Image.height(24);
            Image.fillColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
        }, Image);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(247:9)", "entry");
            Button.width(56);
            Button.height(56);
            Button.backgroundColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.borderRadius(8);
            Button.enabled(this.isConnected && !this.isProcessing);
            Button.margin({ top: 8 });
            Button.onClick(() => {
                this.handleCommand('move_back');
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125832675, "type": 40000, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/ControlPanel.ets(248:11)", "entry");
            Image.width(24);
            Image.height(24);
            Image.fillColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
        }, Image);
        Button.pop();
        Column.pop();
        Column.pop();
    }
    ExecutorControlSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/ControlPanel.ets(273:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('执行器控制');
            Text.debugLine("entry/src/main/ets/components/ControlPanel.ets(274:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/ControlPanel.ets(279:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777274, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(280:9)", "entry");
            Button.fontSize(14);
            Button.fontColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.backgroundColor({ "id": 16777238, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.layoutWeight(1);
            Button.enabled(this.isConnected && !this.isProcessing);
            Button.margin({ right: 8 });
            Button.onClick(() => {
                this.handleCommand('grab');
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777299, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(291:9)", "entry");
            Button.fontSize(14);
            Button.fontColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.backgroundColor({ "id": 16777225, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.layoutWeight(1);
            Button.enabled(this.isConnected && !this.isProcessing);
            Button.onClick(() => {
                this.handleCommand('release');
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    SimControlSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/ControlPanel.ets(310:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('仿真控制');
            Text.debugLine("entry/src/main/ets/components/ControlPanel.ets(311:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/ControlPanel.ets(316:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777310, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(317:9)", "entry");
            Button.fontSize(14);
            Button.fontColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.backgroundColor({ "id": 16777238, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.layoutWeight(1);
            Button.enabled(!this.isProcessing);
            Button.margin({ right: 8 });
            Button.onClick(() => {
                this.handleCommand('start_sim');
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777295, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(328:9)", "entry");
            Button.fontSize(14);
            Button.fontColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.backgroundColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.layoutWeight(1);
            Button.enabled(this.isConnected && !this.isProcessing);
            Button.margin({ right: 8 });
            Button.onClick(() => {
                this.handleCommand('pause_sim');
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777314, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.debugLine("entry/src/main/ets/components/ControlPanel.ets(339:9)", "entry");
            Button.fontSize(14);
            Button.fontColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.backgroundColor({ "id": 16777225, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Button.layoutWeight(1);
            Button.enabled(this.isConnected && !this.isProcessing);
            Button.onClick(() => {
                this.handleCommand('stop_sim');
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    ParamSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/ControlPanel.ets(358:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('参数调节');
            Text.debugLine("entry/src/main/ets/components/ControlPanel.ets(359:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/ControlPanel.ets(364:7)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777294, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/ControlPanel.ets(365:9)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.width(60);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '0-100', text: this.speedValue });
            TextInput.debugLine("entry/src/main/ets/components/ControlPanel.ets(370:9)", "entry");
            TextInput.type(InputType.Number);
            TextInput.fontSize(14);
            TextInput.backgroundColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            TextInput.borderRadius(8);
            TextInput.layoutWeight(1);
            TextInput.enabled(!this.isProcessing);
            TextInput.onChange((value: string) => {
                this.speedValue = value;
            });
            TextInput.onSubmit(() => {
                if (this.validateSpeed(this.speedValue)) {
                    const param: ControlParam = { speed: parseFloat(this.speedValue) };
                    this.handleCommand('adjust_param', param);
                }
            });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/ControlPanel.ets(390:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777291, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/ControlPanel.ets(391:9)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.width(60);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '0-100', text: this.forceValue });
            TextInput.debugLine("entry/src/main/ets/components/ControlPanel.ets(396:9)", "entry");
            TextInput.type(InputType.Number);
            TextInput.fontSize(14);
            TextInput.backgroundColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            TextInput.borderRadius(8);
            TextInput.layoutWeight(1);
            TextInput.enabled(!this.isProcessing);
            TextInput.onChange((value: string) => {
                this.forceValue = value;
            });
            TextInput.onSubmit(() => {
                if (this.validateForce(this.forceValue)) {
                    const param: ControlParam = { force: parseFloat(this.forceValue) };
                    this.handleCommand('adjust_param', param);
                }
            });
        }, TextInput);
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
