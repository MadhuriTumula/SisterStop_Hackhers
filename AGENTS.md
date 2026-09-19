# MARTA MATE — Agent Instructions

## Product
MARTA MATE is a privacy-conscious safety and well-being companion for adult women and gender-expansive riders commuting during late-night or nontraditional work hours in Atlanta.

Tagline: "Your calm, connected ride home."

The product supports riders through:
1. Virtual Buddies: opt-in peer matching by route, station area, and departure window.
2. Calm Mode: guided grounding exercises, supportive AI responses, and audio tools.
3. Safety Hub: clearly labeled official safety and emergency resources.
4. Community Pulse: optional anonymous aggregate commute check-in analytics.

## Primary users
- Healthcare workers leaving late shifts
- Hospitality and retail workers
- Gig workers
- Students
- Home health aides
- People commuting during early-morning or late-night hours

## Non-negotiable safety principles
- Never guarantee a user's safety.
- Never claim the app contacts emergency services or MARTA Police.
- Never impersonate 911, MARTA Police, security, employers, or real people.
- Never provide medical, legal, mental-health diagnosis, or emergency assessment.
- If a user describes immediate danger, violence, stalking, medical emergency, or being followed, instruct them to call 911 and show the Safety Hub.
- Do not expose exact homes, precise live locations, phone numbers, legal names, or contact details to peer matches.
- Use station zones, route names, and broad departure windows.
- All peer matching is opt-in and uses aliases only.
- Add visible leave, block, and report controls where peer matching appears.
- Present the application as a prototype and support companion, not an emergency response service.

## Build priorities
1. A polished and demoable end-to-end flow is more important than feature count.
2. Use deterministic mock data whenever a live API would risk the demo.
3. Keep all sponsor integrations visible and meaningful in the user flow.
4. Use TypeScript with strict, readable types.
5. Avoid unnecessary dependencies.
6. Keep the code modular, accessible, responsive, and deployable on Vercel.

## Required sponsor technologies
- Google Gemini API: structured Calm Coach response.
- ElevenLabs: voice-based comfort audio or grounding guide.
- Auth0: secure user authentication and protected pages.
- Tiger Data: optional community-pulse time-series analytics, only if fully integrated.

## Core demo journey
Landing -> Auth0 login -> Plan Trip -> Virtual Buddy matches ->
Match confirmation -> Calm Mode -> ElevenLabs audio ->
Safety Hub -> Arrival check-in.

## UI language
Use calm, supportive, non-alarmist language.
Prefer:
- "Support options"
- "Check in with someone you trust"
- "You are in control of what you share"
- "If you are in immediate danger, call 911"

Avoid:
- "Guaranteed safe"
- "We will protect you"
- "Emergency response"
- "Threat detection"
- "We contacted police"

## Before making changes
- Read the relevant docs/ markdown file.
- Preserve the existing build and avoid breaking working flows.
- When adding a feature, create or update its type definitions first.
- Use mock fallbacks if API keys are unavailable.
