if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MonitorPanel_Params {
    monitorData?: MonitorData | null;
    robotStatus?: RobotStatus;
    isLoading?: boolean;
    showPlaceholder?: boolean;
    onRefresh?: () => void;
}
import type { MonitorData, RobotStatus } from '../models/RobotModels';
import { JOINT_ANGLE_RANGE, POSTURE_RANGE, FPS_MIN } from "@normalized:N&&&entry/src/main/ets/constants/RobotConstants&";
export class MonitorPanel extends ViewPU {
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
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__showPlaceholder = new ObservedPropertySimplePU(true, this, "showPlaceholder");
        this.onRefresh = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MonitorPanel_Params) {
        if (params.monitorData !== undefined) {
            this.monitorData = params.monitorData;
        }
        if (params.robotStatus !== undefined) {
            this.robotStatus = params.robotStatus;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.showPlaceholder !== undefined) {
            this.showPlaceholder = params.showPlaceholder;
        }
        if (params.onRefresh !== undefined) {
            this.onRefresh = params.onRefresh;
        }
    }
    updateStateVars(params: MonitorPanel_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__monitorData.purgeDependencyOnElmtId(rmElmtId);
        this.__robotStatus.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__showPlaceholder.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__monitorData.aboutToBeDeleted();
        this.__robotStatus.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__showPlaceholder.aboutToBeDeleted();
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
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __showPlaceholder: ObservedPropertySimplePU<boolean>;
    get showPlaceholder() {
        return this.__showPlaceholder.get();
    }
    set showPlaceholder(newValue: boolean) {
        this.__showPlaceholder.set(newValue);
    }
    private onRefresh?: () => void;
    public setMonitorData(data: MonitorData): void {
        this.monitorData = data;
        this.showPlaceholder = false;
    }
    public setRobotStatus(status: RobotStatus): void {
        this.robotStatus = status;
    }
    public setLoading(loading: boolean): void {
        this.isLoading = loading;
    }
    public setRefreshCallback(callback: () => void): void {
        this.onRefresh = callback;
    }
    private isAbnormal(value: number, min: number, max: number): boolean {
        return value < min || value > max;
    }
    private getStatusColor(mode: string): ResourceColor {
        switch (mode) {
            case 'stop':
                return { "id": 16777237, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" };
            case 'running':
                return { "id": 16777235, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" };
            case 'standby':
                return { "id": 16777236, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" };
            default:
                return { "id": 16777237, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" };
        }
    }
    private getStatusIcon(mode: string): string {
        switch (mode) {
            case 'stop':
                return '■';
            case 'running':
                return '●';
            case 'standby':
                return '○';
            default:
                return '■';
        }
    }
    private formatNumber(value: number, decimals: number = 2): string {
        return value.toFixed(decimals);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/MonitorPanel.ets(69:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777221, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/MonitorPanel.ets(70:7)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777284, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(71:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/components/MonitorPanel.ets(77:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                this.onRefresh?.();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create($r('sys.symbol.refresh'));
            Image.debugLine("entry/src/main/ets/components/MonitorPanel.ets(78:11)", "entry");
            Image.width(20);
            Image.height(20);
            Image.fillColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
        }, Image);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/MonitorPanel.ets(93:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/components/MonitorPanel.ets(94:11)", "entry");
                        LoadingProgress.width(40);
                        LoadingProgress.height(40);
                        LoadingProgress.color({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777279, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(99:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Text.margin({ top: 12 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else if (this.showPlaceholder || !this.monitorData) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/MonitorPanel.ets(108:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777288, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(109:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 16777239, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/components/MonitorPanel.ets(117:9)", "entry");
                        Scroll.width('100%');
                        Scroll.layoutWeight(1);
                        Scroll.scrollBar(BarState.Auto);
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/MonitorPanel.ets(118:11)", "entry");
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, bottom: 12 });
                    }, Column);
                    this.StatusSection.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                        Divider.debugLine("entry/src/main/ets/components/MonitorPanel.ets(120:13)", "entry");
                        Divider.color({ "id": 16777224, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                        Divider.strokeWidth(1);
                        Divider.margin({ top: 8, bottom: 8 });
                    }, Divider);
                    this.DataSection.bind(this)();
                    Column.pop();
                    Scroll.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    StatusSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/MonitorPanel.ets(143:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/MonitorPanel.ets(144:7)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777304, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(145:9)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/MonitorPanel.ets(150:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getStatusIcon(this.robotStatus.mode));
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(151:11)", "entry");
            Text.fontSize(16);
            Text.fontColor(this.getStatusColor(this.robotStatus.mode));
            Text.margin({ right: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getStatusText(this.robotStatus.mode));
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(156:11)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/MonitorPanel.ets(164:7)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777307, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(165:9)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getSimStatusText(this.robotStatus.sim_status));
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(170:9)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/MonitorPanel.ets(177:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777309, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(178:9)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.robotStatus.sim_time);
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(183:9)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    DataSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/MonitorPanel.ets(195:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.JointDataSection.bind(this)();
        this.EndEffectorSection.bind(this)();
        this.PostureSection.bind(this)();
        this.FpsSection.bind(this)();
        Column.pop();
    }
    JointDataSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/MonitorPanel.ets(207:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777277, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(208:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap });
            Flex.debugLine("entry/src/main/ets/components/MonitorPanel.ets(213:7)", "entry");
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const angle = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`J${index + 1}: ${this.formatNumber(angle)}`);
                    Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(215:11)", "entry");
                    Text.fontSize(12);
                    Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                    Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                    Text.backgroundColor(this.isAbnormal(angle, JOINT_ANGLE_RANGE.min, JOINT_ANGLE_RANGE.max) ? { "id": 16777225, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } : { "id": 16777231, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                    Text.borderRadius(4);
                    Text.margin({ right: 4, bottom: 4 });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.monitorData?.joint_angle || [], forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777278, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(227:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.margin({ top: 8, bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap });
            Flex.debugLine("entry/src/main/ets/components/MonitorPanel.ets(232:7)", "entry");
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const speed = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`S${index + 1}: ${this.formatNumber(speed, 0)}`);
                    Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(234:11)", "entry");
                    Text.fontSize(12);
                    Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                    Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                    Text.backgroundColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                    Text.borderRadius(4);
                    Text.margin({ right: 4, bottom: 4 });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.monitorData?.joint_speed || [], forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
        Column.pop();
    }
    EndEffectorSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/MonitorPanel.ets(252:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777272, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(253:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/MonitorPanel.ets(258:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`X: ${this.formatNumber(this.monitorData?.end_effector?.x || 0)}`);
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(259:9)", "entry");
            Text.fontSize(12);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`Y: ${this.formatNumber(this.monitorData?.end_effector?.y || 0)}`);
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(264:9)", "entry");
            Text.fontSize(12);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`Z: ${this.formatNumber(this.monitorData?.end_effector?.z || 0)}`);
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(269:9)", "entry");
            Text.fontSize(12);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    PostureSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/MonitorPanel.ets(283:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777296, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(284:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/MonitorPanel.ets(289:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`俯仰: ${this.formatNumber(this.monitorData?.posture?.pitch || 0)}`);
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(290:9)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.isAbnormal(this.monitorData?.posture?.pitch || 0, POSTURE_RANGE.min, POSTURE_RANGE.max) ? { "id": 16777225, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } : { "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`横滚: ${this.formatNumber(this.monitorData?.posture?.roll || 0)}`);
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(296:9)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.isAbnormal(this.monitorData?.posture?.roll || 0, POSTURE_RANGE.min, POSTURE_RANGE.max) ? { "id": 16777225, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } : { "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    FpsSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/MonitorPanel.ets(311:5)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777273, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(312:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.monitorData?.fps || 0} FPS`);
            Text.debugLine("entry/src/main/ets/components/MonitorPanel.ets(317:7)", "entry");
            Text.fontSize(14);
            Text.fontColor((this.monitorData?.fps || 0) < FPS_MIN ? { "id": 16777225, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } : { "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
    }
    private getStatusText(mode: string): string {
        switch (mode) {
            case 'stop':
                return { "id": 16777313, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string;
            case 'running':
                return { "id": 16777311, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string;
            case 'standby':
                return { "id": 16777312, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string;
            default:
                return { "id": 16777313, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string;
        }
    }
    private getSimStatusText(status: string): string {
        switch (status) {
            case 'started':
                return { "id": 16777306, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string;
            case 'paused':
                return { "id": 16777305, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string;
            case 'stopped':
                return { "id": 16777308, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string;
            default:
                return { "id": 16777308, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string;
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
