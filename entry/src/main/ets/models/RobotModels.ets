export interface EndEffectorData {
  x: number;
  y: number;
  z: number;
}

export interface PostureData {
  pitch: number;
  roll: number;
}

export interface MonitorData {
  joint_angle: number[];
  joint_speed: number[];
  end_effector: EndEffectorData;
  posture: PostureData;
  fps: number;
  robot_status: 'stop' | 'running' | 'standby';
}

export interface MonitorDataMessage {
  type: 'monitor_data';
  timestamp: string;
  data: MonitorData;
  status: 'success' | 'error';
}

export type CommandType = 'move_forward' | 'move_back' | 'turn_left' | 'turn_right' | 
  'grab' | 'release' | 'start_sim' | 'pause_sim' | 'stop_sim' | 'adjust_param' |
  'arm_joint1_up' | 'arm_joint1_down' | 'arm_joint2_up' | 'arm_joint2_down' | 
  'arm_joint3_up' | 'arm_joint3_down' | 'arm_joint4_up' | 'arm_joint4_down' |
  'arm_joint5_up' | 'arm_joint5_down' | 'arm_joint6_up' | 'arm_joint6_down';

export interface ControlParam {
  speed?: number;
  force?: number;
  joint?: number;
  angle?: number;
}

export interface ControlCommand {
  type: 'control_cmd';
  timestamp: string;
  cmd_type: CommandType;
  param: ControlParam;
  source: 'manual' | 'voice';
  request_id: string;
}

export interface CommandResponse {
  type: 'cmd_response';
  request_id: string;
  result: 'success' | 'fail';
  msg: string;
  timestamp: string;
}

export type Message = MonitorDataMessage | ControlCommand | CommandResponse;

export interface RobotStatus {
  mode: 'stop' | 'running' | 'standby';
  sim_status: 'started' | 'paused' | 'stopped';
  sim_time: string;
  connected: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'manual' | 'voice' | 'system';
  content: string;
  result?: 'success' | 'fail';
  canRetry?: boolean;
  command?: ControlCommand;
}

export interface VoiceCommand {
  command: CommandType;
  param?: ControlParam;
}
