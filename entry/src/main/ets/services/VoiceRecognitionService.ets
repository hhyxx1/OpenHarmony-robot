import abilityAccessCtrl, { Permissions } from '@ohos.abilityAccessCtrl';
import audio from '@ohos.multimedia.audio';
import { VoiceCommand, CommandType } from '../models/RobotModels';
import { VOICE_CONFIG, VOICE_COMMANDS } from '../constants/RobotConstants';
import common from '@ohos.app.ability.common';

export interface VoiceRecognitionCallback {
  onWakeWordDetected: () => void;
  onCommandRecognized: (command: VoiceCommand, text: string) => void;
  onRecognitionFailed: (error: string) => void;
  onPermissionDenied: () => void;
}

export class VoiceRecognitionService {
  private isListening: boolean = false;
  private isWakeWordDetected: boolean = false;
  private callback: VoiceRecognitionCallback | null = null;
  private audioCapturer: audio.AudioCapturer | null = null;
  private context: common.UIAbilityContext | null = null;
  private audioStreamInfo: audio.AudioStreamInfo = {
    samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_16000,
    channels: audio.AudioChannel.CHANNEL_1,
    sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE,
    encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW
  };
  private audioCapturerInfo: audio.AudioCapturerInfo = {
    source: audio.SourceType.SOURCE_TYPE_MIC,
    capturerFlags: 0
  };
  private audioCapturerOptions: audio.AudioCapturerOptions = {
    streamInfo: this.audioStreamInfo,
    capturerInfo: this.audioCapturerInfo
  };
  private retryCount: number = 0;

  constructor(context: common.UIAbilityContext) {
    this.context = context;
  }

  setCallback(callback: VoiceRecognitionCallback): void {
    this.callback = callback;
  }

  async checkPermission(): Promise<boolean> {
    try {
      const atManager = abilityAccessCtrl.createAtManager();
      const permissions: Array<Permissions> = ['ohos.permission.MICROPHONE'];
      const result = await atManager.checkAccessToken(this.context!.applicationInfo.accessTokenId, 'ohos.permission.MICROPHONE');
      return result === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED;
    } catch (error) {
      console.error('检查权限失败:', error);
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const atManager = abilityAccessCtrl.createAtManager();
      const permissions: Array<Permissions> = ['ohos.permission.MICROPHONE'];
      const result = await atManager.requestPermissionsFromUser(this.context!, permissions);
      return result.authResults[0] === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED;
    } catch (error) {
      console.error('请求权限失败:', error);
      return false;
    }
  }

  async startListening(): Promise<boolean> {
    if (this.isListening) {
      return true;
    }

    const hasPermission = await this.checkPermission();
    if (!hasPermission) {
      const granted = await this.requestPermission();
      if (!granted) {
        this.callback?.onPermissionDenied();
        return false;
      }
    }

    try {
      this.audioCapturer = await audio.createAudioCapturer(this.audioCapturerOptions);
      this.isListening = true;
      this.startRecognition();
      return true;
    } catch (error) {
      console.error('启动录音失败:', error);
      this.callback?.onRecognitionFailed('启动录音失败');
      return false;
    }
  }

  stopListening(): void {
    if (this.isListening && this.audioCapturer) {
      try {
        this.audioCapturer.stop();
        this.audioCapturer.release();
      } catch (error) {
        console.error('停止录音失败:', error);
      }
      this.audioCapturer = null;
      this.isListening = false;
    }
  }

  private async startRecognition(): Promise<void> {
    if (!this.audioCapturer || !this.isListening) {
      return;
    }

    try {
      const bufferSize = 4096;
      const buffer = await this.audioCapturer.read(bufferSize, true);
      const audioData = new Uint8Array(buffer);

      const text = this.processAudioData(audioData);
      if (text) {
        this.handleRecognizedText(text);
      }

      if (this.isListening) {
        setTimeout(() => this.startRecognition(), 100);
      }
    } catch (error) {
      console.error('识别失败:', error);
      if (this.retryCount < VOICE_CONFIG.MAX_RETRY_COUNT) {
        this.retryCount++;
        setTimeout(() => this.startRecognition(), 500);
      } else {
        this.callback?.onRecognitionFailed('语音识别失败，请重试');
        this.retryCount = 0;
      }
    }
  }

  private processAudioData(audioData: Uint8Array): string {
    const voiceCommands = Object.keys(VOICE_COMMANDS);
    const sampleText = this.simulateRecognition(audioData);

    if (this.isWakeWordDetected) {
      for (const command of voiceCommands) {
        if (sampleText.includes(command)) {
          return command;
        }
      }
    } else {
      if (sampleText.includes(VOICE_CONFIG.WAKE_WORD)) {
        this.isWakeWordDetected = true;
        this.callback?.onWakeWordDetected();
        setTimeout(() => {
          this.isWakeWordDetected = false;
        }, 5000);
      }
    }

    return '';
  }

  private simulateRecognition(audioData: Uint8Array): string {
    const volume = this.calculateVolume(audioData);
    if (volume < 1000) {
      return '';
    }

    const commands = Object.keys(VOICE_COMMANDS);
    const randomIndex = Math.floor(Math.random() * (commands.length + 1));
    
    if (randomIndex < commands.length) {
      return commands[randomIndex];
    } else {
      return VOICE_CONFIG.WAKE_WORD;
    }
  }

  private calculateVolume(audioData: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < audioData.length; i += 2) {
      const sample = (audioData[i + 1] << 8) | audioData[i];
      sum += Math.abs(sample);
    }
    return sum / (audioData.length / 2);
  }

  private handleRecognizedText(text: string): void {
    if (text && VOICE_COMMANDS[text]) {
      this.callback?.onCommandRecognized(VOICE_COMMANDS[text], text);
      this.retryCount = 0;
    }
  }

  isListeningStatus(): boolean {
    return this.isListening;
  }

  isWakeWordActive(): boolean {
    return this.isWakeWordDetected;
  }

  resetWakeWord(): void {
    this.isWakeWordDetected = false;
  }

  destroy(): void {
    this.stopListening();
    this.callback = null;
  }
}

let voiceServiceInstance: VoiceRecognitionService | null = null;

export function getVoiceService(context?: common.UIAbilityContext): VoiceRecognitionService {
  if (!voiceServiceInstance && context) {
    voiceServiceInstance = new VoiceRecognitionService(context);
  }
  return voiceServiceInstance!;
}
