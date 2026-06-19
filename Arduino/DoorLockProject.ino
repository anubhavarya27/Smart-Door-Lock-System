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