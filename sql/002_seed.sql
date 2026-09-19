-- Seed data so the Community Pulse dashboard has a story on demo day.

INSERT INTO community_checkins
(route, station_zone, support_type, mood_score, created_at)
VALUES
('Red Line', 'North Avenue Station', 'buddy_match', 3, NOW() - INTERVAL '5 hours'),
('Red Line', 'North Avenue Station', 'grounding', 2, NOW() - INTERVAL '4 hours 40 minutes'),
('Gold Line', 'Midtown Station', 'audio_support', 3, NOW() - INTERVAL '4 hours 20 minutes'),
('Blue Line', 'Georgia State Station', 'arrival_checkin', 4, NOW() - INTERVAL '4 hours'),
('Red Line', 'Five Points Station', 'buddy_match', 2, NOW() - INTERVAL '3 hours 30 minutes'),
('Green Line', 'Vine City Station', 'grounding', 3, NOW() - INTERVAL '3 hours 10 minutes'),
('Gold Line', 'Midtown Station', 'grounding', 3, NOW() - INTERVAL '2 hours 50 minutes'),
('Bus Route 40', 'Five Points Station', 'audio_support', 2, NOW() - INTERVAL '2 hours 20 minutes'),
('Red Line', 'Lindbergh Center Station', 'arrival_checkin', 4, NOW() - INTERVAL '2 hours'),
('Blue Line', 'Decatur Station', 'buddy_match', 3, NOW() - INTERVAL '1 hour 40 minutes'),
('Red Line', 'North Avenue Station', 'buddy_match', 4, NOW() - INTERVAL '1 hour 10 minutes'),
('Bus Route 12', 'Midtown Station', 'audio_support', 3, NOW() - INTERVAL '45 minutes'),
('Red Line', 'Five Points Station', 'grounding', 2, NOW() - INTERVAL '25 minutes'),
('Gold Line', 'Airport Station', 'arrival_checkin', 4, NOW() - INTERVAL '10 minutes');
