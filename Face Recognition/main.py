import cv2
import time
import threading
import requests
from collections import deque
from deepface import DeepFace
import serial


REFERENCE_IMG    = "face.jpeg"  
API_URL          = "http://localhost:3000/api/device/cmneri5zw0000kxtgvnf6sko7/9c352023-118e-4ec2-b332-e42df89be967"  
DISPLAY_FPS      = 30
MODEL_NAME       = "ArcFace"          # ArcFace >> VGG-Face for accuracy
THRESHOLD        = 0.45                # lower = stricter match (0.3–0.5)
PERSISTENCE_FRAMES = 8               # frames to keep box alive after face lost


ser = serial.Serial("COM8", 9600)

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

frame_lock  = threading.Lock()
result_lock = threading.Lock()

latest_frame        = None
face_results        = {}   
persistence_counter = {}
running             = True
FRAME_TIME          = 1.0 / DISPLAY_FPS



def capture_thread(cap):
    global latest_frame, running
    while running:
        ret, frame = cap.read()
        if not ret:
            running = False
            break
        with frame_lock:
            latest_frame = frame



def detection_thread():
    global face_results, persistence_counter, running

    while running:
        with frame_lock:
            if latest_frame is None:
                continue
            frame = latest_frame.copy()

        small = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
        gray  = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=4,
            minSize=(60, 60),
        )

        new_results = {}
        for i, (x, y, w, h) in enumerate(faces):
            face_crop = small[y:y + h, x:x + w]
            try:
                result = DeepFace.verify(
                    face_crop,
                    REFERENCE_IMG,
                    model_name=MODEL_NAME,
                    threshold=THRESHOLD,
                    enforce_detection=False,
                )
                match = result["verified"]
            except Exception:
                match = False

            new_results[i] = {
                "bbox":  (x * 2, y * 2, w * 2, h * 2),
                "match": match,
            }

        # Merge: keep boxes alive for PERSISTENCE_FRAMES after disappearing
        with result_lock:
            updated = {}

            for fid, info in new_results.items():
                updated[fid] = info
                persistence_counter[fid] = 0

            for fid, info in face_results.items():
                if fid not in new_results:
                    age = persistence_counter.get(fid, 0) + 1
                    if age <= PERSISTENCE_FRAMES:
                        updated[fid] = info
                        persistence_counter[fid] = age

            face_results = updated



DEBOUNCE = {
    "accepted": 1.5,   # seconds state must hold before POSTing
    "rejected": 1.5,
}

def api_thread():
    global running, ser
    last_sent_state   = None   # last state we actually POSTed
    pending_state     = None   # state we're waiting to confirm
    pending_since     = None   # when we first saw that pending state
    last_msg_sent_time = None
    while running:
        time.sleep(0.1)        # check 10× per second for responsiveness

        with result_lock:
            face_present = len(face_results) > 0
            matched      = face_present and any(
                r["match"] for r in face_results.values()
            )

        # ── No face visible → full reset ───────────────
        if not face_present:
            last_sent_state = None
            pending_state   = None
            pending_since   = None
            continue

        current_state = "accepted" if matched else "rejected"

        # ── State changed → restart debounce timer ─────
        if current_state != pending_state:
            pending_state = current_state
            pending_since = time.time()
            continue

        # ── Same state — check if debounce has elapsed ─
        held_for = time.time() - pending_since
        required = DEBOUNCE[pending_state]

        

        if held_for >= required and pending_state != last_sent_state:
            try:
                response = requests.post(
                    API_URL,
                    json={
                        "status":    pending_state == "accepted",
                        "timestamp": time.time(),
                    },
                    timeout=2,
                )
                print(f"POST → {pending_state}  (HTTP {response.status_code})")

                # Also send to Arduino if needed
                # ser.write(f"{pending_state}\n".encode())

            except requests.exceptions.RequestException as e:
                print(f"API error: {e}")

            last_sent_state = pending_state

        if held_for >= required and pending_state == "accepted" and (not last_msg_sent_time or time.time() - last_msg_sent_time >= 0.48):
            try:
                ser.write("true\n".encode())
                last_msg_sent_time = time.time()
            except:
                print("Not sent to arduino")
                ser = serial.Serial("COM8", 9600)
        


def main():
    global running

    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # always decode freshest frame

    print("Starting face recognition...")
    print(f"Model: {MODEL_NAME}  |  Threshold: {THRESHOLD}  |  API: {API_URL}")

    t_capture   = threading.Thread(target=capture_thread,   args=(cap,), daemon=True)
    t_detection = threading.Thread(target=detection_thread,              daemon=True)
    t_api       = threading.Thread(target=api_thread,                    daemon=True)

    t_capture.start()
    t_detection.start()
    t_api.start()

    fps_samples = deque(maxlen=30)
    prev_time   = time.time()

    while running:
        loop_start = time.time()

        # Grab latest frame
        with frame_lock:
            if latest_frame is None:
                time.sleep(0.005)
                continue
            display = latest_frame.copy()

        # Overlay bounding boxes + labels
        with result_lock:
            snapshot = dict(face_results)

        for info in snapshot.values():
            x, y, w, h = info["bbox"]
            match  = info["match"]
            color  = (0, 255, 0) if match else (0, 0, 255)
            label  = "ACCEPTED"  if match else "REJECTED"
            cv2.rectangle(display, (x, y), (x + w, y + h), color, 2)
            cv2.putText(display, label, (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

        # FPS counter
        now = time.time()
        fps_samples.append(1.0 / max(now - prev_time, 1e-6))
        prev_time = now
        fps = sum(fps_samples) / len(fps_samples)
        cv2.putText(display, f"FPS: {fps:.1f}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)
        cv2.putText(display, f"Model: {MODEL_NAME}", (10, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)

        cv2.imshow("Face Recognition", display)

        # Cap to 30 FPS
        elapsed = time.time() - loop_start
        wait_ms = max(1, int((FRAME_TIME - elapsed) * 1000))
        if cv2.waitKey(wait_ms) & 0xFF == 27:  # ESC to quit
            running = False
            break

    cap.release()
    cv2.destroyAllWindows()
    ser.close()


if __name__ == "__main__":
    main()