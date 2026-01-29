import { MonitorData, RobotStatus } from '../models/RobotModels';
import { JOINT_ANGLE_RANGE, POSTURE_RANGE, FPS_MIN } from '../constants/RobotConstants';

@Component
export struct MonitorPanel {
  @Prop monitorData: MonitorData | null = null;
  @Prop robotStatus: RobotStatus = {
    mode: 'stop',
    sim_status: 'stopped',
    sim_time: '--:--:--',
    connected: false
  };
  @Prop isLoading: boolean = false;
  @Prop showPlaceholder: boolean = true;
  private onRefresh?: () => void;

  public setRefreshCallback(callback: () => void): void {
    this.onRefresh = callback;
  }

  private isAbnormal(value: number, min: number, max: number): boolean {
    return value < min || value > max;
  }

  private getStatusColor(mode: string): ResourceColor {
    switch (mode) {
      case 'stop':
        return $r('app.color.status_stop');
      case 'running':
        return $r('app.color.status_running');
      case 'standby':
        return $r('app.color.status_standby');
      default:
        return $r('app.color.status_stop');
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

  build() {
    Column() {
      Row() {
        Text($r('app.string.monitor_title'))
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)

        Button($r('app.string.refresh'))
          .fontSize(14)
          .fontColor($r('app.color.primary_blue'))
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            this.onRefresh?.();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 8 })

      if (this.isLoading) {
        Column() {
          LoadingProgress()
            .width(40)
            .height(40)
            .color($r('app.color.primary_blue'))

          Text($r('app.string.loading'))
            .fontSize(14)
            .fontColor($r('app.color.text_secondary'))
            .margin({ top: 12 })
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      } else if (this.showPlaceholder || !this.monitorData) {
        Column() {
          Text($r('app.string.no_data'))
            .fontSize(14)
            .fontColor($r('app.color.text_hint'))
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      } else {
        Scroll() {
          Column() {
            this.StatusSection()
            Divider()
              .color($r('app.color.divider_color'))
              .strokeWidth(1)
              .margin({ top: 8, bottom: 8 })
            this.DataSection()
          }
          .width('100%')
          .padding({ left: 16, right: 16, bottom: 12 })
        }
        .width('100%')
        .layoutWeight(1)
        .scrollBar(BarState.Auto)
        .edgeEffect(EdgeEffect.Spring)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.background_card'))
    .borderRadius(12)
  }

  @Builder
  StatusSection() {
    Column() {
      Row() {
        Text($r('app.string.robot_status'))
          .fontSize(14)
          .fontColor($r('app.color.text_secondary'))
          .layoutWeight(1)

        Row() {
          Text(this.getStatusIcon(this.robotStatus.mode))
            .fontSize(16)
            .fontColor(this.getStatusColor(this.robotStatus.mode))
            .margin({ right: 4 })

          Text(this.getStatusText(this.robotStatus.mode))
            .fontSize(14)
            .fontColor($r('app.color.text_primary'))
        }
      }
      .width('100%')
      .margin({ bottom: 8 })

      Row() {
        Text($r('app.string.sim_status'))
          .fontSize(14)
          .fontColor($r('app.color.text_secondary'))
          .layoutWeight(1)

        Text(this.getSimStatusText(this.robotStatus.sim_status))
          .fontSize(14)
          .fontColor($r('app.color.text_primary'))
      }
      .width('100%')
      .margin({ bottom: 8 })

      Row() {
        Text($r('app.string.sim_time'))
          .fontSize(14)
          .fontColor($r('app.color.text_secondary'))
          .layoutWeight(1)

        Text(this.robotStatus.sim_time)
          .fontSize(14)
          .fontColor($r('app.color.text_primary'))
      }
      .width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }

  @Builder
  DataSection() {
    Column() {
      this.JointDataSection()
      this.EndEffectorSection()
      this.PostureSection()
      this.FpsSection()
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }

  @Builder
  JointDataSection() {
    Column() {
      Text($r('app.string.joint_angle'))
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))
        .margin({ bottom: 4 })

      Flex({ wrap: FlexWrap.Wrap }) {
        ForEach(this.monitorData?.joint_angle || [], (angle: number, index: number) => {
          Text(`J${index + 1}: ${this.formatNumber(angle)}`)
            .fontSize(12)
            .fontColor($r('app.color.text_primary'))
            .padding({ left: 8, right: 8, top: 4, bottom: 4 })
            .backgroundColor(this.isAbnormal(angle, JOINT_ANGLE_RANGE.min, JOINT_ANGLE_RANGE.max) ?
              $r('app.color.error_red') : $r('app.color.neutral_gray_light'))
            .borderRadius(4)
            .margin({ right: 4, bottom: 4 })
        })
      }
      .width('100%')

      Text($r('app.string.joint_speed'))
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))
        .margin({ top: 8, bottom: 4 })

      Flex({ wrap: FlexWrap.Wrap }) {
        ForEach(this.monitorData?.joint_speed || [], (speed: number, index: number) => {
          Text(`S${index + 1}: ${this.formatNumber(speed, 0)}`)
            .fontSize(12)
            .fontColor($r('app.color.text_primary'))
            .padding({ left: 8, right: 8, top: 4, bottom: 4 })
            .backgroundColor($r('app.color.neutral_gray_light'))
            .borderRadius(4)
            .margin({ right: 4, bottom: 4 })
        })
      }
      .width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 12 })
  }

  @Builder
  EndEffectorSection() {
    Column() {
      Text($r('app.string.end_effector'))
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))
        .margin({ bottom: 4 })

      Row() {
        Text(`X: ${this.formatNumber(this.monitorData?.end_effector?.x || 0)}`)
          .fontSize(12)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)

        Text(`Y: ${this.formatNumber(this.monitorData?.end_effector?.y || 0)}`)
          .fontSize(12)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)

