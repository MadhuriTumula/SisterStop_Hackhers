# Devpost Draft

## Project title
MARTA MATE — Your calm, connected ride home

## Elevator pitch (under 200 characters)
MARTA MATE connects women on late-night commutes with ride buddies, discreet safety support, and AI-guided tools for calmer, safer trips.

## Inspiration
Women working late shifts often commute when they have fewer transportation options, less predictable transit conditions, and fewer people around them. A delayed train, an unfamiliar station, or an uncomfortable interaction can turn an ordinary ride home into an isolating and stressful experience.

We created MARTA MATE to make late-night commuting feel less lonely and more supported. Rather than replacing emergency services or transit safety systems, MARTA MATE complements them by helping riders connect with peers, access discreet support tools, and regulate stress in the moment.

## What it does
MARTA MATE is a safety and mental-wellness companion for women commuting during nontraditional hours. Users can:

- Find opt-in Virtual Buddies traveling on the same route during a similar time window
- Request a same-car, walk-to-station, or arrival check-in companion
- Use natural-sounding comfort-call and grounding audio when they feel uncomfortable or anxious
- Receive brief, context-aware support from an AI commute companion
- Share trip check-ins with trusted contacts
- Quickly access official safety and emergency options

## How we built it
- **React, Vite, TypeScript, Tailwind CSS** for the responsive web application
- **Auth0** for secure authentication and protected user experiences
- **Google Gemini API** for structured, context-aware commute support
- **ElevenLabs** for natural voice-based grounding guidance and comfort audio
- **Tiger Data / PostgreSQL** for anonymized time-series commute check-ins
- **Vercel** for deployment

## Gemini use
Gemini powers the Commute Calm Coach. The app sends privacy-conscious context — station area, route, delay context, and a user-selected feeling — and receives schema-constrained JSON the UI renders directly: a support message, a grounding prompt, a suggested in-app action, an urgency flag, and a safety notice. Gemini never executes an action; the app decides what a suggestion does.

## ElevenLabs use
ElevenLabs powers three clearly labeled comfort audio modes: a friendly check-in, a supportive call-style clip, and a guided grounding exercise. The audio gives riders a discreet way to feel less isolated without impersonating emergency services or real people.

## Auth0 use
Auth0 Universal Login protects the profile and saved check-in flows, and keeps the rider's authenticated identity separate from the public alias used for matching. A clearly labeled preview mode lets judges explore without creating an account.

## Tiger Data use
Anonymous, time-stamped check-in events are stored in a hypertable and aggregated into 30-minute buckets, powering the Community Pulse dashboard: support demand by route and time block, support-type split, and average self-reported mood. No individual rider, destination, or precise location is ever shown.

## Challenges we ran into
- Designing peer matching without exposing sensitive location information
- Balancing a supportive AI experience with clear safety boundaries
- Avoiding overclaiming what technology can do in stressful or dangerous situations
- Integrating multiple sponsor technologies while keeping the demo flow simple

## Accomplishments we're proud of
- Built an end-to-end commuter journey rather than isolated features
- Made privacy and consent visible in the matching experience
- Connected AI support, human connection, and transit safety resources in one flow
- Every integration degrades gracefully, so the demo works with or without keys

## What we learned
Building for safety requires more than adding an SOS button. It requires careful choices about privacy, language, consent, escalation, and what an app should never promise.

## What's next
- Connect to official transit schedules and service alerts
- Localized station guidance and accessibility routes
- Multilingual support
- Employer partnerships for late-shift workers
- Stronger rider verification and community moderation
- User research with women who commute during nontraditional hours

## Built with
react, typescript, vite, tailwindcss, auth0, google-gemini, elevenlabs, tigerdata, postgresql, vercel

## Challenges we are submitting to
- DevelopHER (main track)
- Best Use of Gemini API
- Best Use of ElevenLabs
- Best Use of Auth0
- Best .Tech Domain Name
- Best Use of Tiger Data (only if the deployed dashboard is live)
