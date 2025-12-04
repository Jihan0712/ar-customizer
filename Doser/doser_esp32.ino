/*
Automated Nutrient Dosing System for Phytoplankton Aquariums
ESP32 (Arduino framework)

Placeholder function getPHLevel() returns a dummy value.
Non-blocking loop using millis().
2 aquarium selection via SPDT switch.
Optional acid-source switch (or set acidIsCitricManual).
4 dosing pumps and 2 solenoids controlled via MOSFETs.
Pins at top can be changed to match your wiring.
*/

// ====== Pin Definitions (change as needed) ======
// Inputs
const int PIN_TANK_SWITCH = 34; // SPDT switch: LOW = Tank 1, HIGH = Tank 2 (input-only pin)
const int PIN_ACID_SWITCH = 35; // Optional: HIGH = Citric, LOW = NPK (input-only pin)

// Pumps (MOSFET gates)
const int PIN_PUMP_NPK1 = 18; // Pump 1: NPK1 (Tank 1)
const int PIN_PUMP_NPK2 = 19; // Pump 2: NPK2 (Tank 2)
const int PIN_PUMP_BASE = 21; // Pump 3: Baking Soda (Base)
const int PIN_PUMP_CITRIC = 22; // Pump 4: Citric Acid (shared)

// Solenoids
const int PIN_SOLENOID_1 = 23; // Routes to Aquarium 1
const int PIN_SOLENOID_2 = 5; // Routes to Aquarium 2

// ====== Dosing Parameters ======
const float TARGET_PH = 7.0;
const unsigned long DOSING_DURATION_MS = 2000; // 2 seconds dosing
const unsigned long REACTION_TIME_MS = 10000; // 10 seconds wait for reaction

// ====== Debounce for tank switch (non-blocking) ======
unsigned long lastTankDebounceTime = 0;
const unsigned long TANK_DEBOUNCE_MS = 50;
int lastTankReading = HIGH; // assume pull-up
int stableTankState = HIGH;

// If you don't wire PIN_ACID_SWITCH, set this manual variable
// true => use Citric Acid pump; false => use NPK pump for the selected tank
bool acidIsCitricManual = false;

// ====== Runtime state ======
enum SystemState {IDLE, DOSING, REACTION_WAIT};
SystemState systemState = IDLE;

unsigned long dosingStartTime = 0;
unsigned long reactionStartTime = 0;

// which pump is active while DOSING (pin number), 0 == none
int activePumpPin = 0;

// Helper: ensure all pumps off
void allPumpsOff() {
digitalWrite(PIN_PUMP_NPK1, LOW);
digitalWrite(PIN_PUMP_NPK2, LOW);
digitalWrite(PIN_PUMP_BASE, LOW);
digitalWrite(PIN_PUMP_CITRIC, LOW);
activePumpPin = 0;
}

// Placeholder pH function - return a dummy float value
// Replace this with actual Tuya 8-in-1 sensor read or MQTT/API logic later.
float getPHLevel() {
// Simple fixed dummy value. Change to test different branches.
// Example: return 6.8; // forces base dosing
// Example: return 7.2; // forces acid dosing
return 7.0;
}

// Read tank selector with non-blocking debounce
bool readTankSelector() {
int reading = digitalRead(PIN_TANK_SWITCH);
if (reading != lastTankReading) {
lastTankDebounceTime = millis();
}

if ((millis() - lastTankDebounceTime) > TANK_DEBOUNCE_MS) {
if (reading != stableTankState) {
stableTankState = reading;
}
}

lastTankReading = reading;
// stableTankState: LOW = Tank1, HIGH = Tank2
return (stableTankState == HIGH);
}

// Returns whether acid-source switch indicates Citric Acid
bool readAcidSource() {
// If physically wired, read the pin; otherwise use manual variable
if (PIN_ACID_SWITCH >= 0) {
int v = digitalRead(PIN_ACID_SWITCH);
return (v == HIGH);
}
return acidIsCitricManual;
}

void setup() {
Serial.begin(115200);
delay(50);

// Inputs
pinMode(PIN_TANK_SWITCH, INPUT_PULLUP); // using pullup assumes switch connects to GND for Tank1
pinMode(PIN_ACID_SWITCH, INPUT_PULLUP);

// Outputs (pumps & solenoids) - start off
pinMode(PIN_PUMP_NPK1, OUTPUT);
pinMode(PIN_PUMP_NPK2, OUTPUT);
pinMode(PIN_PUMP_BASE, OUTPUT);
pinMode(PIN_PUMP_CITRIC, OUTPUT);
pinMode(PIN_SOLENOID_1, OUTPUT);
pinMode(PIN_SOLENOID_2, OUTPUT);

allPumpsOff();
digitalWrite(PIN_SOLENOID_1, LOW);
digitalWrite(PIN_SOLENOID_2, LOW);

Serial.println("Doser system initialized.");
}

void startDosing(int pumpPin) {
allPumpsOff();
if (pumpPin != 0) {
digitalWrite(pumpPin, HIGH);
activePumpPin = pumpPin;
dosingStartTime = millis();
systemState = DOSING;
Serial.printf("Starting dosing: pin %d for %lums\n", pumpPin, DOSING_DURATION_MS);
}
}

void stopDosingAndStartReactionWait() {
if (activePumpPin != 0) {
digitalWrite(activePumpPin, LOW);
Serial.printf("Stopped pump %d, entering reaction wait %lums\n", activePumpPin, REACTION_TIME_MS);
activePumpPin = 0;
}
reactionStartTime = millis();
systemState = REACTION_WAIT;
}

void loop() {
// 1) Read current selected tank (non-blocking debounce)
bool tank2Selected = readTankSelector();

// 2) Route solenoid: ensure only one open at a time
if (tank2Selected) {
digitalWrite(PIN_SOLENOID_1, LOW);
digitalWrite(PIN_SOLENOID_2, HIGH);
} else {
digitalWrite(PIN_SOLENOID_1, HIGH);
digitalWrite(PIN_SOLENOID_2, LOW);
}

// 3) Read pH (placeholder)
float ph = getPHLevel();

// 4) Read acid source preference
bool useCitric = readAcidSource();

// Debug: print status occasionally (every loop could be noisy; reduce by small delay if desired)
Serial.printf("Selected tank: %s | pH: %.2f | AcidSource: %s\n",
tank2Selected ? "Tank 2" : "Tank 1",
ph,
useCitric ? "Citric" : "NPK");

// 5) State machine handling (non-blocking)
switch (systemState) {
case IDLE: {
// Ensure pumps are off
allPumpsOff();

}

// Keep loop responsive (tiny yield)
delay(10);
}