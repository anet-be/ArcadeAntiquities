INSERT INTO client (id, email, first_name, last_name)
VALUES ('26f10730-50a4-4915-8fa8-d4d05bd85ad8', 'hussein.ali@student.kdg.be', 'Hussein', 'Ali');

INSERT INTO project (id, description, name, project_code)
VALUES ('26f10730-50a4-4915-8fa8-d4d05bd85a33', 'this is the description', 'ERFGOEDDAG', 'wd34df');

INSERT INTO project_version (id, version_number, project_id)
VALUES ('26f10730-50a4-4915-8fa8-d4d05bd85a33', 1.0, '26f10730-50a4-4915-8fa8-d4d05bd85a33');


INSERT INTO game (id, name)
VALUES (1, 'pac-man'),
       (2, 'space invaders');

INSERT INTO game_version (id, base_game_id, version_name, version_number, version_rules)
VALUES (gen_random_uuid(), 1, 'pac-man', 1.0, 'no rules yet'),
       (gen_random_uuid(), 2, 'space invaders', 1.0, 'no rules yet');

INSERT INTO project_version_game_versions (project_version_id, game_versions_id)
SELECT '26f10730-50a4-4915-8fa8-d4d05bd85a33', id
FROM game_version
WHERE version_name IN
      ('pac-man', 'space invaders');

INSERT INTO project_game_versions (project_id, game_versions_id)
SELECT '26f10730-50a4-4915-8fa8-d4d05bd85a33', id
FROM game_version
WHERE version_name IN ('pac-man', 'space invaders');

INSERT INTO asset (id, file_name, url, asset_type)
VALUES (gen_random_uuid(), 'ghost.png', '/assets/pac-man-base-game/pac-man/version_1/ghost.png', 'IMAGE'),
       (gen_random_uuid(), 'pac0.png', '/assets/pac-man-base-game/pac-man/version_1/pac0.png', 'IMAGE'),
       (gen_random_uuid(), 'pac1.png', '/assets/pac-man-base-game/pac-man/version_1/pac1.png', 'IMAGE'),
       (gen_random_uuid(), 'pac2.png', '/assets/pac-man-base-game/pac-man/version_1/pac2.png', 'IMAGE'),
       (gen_random_uuid(), 'pinkDot.png', '/assets/pac-man-base-game/pac-man/version_1/pinkDot.png', 'IMAGE'),
       (gen_random_uuid(), 'scaredGhost.png', '/assets/pac-man-base-game/pac-man/version_1/scaredGhost.png', 'IMAGE'),
       (gen_random_uuid(), 'scaredGhost2.png', '/assets/pac-man-base-game/pac-man/version_1/scaredGhost2.png', 'IMAGE'),
       (gen_random_uuid(), 'wall.png', '/assets/pac-man-base-game/pac-man/version_1/wall.png', 'IMAGE'),
       (gen_random_uuid(), 'yellowDot.png', '/assets/pac-man-base-game/pac-man/version_1/yellowDot.png', 'IMAGE'),
       (gen_random_uuid(), 'eat_ghost.wav', '/assets/pac-man-base-game/pac-man/version_1/eat_ghost.wav', 'AUDIO'),
       (gen_random_uuid(), 'gameOver.wav', '/assets/pac-man-base-game/pac-man/version_1/gameOver.wav', 'AUDIO'),
       (gen_random_uuid(), 'gameWin.wav', '/assets/pac-man-base-game/pac-man/version_1/gameWin.wav', 'AUDIO'),
       (gen_random_uuid(), 'power_dot.wav', '/assets/pac-man-base-game/pac-man/version_1/power_dot.wav', 'AUDIO'),
       (gen_random_uuid(), 'waka.wav', '/assets/pac-man-base-game/pac-man/version_1/waka.wav', 'AUDIO'),
       (gen_random_uuid(), 'enemy1.png', '/assets/space_invaders-base-game/space_invaders/version_1/enemy1.png', 'IMAGE'),
       (gen_random_uuid(), 'enemy2.png', '/assets/space_invaders-base-game/space_invaders/version_1/enemy2.png', 'IMAGE'),
       (gen_random_uuid(), 'enemy3.png', '/assets/space_invaders-base-game/space_invaders/version_1/enemy3.png', 'IMAGE'),
       (gen_random_uuid(), 'player.png', '/assets/space_invaders-base-game/space_invaders/version_1/player.png', 'IMAGE'),
       (gen_random_uuid(), 'space.png', '/assets/space_invaders-base-game/space_invaders/version_1/space.png', 'IMAGE'),
       (gen_random_uuid(), 'enemy-death.wav', '/assets/space_invaders-base-game/space_invaders/version_1/enemy-death.wav', 'AUDIO'),
       (gen_random_uuid(), 'shoot.wav', '/assets/space_invaders-base-game/space_invaders/version_1/shoot.wav', 'AUDIO');


INSERT INTO game_assets (game_id, assets_id)
SELECT 1, id
FROM asset
WHERE file_name IN
      ('ghost.png', 'pac0.png', 'pac1.png', 'pac2.png', 'pinkDot.png', 'scaredGhost.png',
       'scaredGhost2.png', 'wall.png', 'yellowDot.png', 'eat_ghost.wav',
       'gameOver.wav', 'gameWin.wav', 'power_dot.wav', 'waka.wav');

INSERT INTO game_assets (game_id, assets_id)
SELECT 2, id
FROM asset
WHERE file_name IN
      ('enemy1.png', 'enemy2.png', 'enemy3.png', 'player.png',
       'space.png', 'enemy-death.wav', 'shoot.wav');

INSERT INTO game_version_assets (game_version_id, assets_id)
SELECT gv.id, a.id
FROM game_version gv
         JOIN game g ON gv.base_game_id = g.id
         JOIN asset a ON g.name = 'pac-man'
WHERE a.file_name IN
      ('ghost.png', 'pac0.png','pac1.png', 'pac2.png', 'pinkDot.png', 'scaredGhost.png',
       'scaredGhost2.png', 'wall.png', 'yellowDot.png', 'eat_ghost.wav',
       'gameOver.wav', 'gameWin.wav', 'power_dot.wav', 'waka.wav');

INSERT INTO game_version_assets (game_version_id, assets_id)
SELECT gv.id, a.id
FROM game_version gv
         JOIN game g ON gv.base_game_id = g.id
         JOIN asset a ON g.name = 'space invaders'
WHERE a.file_name IN
      ('enemy1.png', 'enemy2.png', 'enemy3.png', 'enemy4.jpeg', 'player.png',
       'space.png', 'enemy-death.wav', 'shoot.wav');

