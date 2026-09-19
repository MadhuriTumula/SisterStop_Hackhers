# Sponsor Track Plan

## Primary Track: DevelopHER
SisterStop supports women working nontraditional hours through peer connection, safety-oriented design, and mental well-being tools.

## Google Gemini API
Feature: Calm Coach
Input:
- Station area
- Route
- Delay context
- User-selected feeling
- User-selected support preference

Output:
- Short support message
- Grounding prompt
- Suggested in-app action
- Urgent escalation flag
- Safety notice

Evidence for submission:
- Screenshot of Calm Coach screen
- Screen recording of Gemini response
- GitHub code reference to /api/gemini
- Devpost explanation of structured JSON response

## ElevenLabs
Feature: Comfort Audio Suite — the voice for everything Gemini writes
Audio modes:
- Live companion call: speaks a line Gemini wrote for tonight's trip
- Read aloud: speaks the Calm Coach reply
- Friendly check-in (reviewed script)
- Cover-call style comfort audio (reviewed script)
- Guided grounding exercise (reviewed script)

The Gemini -> guardrail -> ElevenLabs chain is the strongest single demo beat:
one trip context produces personalised words and a voice, with a server-side
check that refuses impersonation.

Evidence:
- Screenshot with audio tool
- Video of audio playback
- Code reference to /api/elevenlabs or generated audio assets
- Devpost explanation

## Auth0
Feature: Secure sign-in and protected user space
Use:
- Universal Login
- Protected routes
- Alias profile separation from authentication identity

Evidence:
- Login screenshot
- Auth0 dashboard screenshot if permitted
- Protected route demo
- Code reference to Auth0Provider and route guards

## Tiger Data
Feature: Community Pulse
Data:
- Anonymous check-in events
- Mood score
- Support type selected
- Route and station zone
- Timestamp

Evidence:
- Dashboard screenshot
- SQL schema showing hypertable or time-series setup
- Query or aggregate used for chart
- Deployed dashboard data

## .Tech Domain
Feature:
- Deploy the landing page using a .tech domain if acquired.
- Place the live project URL in Devpost.
- Include the domain in your pitch deck.

## Do not prioritize
- Solana: not core to the user benefit and introduces unnecessary privacy and wallet complexity.
- Presage: only attempt if the SDK works quickly and user consent is explicit.
- Backboard: optional for persistent AI preference memory, but not needed for the MVP.
