# 🔐 Smart Door Lock System Using Face Recognition

A smart security system that uses facial recognition to authenticate users and automatically unlock a door. The project combines Computer Vision, Embedded Systems, IoT, and Web Development to provide a secure and intelligent access control solution.

---

## 📌 Project Overview

This system captures a user's face through a camera, verifies their identity using facial recognition, and unlocks the door if authentication is successful. Every access attempt is recorded and displayed on a web dashboard for monitoring and management.

---

## 🚀 Features

- Face Recognition Based Authentication
- Automatic Door Unlocking
- Real-Time Access Logging
- Web Dashboard for Monitoring
- Secure User Verification
- Unauthorized Access Detection
- Hardware and Software Integration

---

## 🛠 Technologies Used

### Software
- Python
- OpenCV
- DeepFace
- Serial Communication (PySerial)
- Next.js
- PostgreSQL
- JavaScript / TypeScript

### Hardware
- ESP32-CAM
- Arduino
- Relay Module
- Solenoid Door Lock
- 12V Power Supply
- Breadboard and Jumper Wires

---

## ⚙️ System Architecture

```text
Camera
   │
   ▼
Face Detection & Recognition (Python)
   │
   ▼
User Verified?
   │
 ┌─┴─────────────┐
 │               │
Yes             No
 │               │
 ▼               ▼
Send Signal    Access Denied
to Arduino
 │
 ▼
Relay Activated
 │
 ▼
Door Unlocks
 │
 ▼
Access Details Stored
 │
 ▼
Displayed on Website Dashboard
```

---

## 📂 Project Structure

```text
Smart-Door-Lock-System
│
├── Arduino/
│   └── door_lock.ino
│
├── FaceRecognition/
│   ├── face_recognition.py
│   └── requirements.txt
│
├── Website/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── Images/
│
├── docs/
│
└── README.md
```

---

## 🔄 Workflow

1. User stands in front of the camera.
2. Camera captures the face.
3. Python processes the image using DeepFace.
4. Face is matched against the authorized database.
5. If verified:
   - Signal is sent to Arduino.
   - Arduino activates relay.
   - Solenoid lock opens.
6. Access details are stored in the database.
7. Website dashboard updates with the latest access record.

---

## 🔧 Installation

### Clone Repository

```bash
git clone https://github.com/your-username/smart-door-lock-system.git
cd smart-door-lock-system
```

### Python Setup

```bash
pip install -r requirements.txt
```

### Run Face Recognition

```bash
python face_recognition.py
```

### Website Setup

```bash
npm install
npm run dev
```

### Arduino

int relay = 3;
int redLed = 8;
int greenLed = 9;
unsigned long lastTrueTime = 0;
const unsigned long timeout = 5000;

String buffer = "";

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(relay, OUTPUT);
  pinMode(redLed, OUTPUT);
  pinMode(greenLed, OUTPUT);

  digitalWrite(relay, HIGH);
  digitalWrite(redLed, HIGH);
  digitalWrite(greenLed, LOW);
  
}

void loop() {

  while (Serial.available()) {
    char c = Serial.read();

    if (c == '\n') {

      buffer.trim();

      if (buffer == "true") {

        lastTrueTime = millis();
        digitalWrite(redLed, LOW);
        digitalWrite(greenLed, HIGH);
        digitalWrite(relay, LOW);

        digitalWrite(LED_BUILTIN, HIGH);
        delay(250);
        digitalWrite(LED_BUILTIN, LOW);
      }

      buffer = "";
    }
    else {
      buffer += c;
    }
  }

  if (millis() - lastTrueTime > timeout) {
    digitalWrite(relay, HIGH);
    digitalWrite(redLed, HIGH);
    digitalWrite(greenLed, LOW);
  }
}
---

## 🎯 Applications

- Smart Homes
- Hostel Room Security
- Office Access Control
- College Laboratories
- Restricted Areas

---

## 🔒 Security Features

- Facial Authentication
- Access Logging
- Unauthorized Access Detection
- Real-Time Monitoring

---

## 🔮 Future Improvements

- Mobile Application
- Cloud Database Integration
- Multiple User Roles
- Email/SMS Alerts
- Fingerprint Backup Authentication
- AI-Based Intruder Detection

---

## 👨‍💻 Author

**Anubhav Arya**

Computer Science Engineering Student

Interested in:
- Artificial Intelligence
- IoT Systems
- Embedded Systems
- Computer Vision
- Robotics

---

## ⭐ If you like this project

Give this repository a star and feel free to contribute.