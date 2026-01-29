import type { VoiceCommand } from '../models/RobotModels';
export const NETWORK_CONFIG = {
    DEFAULT_HOST: '127.0.0.1',
    DEFAULT_PORT: 8888,
    CONNECT_TIMEOUT: 5000,
    REQUEST_TIMEOUT: 10000,
    RETRY_COUNT: 3,
    RETRY_DELAY: 2000
};
export const VOICE_CONFIG = {
    WAKE_WORD: 'tidybot',
    RECOGNITION_TIMEOUT: 1500,
    MAX_RETRY_COUNT: 3
};
export const VOICE_COMMANDS: Record<string, VoiceCommand> = {
    '前进': { command: 'move_forward' },
    '后退': { command: 'move_back' },
    '左转': { command: 'turn_left' },
    '右转': { command: 'turn_right' },
    '抓取': { command: 'grab' },
    '释放': { command: 'release' },
    '启动仿真': { command: 'start_sim' },
    '暂停仿真': { command: 'pause_sim' },
    '停止仿真': { command: 'stop_sim' }
};
export const PARAM_RANGES = {
    speed: { min: 0, max: 100 },
    force: { min: 0, max: 100 }
};
export const JOINT_ANGLE_RANGE = { min: -3.14, max: 3.14 };
export const POSTURE_RANGE = { min: -1.57, max: 1.57 };
export const FPS_MIN = 30;
export const LOG_CONFIG = {
    MAX_LOGS: 100,
    AUTO_SCROLL_DELAY: 300
};
export const UI_CONFIG = {
    REFRESH_INTERVAL: 1000,
    TOAST_DURATION: 2000,
    LOADING_ANIMATION_DURATION: 1000
};
