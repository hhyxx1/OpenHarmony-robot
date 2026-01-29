import { CommandType, ControlParam, VoiceCommand } from '../models/RobotModels';
import { PARAM_RANGES } from '../constants/RobotConstants';

@Component
export struct ControlPanel {
  @Prop isConnected: boolean = false;
  @Prop isVoiceActive: boolean = false;
  @Prop voicePreviewText: string = '';
  @Prop pendingVoiceCommand: VoiceCommand | null = null;
  @Prop speedValue: string = '50';
  @Prop forceValue: string = '50';
  @Prop isProcessing: boolean = false;
  private onCommandSend?: (command: CommandType, param: ControlParam, source: 'manual' | 'voice') => void;
  private onVoiceToggle?: () => void;
  private onVoiceConfirm?: () => void;
  private onVoiceCancel?: () => void;

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

  build() {
    Column() {
      Text($r('app.string.control_title'))
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor($r('app.color.text_primary'))
        .width('100%')
        .padding({ left: 16, right: 16, top: 12, bottom: 8 })

      Scroll() {
        Column() {
          this.VoiceSection()
          this.DirectionControlSection()
          this.ArmControlSection()
          this.ExecutorControlSection()
          this.SimControlSection()
          this.ParamSection()
        }
        .width('100%')
        .padding({ left: 16, right: 16, bottom: 12 })
      }
      .width('100%')
      .layoutWeight(1)
      .scrollBar(BarState.Auto)
      .edgeEffect(EdgeEffect.Spring)
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.background_card'))
    .borderRadius(12)
  }

  @Builder
  VoiceSection() {
    Column() {
      Button() {
        Row() {
          Image($r('sys.symbol.mic'))
            .width(20)
            .height(20)
            .fillColor($r('app.color.neutral_white'))
            .margin({ right: 8 })

          Text('语音控制')
            .fontSize(14)
            .fontColor($r('app.color.neutral_white'))
        }
        .justifyContent(FlexAlign.Center)
        .width('100%')
      }
      .width('100%')
      .height(44)
      .backgroundColor(this.isVoiceActive ? $r('app.color.success_green') : $r('app.color.primary_blue'))
      .borderRadius(8)
      .enabled(!this.isProcessing)
      .onClick(() => {
        this.onVoiceToggle?.();
      })

      if (this.voicePreviewText && this.pendingVoiceCommand) {
        Column() {
          Text($r('app.string.voice_preview'))
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
            .margin({ bottom: 4 })

          Text(this.voicePreviewText)
            .fontSize(16)
            .fontColor($r('app.color.primary_blue'))
            .fontWeight(FontWeight.Bold)
            .margin({ bottom: 8 })

          Row() {
            Button($r('app.string.cancel'))
              .fontSize(14)
              .fontColor($r('app.color.text_secondary'))
              .backgroundColor($r('app.color.neutral_gray_light'))
              .layoutWeight(1)
              .margin({ right: 8 })
              .onClick(() => {
                this.handleVoiceCancel();
              })

            Button($r('app.string.confirm'))
              .fontSize(14)
              .fontColor($r('app.color.neutral_white'))
              .backgroundColor($r('app.color.primary_blue'))
              .layoutWeight(1)
              .onClick(() => {
                this.handleVoiceConfirm();
              })
          }
          .width('100%')
        }
        .width('100%')
        .padding(12)
        .backgroundColor($r('app.color.neutral_gray_light'))
        .borderRadius(8)
        .margin({ top: 8 })
      }
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 12 })
  }

  @Builder
  DirectionControlSection() {
    Column() {
      Text('方向控制')
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))
        .margin({ bottom: 8 })

