-- Seed data migrated 1:1 from data/manufacturers.ts and data/products.json
-- Generated: 29 products across 17 models.
-- Run this once, right after 001_init.sql, in the Supabase SQL Editor.
-- Not idempotent — running it twice will duplicate every row.

insert into manufacturers (id, name, slug) values
  ('3dab49cc-7636-59d8-be82-fd160151f249', 'Netzsch Nemo', 'netzsch-nemo'),
  ('f381db71-8e2e-53a7-b0d6-70aeb22a9b05', 'Seepex', 'seepex'),
  ('5ac74fa1-6649-5464-9f38-39681ca83240', 'Mono Pumps', 'mono');

insert into series (id, manufacturer_id, name, slug) values
  ('4734fb30-1e7e-5950-af4d-f104f2266297', '3dab49cc-7636-59d8-be82-fd160151f249', 'BY Series', 'by'),
  ('377dba9c-7f8b-5867-8bd8-c296dddf7934', '3dab49cc-7636-59d8-be82-fd160151f249', 'BY Max Series', 'by-max'),
  ('c8ffce52-5404-5e85-b040-8abf9a756837', 'f381db71-8e2e-53a7-b0d6-70aeb22a9b05', 'BW Series', 'bw'),
  ('89f010a4-f0af-5a32-bf50-c6d0ebbe58ec', 'f381db71-8e2e-53a7-b0d6-70aeb22a9b05', 'MD Series', 'md'),
  ('1c78f147-db37-5081-af47-4f759954548f', '5ac74fa1-6649-5464-9f38-39681ca83240', 'Compact Series', 'compact'),
  ('9165c8cf-754f-526b-8a24-1c4c9723192d', '5ac74fa1-6649-5464-9f38-39681ca83240', 'E Range', 'e-range');

insert into models (id, series_id, name) values
  ('855bcf9f-b7b9-53f1-931a-4fa12ca6f549', '4734fb30-1e7e-5950-af4d-f104f2266297', 'NM 015 BY'),
  ('52209421-c09f-5332-9407-f9c0194313da', '4734fb30-1e7e-5950-af4d-f104f2266297', 'NM 031 BY'),
  ('01f1f91b-b9c2-5a75-94ab-6afeaaeaeddb', '4734fb30-1e7e-5950-af4d-f104f2266297', 'NM 045 BY'),
  ('2672f7df-2f99-516e-b596-1106c3877dc5', '377dba9c-7f8b-5867-8bd8-c296dddf7934', 'NM 063 BY Max'),
  ('573201c1-e3b5-5070-917d-d4f328e32749', '377dba9c-7f8b-5867-8bd8-c296dddf7934', 'NM 076 BY Max'),
  ('ed43f94b-f408-55ee-81ae-1a3f3dc6e07f', '377dba9c-7f8b-5867-8bd8-c296dddf7934', 'NM 090 BY Max'),
  ('cd241764-ee96-5b19-9a07-3fc9a679270d', 'c8ffce52-5404-5e85-b040-8abf9a756837', 'BW 10-6L'),
  ('cedf1b6a-b567-5038-b8eb-4591cb5b550d', 'c8ffce52-5404-5e85-b040-8abf9a756837', 'BW 17-6L'),
  ('b66f0e8d-0dc9-5182-b4d1-26b7cfea406e', 'c8ffce52-5404-5e85-b040-8abf9a756837', 'BW 25-6L'),
  ('4bc40a32-203d-5779-acb7-a603c631827c', '89f010a4-f0af-5a32-bf50-c6d0ebbe58ec', 'MD 012-12'),
  ('45b7cfa1-2e31-5a20-8a2c-6d8f1c36c27c', '89f010a4-f0af-5a32-bf50-c6d0ebbe58ec', 'MD 017-12'),
  ('6ab562e0-a93e-5457-ac95-139411d29ea1', '89f010a4-f0af-5a32-bf50-c6d0ebbe58ec', 'MD 024-12'),
  ('43af029f-e6e9-5385-991a-1d787db52777', '1c78f147-db37-5081-af47-4f759954548f', 'CD020'),
  ('6ce02aca-a466-59ea-8cf4-88dca4ae37ee', '1c78f147-db37-5081-af47-4f759954548f', 'CD025'),
  ('41e29619-d80f-5194-a531-f5171d7677e0', '1c78f147-db37-5081-af47-4f759954548f', 'CD032'),
  ('e648819d-017b-5951-b5c7-a1a47dd7ad8e', '9165c8cf-754f-526b-8a24-1c4c9723192d', 'E040'),
  ('41fdce82-7e98-5809-90ba-5a7ff4270b2c', '9165c8cf-754f-526b-8a24-1c4c9723192d', 'E050');

