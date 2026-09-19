# Data Model

## BuddyProfile
Represents a privacy-safe demo profile.

Fields:
- id
- alias
- pronouns
- verified
- avatarInitials
- route
- originStationZone
- destinationZone
- departureWindow
- matchType
- interests
- supportPreference
- status

## TripRequest
Represents the signed-in user's desired commute support.

Fields:
- originStation
- route
- departureTime
- departureWindow
- destinationZone
- matchType
- comfortPreference

## Match
Represents a mutually accepted demo companion match.

Fields:
- id
- userId
- buddyId
- overlapSummary
- meetingArea
- status
- createdAt

## CommunityCheckin
Anonymous aggregate event only.

Fields:
- id
- route
- stationZone
- supportType
- moodScore
- timestamp

## Privacy rule
No model includes legal names, exact addresses, real phone numbers, or exact live location.
