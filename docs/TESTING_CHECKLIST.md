# Testing Checklist

## Functional
- [ ] Landing page loads.
- [ ] Auth0 login works in production.
- [ ] Logout works.
- [ ] Protected routes redirect unauthenticated users.
- [ ] Plan Trip form validates required fields.
- [ ] Buddy filters update matching cards.
- [ ] Request Match opens confirmation UI.
- [ ] Leave Match restores the match list.
- [ ] Gemini success response renders.
- [ ] Gemini fallback response renders without API key.
- [ ] ElevenLabs audio plays or fallback audio plays.
- [ ] Safety Hub is accessible from every primary screen.
- [ ] Community Pulse chart renders with fallback data.
- [ ] Dark theme renders correctly on every screen.
- [ ] Light theme renders correctly on every screen.
- [ ] Theme choice survives a reload; "System" follows the OS setting.
- [ ] Mobile layout works at 390px width.
- [ ] Desktop layout works at 1440px width.

## Safety and privacy
- [ ] No precise address is shown.
- [ ] No exact GPS coordinate is shown.
- [ ] All buddy cards use aliases.
- [ ] Urgent copy tells the user to call 911.
- [ ] App never claims to contact emergency services.
- [ ] Audio is not framed as police or dispatch.
- [ ] Report/block/leave options are present.

## Submission evidence
- [ ] Screenshot of Auth0 login.
- [ ] Screenshot of Virtual Buddy flow.
- [ ] Screenshot of Gemini Calm Coach.
- [ ] Screenshot of ElevenLabs audio card.
- [ ] Screenshot of Tiger Data Community Pulse, if used.
- [ ] Live deployment works on a phone.
- [ ] README includes setup and technology list.
