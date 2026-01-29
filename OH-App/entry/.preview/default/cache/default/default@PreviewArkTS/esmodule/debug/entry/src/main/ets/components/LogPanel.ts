if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LogPanel_Params {
    logs?: LogEntry[];
    scroller?: Scroller;
    onRetry?: (log: LogEntry) => void;
}
import type { LogEntry } from '../models/RobotModels';
import { LOG_CONFIG } from "@normalized:N&&&entry/src/main/ets/constants/RobotConstants&";
import pasteboard from "@ohos:pasteboard";
export class LogPanel extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__logs = new ObservedPropertyObjectPU([], this, "logs");
        this.scroller = new Scroller();
        this.onRetry = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LogPanel_Params) {
        if (params.logs !== undefined) {
            this.logs = params.logs;
        }
        if (params.scroller !== undefined) {
            this.scroller = params.scroller;
        }
        if (params.onRetry !== undefined) {
            this.onRetry = params.onRetry;
        }
    }
    updateStateVars(params: LogPanel_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__logs.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__logs.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __logs: ObservedPropertyObjectPU<LogEntry[]>;
    get logs() {
        return this.__logs.get();
    }
    set logs(newValue: LogEntry[]) {
        this.__logs.set(newValue);
    }
    private scroller: Scroller;
    private onRetry?: (log: LogEntry) => void;
    public addLog(log: LogEntry): void {
        this.logs = [...this.logs, log];
        if (this.logs.length > LOG_CONFIG.MAX_LOGS) {
            this.logs = this.logs.slice(-LOG_CONFIG.MAX_LOGS);
        }
        setTimeout(() => {
            this.scroller.scrollEdge(Edge.Bottom);
        }, LOG_CONFIG.AUTO_SCROLL_DELAY);
    }
    public clearLogs(): void {
        this.logs = [];
    }
    public setRetryCallback(callback: (log: LogEntry) => void): void {
        this.onRetry = callback;
    }
    private getLogColor(type: string): ResourceColor {
        switch (type) {
            case 'manual':
                return { "id": 16777226, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" };
            case 'voice':
                return { "id": 16777228, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" };
            case 'system':
                return { "id": 16777227, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" };
            default:
                return { "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" };
        }
    }
    private getResultColor(result?: string): ResourceColor {
        switch (result) {
            case 'success':
                return { "id": 16777238, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" };
            case 'fail':
                return { "id": 16777225, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" };
            default:
                return { "id": 16777241, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" };
        }
    }
    private copyToClipboard(text: string): void {
        try {
            const pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
            const systemPasteboard = pasteboard.getSystemPasteboard();
            systemPasteboard.setData(pasteData);
        }
        catch (error) {
            console.error('复制失败:', error);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/LogPanel.ets(64:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777221, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/LogPanel.ets(65:7)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777280, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/components/LogPanel.ets(66:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777240, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.logs.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/LogPanel.ets(76:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无操作日志');
                        Text.debugLine("entry/src/main/ets/components/LogPanel.ets(77:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 16777239, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ scroller: this.scroller });
                        List.debugLine("entry/src/main/ets/components/LogPanel.ets(85:9)", "entry");
                        List.width('100%');
                        List.layoutWeight(1);
                        List.padding({ left: 16, right: 16, bottom: 12 });
                        List.scrollBar(BarState.Auto);
                        List.edgeEffect(EdgeEffect.Spring);
                        List.onScrollEdge((side: Edge) => {
                            if (side === Edge.Top) {
                                console.info({ "id": 16777281, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } as string);
                            }
                        });
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const log = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                    ListItem.debugLine("entry/src/main/ets/components/LogPanel.ets(87:13)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.debugLine("entry/src/main/ets/components/LogPanel.ets(88:15)", "entry");
                                        Row.width('100%');
                                        Row.padding(12);
                                        Row.backgroundColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                                        Row.borderRadius(8);
                                        Row.margin({ bottom: 8 });
                                        Gesture.create(GesturePriority.Low);
                                        LongPressGesture.create();
                                        LongPressGesture.onAction(() => {
                                            this.copyToClipboard(log.content);
                                        });
                                        LongPressGesture.pop();
                                        Gesture.pop();
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/components/LogPanel.ets(89:17)", "entry");
                                        Column.alignItems(HorizontalAlign.Start);
                                        Column.layoutWeight(1);
                                        Column.margin({ right: 8 });
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(log.content);
                                        Text.debugLine("entry/src/main/ets/components/LogPanel.ets(90:19)", "entry");
                                        Text.fontSize(14);
                                        Text.fontColor(this.getLogColor(log.type));
                                        Text.maxLines(3);
                                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (log.result) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(log.result === 'success' ? { "id": 16777265, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" } : { "id": 16777264, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                                                    Text.debugLine("entry/src/main/ets/components/LogPanel.ets(97:21)", "entry");
                                                    Text.fontSize(12);
                                                    Text.fontColor(this.getResultColor(log.result));
                                                    Text.margin({ top: 4 });
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    Column.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/components/LogPanel.ets(107:17)", "entry");
                                        Column.alignItems(HorizontalAlign.End);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(log.timestamp);
                                        Text.debugLine("entry/src/main/ets/components/LogPanel.ets(108:19)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor({ "id": 16777239, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (log.canRetry && log.result === 'fail') {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Button.createWithLabel({ "id": 16777301, "type": 10003, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                                                    Button.debugLine("entry/src/main/ets/components/LogPanel.ets(113:21)", "entry");
                                                    Button.fontSize(12);
                                                    Button.fontColor({ "id": 16777233, "type": 10001, params: [], "bundleName": "com.dudh.roboctrl", "moduleName": "entry" });
                                                    Button.backgroundColor(Color.Transparent);
                                                    Button.margin({ top: 4 });
                                                    Button.onClick(() => {
                                                        this.onRetry?.(log);
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
                                    Column.pop();
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.logs, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
