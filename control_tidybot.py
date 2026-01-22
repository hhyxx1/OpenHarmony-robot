
import mujoco
import mujoco.viewer
import time
import math
import select
import sys
import tty
import termios
import numpy as np

# --- TidyBot & Kinova Gen3 Control Script (Excavator Style) ---

# Configuration
MOVESPEED_BASE = 0.25   # Increased from 0.08
ROT_SPEED_BASE = 0.3    # Increased from 0.1
JOINT_SPEED = 0.15      # Increased from 0.05
GRIPPER_SPEED = 50      # Increased from 20

# Key Mappings
# Base Control (WASD + QE)
KEY_FORWARD   = 'w'
KEY_BACKWARD  = 's'
KEY_LEFT      = 'a'
KEY_RIGHT     = 'd'
KEY_ROT_LEFT  = 'q'
KEY_ROT_RIGHT = 'e'

# Arm - Swing (Joint 1 - Base Yaw)
KEY_SWING_LEFT  = 'j'
KEY_SWING_RIGHT = 'l'

# Arm - Boom (Joint 2 - Shoulder Pitch) --> Main Lift
KEY_BOOM_UP   = 'i'
KEY_BOOM_DOWN = 'k'

# Arm - Stick (Joint 4 - Elbow Pitch) --> Reach
KEY_STICK_OUT = 'u'
KEY_STICK_IN  = 'o'

# Arm - Bucket (Joint 6 - Wrist Pitch) --> Fine Tilt
KEY_BUCKET_IN  = 'y'
KEY_BUCKET_OUT = 'h'

# Arm - Wrist Rotate (Joint 7) --> 90 Degree Steps
KEY_WRIST_CCW = 'z' # Rotate -90
KEY_WRIST_CW  = 'x' # Rotate +90

# Gripper
KEY_GRIP_OPEN  = 'r'
KEY_GRIP_CLOSE = 'f'

KEY_STOP = ' '
KEY_QUIT = '\x1b'

def is_data():
    return select.select([sys.stdin], [], [], 0) == ([sys.stdin], [], [])

def get_key():
    if is_data():
        return sys.stdin.read(1)
    return None