insert into products (model_id, part_type, material, part_number, price) values
  ('855bcf9f-b7b9-53f1-931a-4fa12ca6f549', 'stator', 'NBR', '100015-NBR', NULL),
  ('855bcf9f-b7b9-53f1-931a-4fa12ca6f549', 'stator', 'EPDM', '100015-EPDM', NULL),
  ('855bcf9f-b7b9-53f1-931a-4fa12ca6f549', 'stator', 'FKM (Viton)', '100015-FKM', NULL),
  ('855bcf9f-b7b9-53f1-931a-4fa12ca6f549', 'rotor', 'Chrome-Plated Steel', '200015-CR', NULL),
  ('855bcf9f-b7b9-53f1-931a-4fa12ca6f549', 'rotor', 'Stainless Steel 316', '200015-SS', NULL),
  ('52209421-c09f-5332-9407-f9c0194313da', 'stator', 'NBR', '100031-NBR', NULL),
  ('52209421-c09f-5332-9407-f9c0194313da', 'stator', 'EPDM', '100031-EPDM', NULL),
  ('52209421-c09f-5332-9407-f9c0194313da', 'rotor', 'Chrome-Plated Steel', '200031-CR', NULL),
  ('01f1f91b-b9c2-5a75-94ab-6afeaaeaeddb', 'stator', 'NBR', '100045-NBR', NULL),
  ('01f1f91b-b9c2-5a75-94ab-6afeaaeaeddb', 'stator', 'EPDM', '100045-EPDM', NULL),
  ('01f1f91b-b9c2-5a75-94ab-6afeaaeaeddb', 'rotor', 'Chrome-Plated Steel', '200045-CR', NULL),
  ('2672f7df-2f99-516e-b596-1106c3877dc5', 'stator', 'NBR', '100063-NBR', NULL),
  ('2672f7df-2f99-516e-b596-1106c3877dc5', 'rotor', 'Chrome-Plated Steel', '200063-CR', NULL),
  ('573201c1-e3b5-5070-917d-d4f328e32749', 'stator', 'NBR', '100076-NBR', NULL),
  ('cd241764-ee96-5b19-9a07-3fc9a679270d', 'stator', 'NBR', 'BW10-S-NBR', NULL),
  ('cd241764-ee96-5b19-9a07-3fc9a679270d', 'stator', 'EPDM', 'BW10-S-EPDM', NULL),
  ('cd241764-ee96-5b19-9a07-3fc9a679270d', 'rotor', 'Chrome-Plated Steel', 'BW10-R-CR', NULL),
  ('cedf1b6a-b567-5038-b8eb-4591cb5b550d', 'stator', 'NBR', 'BW17-S-NBR', NULL),
  ('4bc40a32-203d-5779-acb7-a603c631827c', 'stator', 'NBR', 'MD012-S-NBR', NULL),
  ('4bc40a32-203d-5779-acb7-a603c631827c', 'stator', 'FKM (Viton)', 'MD012-S-FKM', NULL),
  ('4bc40a32-203d-5779-acb7-a603c631827c', 'rotor', 'Chrome-Plated Steel', 'MD012-R-CR', NULL),
  ('45b7cfa1-2e31-5a20-8a2c-6d8f1c36c27c', 'stator', 'NBR', 'MD017-S-NBR', NULL),
  ('43af029f-e6e9-5385-991a-1d787db52777', 'stator', 'NBR', 'CD020-S-NBR', NULL),
  ('43af029f-e6e9-5385-991a-1d787db52777', 'stator', 'EPDM', 'CD020-S-EPDM', NULL),
  ('43af029f-e6e9-5385-991a-1d787db52777', 'rotor', 'Chrome-Plated Steel', 'CD020-R-CR', NULL),
  ('6ce02aca-a466-59ea-8cf4-88dca4ae37ee', 'stator', 'NBR', 'CD025-S-NBR', NULL),
  ('e648819d-017b-5951-b5c7-a1a47dd7ad8e', 'stator', 'NBR', 'E040-S-NBR', NULL),
  ('e648819d-017b-5951-b5c7-a1a47dd7ad8e', 'stator', 'EPDM', 'E040-S-EPDM', NULL),
  ('e648819d-017b-5951-b5c7-a1a47dd7ad8e', 'rotor', 'Stainless Steel 316', 'E040-R-SS', NULL);
