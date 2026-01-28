import { LogEntry } from '../models/RobotModels';
import { LOG_CONFIG } from '../constants/RobotConstants';
import pasteboard from '@ohos.pasteboard';

@Component
export struct LogPanel {
  @Prop logs: LogEntry[] = [];
  private scroller: Scroller = new Scroller();
  private onRetry?: (log: LogEntry) => void;

  public setRetryCallback(callback: (log: LogEntry) => void): void {
    this.onRetry = callback;
  }

  private getLogColor(type: string): ResourceColor {
    switch (type) {
      case 'manual':
        return $r('app.color.log_manual');
      case 'voice':
        return $r('app.color.log_voice');
      case 'system':
        return $r('app.color.log_system');
      default:
        return $r('app.color.text_primary');
    }
  }

  private getResultColor(result?: string): ResourceColor {
    switch (result) {
      case 'success':
        return $r('app.color.success_green');
      case 'fail':
        return $r('app.color.error_red');
      default:
        return $r('app.color.text_secondary');
    }
  }

  private copyToClipboard(text: string): void {
    try {
      const pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
      const systemPasteboard = pasteboard.getSystemPasteboard();
      systemPasteboard.setData(pasteData);
    } catch (error) {
      console.error('复制失败:', error);
    }
  }

  build() {
    Column() {
      Row() {
        Text($r('app.string.log_title'))
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 8 })

      if (this.logs.length === 0) {
        Column() {
          Text('暂无操作日志')
            .fontSize(14)
            .fontColor($r('app.color.text_hint'))
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      } else {
        List({ scroller: this.scroller }) {
          ForEach(this.logs, (log: LogEntry) => {
            ListItem() {
              Row() {
                Column() {
                  Text(log.content)
                    .fontSize(14)
                    .fontColor(this.getLogColor(log.type))
                    .maxLines(3)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })

                  if (log.result) {
                    Text(log.result === 'success' ? $r('app.string.cmd_success') : $r('app.string.cmd_failed'))
                      .fontSize(12)
                      .fontColor(this.getResultColor(log.result))
                      .margin({ top: 4 })
                  }
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)
                .margin({ right: 8 })

                Column() {
                  Text(log.timestamp)
                    .fontSize(12)
                    .fontColor($r('app.color.text_hint'))

                  if (log.canRetry && log.result === 'fail') {
                    Button($r('app.string.retry'))
                      .fontSize(12)
                      .fontColor($r('app.color.primary_blue'))
                      .backgroundColor(Color.Transparent)
                      .margin({ top: 4 })
                      .onClick(() => {
                        this.onRetry?.(log);
                      })
                  }
                }
                .alignItems(HorizontalAlign.End)
              }
              .width('100%')
              .padding(12)
              .backgroundColor($r('app.color.neutral_gray_light'))
              .borderRadius(8)
              .margin({ bottom: 8 })
              .gesture(
                LongPressGesture()
                  .onAction(() => {
                    this.copyToClipboard(log.content);
                  })
              )
            }
          })
        }
        .width('100%')
        .layoutWeight(1)
        .padding({ left: 16, right: 16, bottom: 12 })
        .scrollBar(BarState.Auto)
        .edgeEffect(EdgeEffect.Spring)
        .onScroll((scrollOffset: number, scrollState: ScrollState) => {
          if (scrollState === ScrollState.Scroll) {
            console.info('Scroll to top');
          }
        })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.background_card'))
    .borderRadius(12)
  }
}