def main():
    model_path = "Lab.xml"
    print(f"Loading model: {model_path}")
    
    try:
        model = mujoco.MjModel.from_xml_path(model_path)
        data = mujoco.MjData(model)
    except Exception as e:
        print(f"Failed to load model: {e}")
        return

    # --- ID Lookup ---
    try:
        # Base Actuators
        id_base_x  = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_ACTUATOR, "tidybot_joint_x")
        id_base_y  = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_ACTUATOR, "tidybot_joint_y")
        id_base_th = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_ACTUATOR, "tidybot_joint_th")
        
        # Arm Actuators (joint_1 to joint_7)
        arm_actuators = [mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_ACTUATOR, f"joint_{i}") for i in range(1, 8)]
        
        # Gripper Actuator
        id_gripper = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_ACTUATOR, "fingers_actuator")
        
        # Joint Address Lookup (for reading current state)
        id_joint_base_x = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_JOINT, "tidybot_joint_x")
        id_joint_base_y = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_JOINT, "tidybot_joint_y")
        id_joint_base_th = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_JOINT, "tidybot_joint_th")
        
        adr_base_x = model.jnt_qposadr[id_joint_base_x]
        adr_base_y = model.jnt_qposadr[id_joint_base_y]
        adr_base_th = model.jnt_qposadr[id_joint_base_th]
        
        arm_qpos_adrs = [model.jnt_qposadr[mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_JOINT, f"joint_{i}")] for i in range(1, 8)]

    except Exception as e:
        print(f"Initialization Error: {e}")
        print("Ensure Lab.xml has actuators: tidybot_joint_x/y/th, joint_1..7, fingers_actuator")
        return

    # --- Simulation Init ---
    mujoco.mj_forward(model, data)
    
    # Target Values (Initialized to current pose)
    tgt_base_x = data.qpos[adr_base_x]
    tgt_base_y = data.qpos[adr_base_y]
    tgt_base_th = data.qpos[adr_base_th]
    
    tgt_arm = [data.qpos[adr] for adr in arm_qpos_adrs]
    tgt_gripper = 0.0

    print("\n" + "="*40)
    print("      TidyBot Excavator Control")
    print("="*40)
    print(" [Base Moves]")
    print(f"   {KEY_FORWARD}/{KEY_BACKWARD}   : Forward / Backward")
    print(f"   {KEY_LEFT}/{KEY_RIGHT}   : Left / Right (Strafing)")
    print(f"   {KEY_ROT_LEFT}/{KEY_ROT_RIGHT}   : Rotate Base Left/Right")
    print("-" * 40)
    print(" [Arm - Excavator Mode]")
    print(f"   {KEY_SWING_LEFT}/{KEY_SWING_RIGHT}   : Spin Arm Left/Right (Swing)")
    print(f"   {KEY_BOOM_UP}/{KEY_BOOM_DOWN}   : Lift Boom Up/Down   (Height)")
    print(f"   {KEY_STICK_OUT}/{KEY_STICK_IN}   : Stick Out/In        (Reach)")
    print(f"   {KEY_BUCKET_IN}/{KEY_BUCKET_OUT}   : Wrist Curl          (Bucket)")
    print("-" * 40)
    print(" [Tools]")
    print(f"   {KEY_WRIST_CCW}/{KEY_WRIST_CW}   : Wrist Rotate 90 deg")
    print(f"   {KEY_GRIP_OPEN}/{KEY_GRIP_CLOSE}   : Gripper Open / Close")
    print("="*40)
    print(" Press SPACE to brake, ESC to quit.")

    # Terminal Setup
    old_settings = termios.tcgetattr(sys.stdin)
    tty.setcbreak(sys.stdin.fileno())

    try:
        with mujoco.viewer.launch_passive(model, data) as viewer:
            # --- Camera Setup ---
            # Set camera to track the robot body
            base_body_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_BODY, "tidybot_base")
            if base_body_id != -1:
                viewer.cam.type = mujoco.mjtCamera.mjCAMERA_TRACKING
                viewer.cam.trackbodyid = base_body_id
                viewer.cam.distance = 5.0
                viewer.cam.elevation = -30
                viewer.cam.azimuth = 90
            
            while viewer.is_running():
                step_start = time.time()
                
                # --- Input Handling ---
                key = get_key()
                if key == KEY_QUIT:
                    break
                
                # Base Logic (Holonomic + Rotation)
                # Controls are robot-centric: W moves robot forward relative to its current angle.
                # Need to convert robot-centric velocities to global map updates.
                
                robot_dx, robot_dy, robot_dth = 0, 0, 0
                
                if key == KEY_FORWARD:  robot_dy = MOVESPEED_BASE
                if key == KEY_BACKWARD: robot_dy = -MOVESPEED_BASE
                if key == KEY_LEFT:     robot_dx = -MOVESPEED_BASE
                if key == KEY_RIGHT:    robot_dx = MOVESPEED_BASE
                if key == KEY_ROT_LEFT: robot_dth = ROT_SPEED_BASE
                if key == KEY_ROT_RIGHT:robot_dth = -ROT_SPEED_BASE

                # Apply Robot -> World Transform
                # Current global heading
                current_th = data.qpos[adr_base_th] # Actually we should use the target for smooth control, or current for realistic skidding? 
                # Using target ensures "fly-by-wire" feel. Using current feels more physics-y.
                # Let's use current for the transform matrix.
                c = math.cos(current_th)
                s = math.sin(current_th)
                
                # TidyBot Orientation Definition:
                # If Joint Y is Forward, and Joint X is Right
                # Rot matrix:
                # x_global = x_local * c - y_local * s
                # y_global = x_local * s + y_local * c
                # Check W key (dy+) -> moves +Y local.
                # If th=0: xg = -yl*0 -> 0. yg = yl. Moves +Y global. Correct.
                
                world_dx = robot_dx * c - robot_dy * s
                world_dy = robot_dx * s + robot_dy * c
                
                tgt_base_x += world_dx
                tgt_base_y += world_dy
                tgt_base_th += robot_dth

                # Arm Logic
                # J1: Swing
                if key == KEY_SWING_LEFT:  tgt_arm[0] += JOINT_SPEED
                if key == KEY_SWING_RIGHT: tgt_arm[0] -= JOINT_SPEED
                
                # J2: Boom (Main Lift)
                # Range is approx -2.2 to 2.2.
                # Up usually means negative joint angle? Or positive?
                # Check initial pose: 0 is upright? Or flat? default qpos is 0. 
                # Let's assume standard direction visually.
                if key == KEY_BOOM_UP:   tgt_arm[1] += JOINT_SPEED # Try + for up
                if key == KEY_BOOM_DOWN: tgt_arm[1] -= JOINT_SPEED
                
                # J4: Stick (Reach)
                # Bending elbow often requires moving J4.
                if key == KEY_STICK_OUT: tgt_arm[3] += JOINT_SPEED # J4 is index 3
                if key == KEY_STICK_IN:  tgt_arm[3] -= JOINT_SPEED
                
                # J6: Bucket (Wrist Pitch)
                if key == KEY_BUCKET_IN:  tgt_arm[5] += JOINT_SPEED # J6 is index 5
                if key == KEY_BUCKET_OUT: tgt_arm[5] -= JOINT_SPEED
                
                # J7: Wrist Rotate (90 deg steps)
                # Snap to nearest 90 (pi/2)
                if key == KEY_WRIST_CCW or key == KEY_WRIST_CW:
                    step = math.pi / 2
                    curr = tgt_arm[6]
                    if key == KEY_WRIST_CW:
                        tgt_arm[6] = round((curr - step) / step) * step
                    else:
                        tgt_arm[6] = round((curr + step) / step) * step

                # Gripper
                if key == KEY_GRIP_OPEN:  tgt_gripper = 0
                if key == KEY_GRIP_CLOSE: tgt_gripper = 255
                
                if key == KEY_STOP:
                    # Halt base targets to current
                    tgt_base_x = data.qpos[adr_base_x]
                    tgt_base_y = data.qpos[adr_base_y]
                    tgt_base_th = data.qpos[adr_base_th]

                # --- Apply Controls ---
                data.ctrl[id_base_x]  = tgt_base_x
                data.ctrl[id_base_y]  = tgt_base_y
                data.ctrl[id_base_th] = tgt_base_th
                
                for i, uid in enumerate(arm_actuators):
                    data.ctrl[uid] = tgt_arm[i]
                
                data.ctrl[id_gripper] = tgt_gripper

                # Physics Step
                mujoco.mj_step(model, data)
                viewer.sync()

                # Timing
                time_until_next_step = model.opt.timestep - (time.time() - step_start)
                if time_until_next_step > 0:
                    time.sleep(time_until_next_step)

    finally:
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, old_settings)
        print("Control Terminated.")

if __name__ == "__main__":
    main()
