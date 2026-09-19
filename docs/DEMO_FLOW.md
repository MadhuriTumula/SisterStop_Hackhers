# Demo Flow

## Demo duration
60 to 90 seconds.

## Demo user
Maya is a healthcare worker leaving a late shift.

## Scenario
Maya is traveling from North Avenue Station on the Red Line. Her train is delayed. She feels uneasy waiting alone and wants a quiet check-in companion.

## Demo sequence
1. Open MARTA MATE landing page.
2. Sign in securely with Auth0.
3. Plan trip: North Avenue, Red Line, 10:15 PM, same-car buddy.
4. Show matching Virtual Buddy cards.
5. Match with Maya's compatible buddy.
6. Explain privacy: alias, route area, broad time window, no exact destination.
7. Trigger "I feel uneasy during a delay."
8. Show Gemini Calm Coach response.
9. Play ElevenLabs grounding or friendly check-in audio.
10. Open Safety Hub and show official-resource routing.
11. End with arrival check-in and Community Pulse impact visualization.

## Narration
"MARTA MATE does not replace emergency services or MARTA's official safety tools. It creates a privacy-conscious support layer: connection, calm, and clear options during stressful commutes."

## Click path for the recording
```text
/  ->  Continue securely (or Preview demo)
/plan   -> keep the seeded defaults -> Find my Virtual Buddies
/buddies -> Request match on Maya
/match/buddy-maya -> Start a check-in -> Open Calm Mode
/calm   -> pick "Uneasy" -> Get support -> play Guided grounding audio
/safety -> show official options
/match/buddy-maya -> "I arrived safely"
/pulse  -> Community Pulse chart
```