        Text(`Z: ${this.formatNumber(this.monitorData?.end_effector?.z || 0)}`)
          .fontSize(12)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)
      }
      .width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 12 })
  }

  @Builder
  PostureSection() {
    Column() {
      Text($r('app.string.posture'))
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))
        .margin({ bottom: 4 })

      Row() {
        Text(`俯仰: ${this.formatNumber(this.monitorData?.posture?.pitch || 0)}`)
          .fontSize(12)
          .fontColor(this.isAbnormal(this.monitorData?.posture?.pitch || 0, POSTURE_RANGE.min, POSTURE_RANGE.max) ?
            $r('app.color.error_red') : $r('app.color.text_primary'))
          .layoutWeight(1)

        Text(`横滚: ${this.formatNumber(this.monitorData?.posture?.roll || 0)}`)
          .fontSize(12)
          .fontColor(this.isAbnormal(this.monitorData?.posture?.roll || 0, POSTURE_RANGE.min, POSTURE_RANGE.max) ?
            $r('app.color.error_red') : $r('app.color.text_primary'))
          .layoutWeight(1)
      }
      .width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 12 })
  }

  @Builder
  FpsSection() {
    Row() {
      Text($r('app.string.fps'))
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))
        .layoutWeight(1)

      Text(`${this.monitorData?.fps || 0} FPS`)
        .fontSize(14)
        .fontColor((this.monitorData?.fps || 0) < FPS_MIN ? $r('app.color.error_red') : $r('app.color.text_primary'))
        .fontWeight(FontWeight.Bold)
    }
    .width('100%')
  }

  private getStatusText(mode: string): ResourceStr {
    switch (mode) {
      case 'stop':
        return $r('app.string.status_stop');
      case 'running':
        return $r('app.string.status_running');
      case 'standby':
        return $r('app.string.status_standby');
      default:
        return $r('app.string.status_stop');
    }
  }

  private getSimStatusText(status: string): ResourceStr {
    switch (status) {
      case 'started':
        return $r('app.string.sim_started');
      case 'paused':
        return $r('app.string.sim_paused');
      case 'stopped':
        return $r('app.string.sim_stopped');
      default:
        return $r('app.string.sim_stopped');
    }
  }
}