      Column() {
        Button() {
          Image($r('sys.symbol.arrow_up'))
            .width(24)
            .height(24)
            .fillColor($r('app.color.neutral_white'))
        }
        .width(56)
        .height(56)
        .backgroundColor($r('app.color.primary_blue'))
        .borderRadius(8)
        .enabled(this.isConnected && !this.isProcessing)
        .onClick(() => {
          this.handleCommand('move_forward');
        })

        Row() {
          Button() {
            Image($r('sys.symbol.arrow_left'))
              .width(24)
              .height(24)
              .fillColor($r('app.color.neutral_white'))
          }
          .width(56)
          .height(56)
          .backgroundColor($r('app.color.primary_blue'))
          .borderRadius(8)
          .enabled(this.isConnected && !this.isProcessing)
          .margin({ right: 8 })
          .onClick(() => {
            this.handleCommand('turn_left');
          })

          Button() {
            Image($r('sys.symbol.arrow_right'))
              .width(24)
              .height(24)
              .fillColor($r('app.color.neutral_white'))
          }
          .width(56)
          .height(56)
          .backgroundColor($r('app.color.primary_blue'))
          .borderRadius(8)
          .enabled(this.isConnected && !this.isProcessing)
          .onClick(() => {
            this.handleCommand('turn_right');
          })
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .margin({ top: 8 })

        Button() {
          Image($r('sys.symbol.arrow_down'))
            .width(24)
            .height(24)
            .fillColor($r('app.color.neutral_white'))
        }
        .width(56)
        .height(56)
        .backgroundColor($r('app.color.primary_blue'))
        .borderRadius(8)
        .enabled(this.isConnected && !this.isProcessing)
        .margin({ top: 8 })
        .onClick(() => {
          this.handleCommand('move_back');
        })
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 12 })
  }

  @Builder
  ArmControlSection() {
    Column() {
      Text('机械臂控制')
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))
        .margin({ bottom: 8 })

      Column() {
        Row() {
          Text('关节1')
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
            .layoutWeight(1)

          Button('▲')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint1_up');
            })

          Button('▼')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .margin({ left: 4 })
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint1_down');
            })
        }
        .width('100%')
        .alignItems(VerticalAlign.Center)
        .margin({ bottom: 8 })

        Row() {
          Text('关节2')
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
            .layoutWeight(1)

          Button('▲')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint2_up');
            })

          Button('▼')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .margin({ left: 4 })
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint2_down');
            })
        }
        .width('100%')
        .alignItems(VerticalAlign.Center)
        .margin({ bottom: 8 })

        Row() {
          Text('关节3')
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
            .layoutWeight(1)

          Button('▲')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint3_up');
            })

          Button('▼')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .margin({ left: 4 })
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint3_down');
            })
        }
        .width('100%')
        .alignItems(VerticalAlign.Center)
        .margin({ bottom: 8 })

        Row() {
          Text('关节4')
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
            .layoutWeight(1)

          Button('▲')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint4_up');
            })

          Button('▼')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .margin({ left: 4 })
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint4_down');
            })
        }
        .width('100%')
        .alignItems(VerticalAlign.Center)
        .margin({ bottom: 8 })

        Row() {
          Text('关节5')
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
            .layoutWeight(1)

          Button('▲')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint5_up');
            })

          Button('▼')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .margin({ left: 4 })
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint5_down');
            })
        }
        .width('100%')
        .alignItems(VerticalAlign.Center)
        .margin({ bottom: 8 })

        Row() {
          Text('关节6')
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
            .layoutWeight(1)

          Button('▲')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint6_up');
            })

          Button('▼')
            .fontSize(16)
            .fontColor($r('app.color.neutral_white'))
            .backgroundColor($r('app.color.primary_blue'))
            .width(40)
            .height(32)
            .borderRadius(6)
            .margin({ left: 4 })
            .enabled(this.isConnected && !this.isProcessing)
            .onClick(() => {
              this.handleCommand('arm_joint6_down');
            })
        }
        .width('100%')
        .alignItems(VerticalAlign.Center)
      }
      .width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 12 })
  }

  @Builder
  ExecutorControlSection() {
    Column() {
      Text('执行器控制')
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))
        .margin({ bottom: 8 })

      Row() {
        Button($r('app.string.grab'))
          .fontSize(14)
          .fontColor($r('app.color.neutral_white'))
          .backgroundColor($r('app.color.success_green'))
          .layoutWeight(1)
          .enabled(this.isConnected && !this.isProcessing)
          .margin({ right: 8 })
          .onClick(() => {
            this.handleCommand('grab');
          })

        Button($r('app.string.release'))
          .fontSize(14)
          .fontColor($r('app.color.neutral_white'))
          .backgroundColor($r('app.color.error_red'))
          .layoutWeight(1)
          .enabled(this.isConnected && !this.isProcessing)
          .onClick(() => {
            this.handleCommand('release');
          })
      }
      .width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 12 })
  }

  @Builder
  SimControlSection() {
    Column() {
      Text('仿真控制')
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))
        .margin({ bottom: 8 })

      Row() {
        Button($r('app.string.start_sim'))
          .fontSize(14)
          .fontColor($r('app.color.neutral_white'))
          .backgroundColor($r('app.color.success_green'))
          .layoutWeight(1)
          .enabled(!this.isProcessing)
          .margin({ right: 8 })
          .onClick(() => {
            this.handleCommand('start_sim');
          })

        Button($r('app.string.pause_sim'))
          .fontSize(14)
          .fontColor($r('app.color.neutral_white'))
          .backgroundColor($r('app.color.primary_blue'))
          .layoutWeight(1)
          .enabled(this.isConnected && !this.isProcessing)
          .margin({ right: 8 })
          .onClick(() => {
            this.handleCommand('pause_sim');
          })

        Button($r('app.string.stop_sim'))
          .fontSize(14)
          .fontColor($r('app.color.neutral_white'))
          .backgroundColor($r('app.color.error_red'))
          .layoutWeight(1)
          .enabled(this.isConnected && !this.isProcessing)
          .onClick(() => {
            this.handleCommand('stop_sim');
          })
      }
      .width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 12 })
  }

  @Builder
  ParamSection() {
    Column() {
      Text('参数调节')
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))
        .margin({ bottom: 8 })

      Row() {
        Text($r('app.string.param_speed'))
          .fontSize(14)
          .fontColor($r('app.color.text_primary'))
          .width(60)

        TextInput({ placeholder: '0-100', text: this.speedValue })
          .type(InputType.Number)
          .fontSize(14)
          .backgroundColor($r('app.color.neutral_gray_light'))
          .borderRadius(8)
          .layoutWeight(1)
          .enabled(!this.isProcessing)
          .onChange((value: string) => {
            this.speedValue = value;
          })
          .onSubmit(() => {
            if (this.validateSpeed(this.speedValue)) {
              const param: ControlParam = { speed: parseFloat(this.speedValue) };
              this.handleCommand('adjust_param', param);
            }
          })
      }
      .width('100%')
      .margin({ bottom: 8 })

      Row() {
        Text($r('app.string.param_force'))
          .fontSize(14)
          .fontColor($r('app.color.text_primary'))
          .width(60)

        TextInput({ placeholder: '0-100', text: this.forceValue })
          .type(InputType.Number)
          .fontSize(14)
          .backgroundColor($r('app.color.neutral_gray_light'))
          .borderRadius(8)
          .layoutWeight(1)
          .enabled(!this.isProcessing)
          .onChange((value: string) => {
            this.forceValue = value;
          })
          .onSubmit(() => {
            if (this.validateForce(this.forceValue)) {
              const param: ControlParam = { force: parseFloat(this.forceValue) };
              this.handleCommand('adjust_param', param);
            }
          })
      }
      .width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }
}
