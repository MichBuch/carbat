-- Seed realistic UK vehicle + battery data for CarBat
-- Run: npm run db:seed   (or paste into Neon console after init.sql)

-- ========== VEHICLES ==========
INSERT INTO vehicles (slug, make, model, variant, year_from, year_to, engine_cc, fuel, start_stop, battery_polarity, battery_length_max_mm, battery_width_max_mm, battery_height_max_mm, min_ah, recommended_ah, min_cca, recommended_type, hold_down, notes)
VALUES
  ('ford-fiesta-2013-2019-1.0-ecoboost', 'Ford', 'Fiesta', '1.0 EcoBoost', 2013, 2019, 998, 'petrol', false, '0', 208, 175, 190, 44, 52, 440, 'standard', 'B0', 'Common supermini. Standard battery fits most.'),
  ('ford-fiesta-2018-2023-1.0-startstop', 'Ford', 'Fiesta', '1.0 EcoBoost s/s', 2018, 2023, 998, 'petrol', true, '0', 242, 175, 190, 60, 65, 580, 'efb', 'B13', 'Start/stop requires EFB or AGM.'),
  ('vw-golf-2013-2020-1.6-tdi', 'Volkswagen', 'Golf', '1.6 TDI', 2013, 2020, 1598, 'diesel', true, '0', 278, 175, 190, 68, 72, 680, 'efb', 'B13', 'MK7 Golf diesel often EFB for start/stop.'),
  ('vw-golf-2017-2024-1.5-tsi', 'Volkswagen', 'Golf', '1.5 TSI Evo', 2017, 2024, 1498, 'petrol', true, '0', 278, 175, 190, 68, 70, 640, 'agm', 'B13', 'Many later MK7.5/8 use AGM.'),
  ('vauxhall-corsa-2015-2019-1.4', 'Vauxhall', 'Corsa', '1.4', 2015, 2019, 1398, 'petrol', false, '0', 207, 175, 190, 44, 50, 420, 'standard', 'B0', 'Pre-facelift non s/s.'),
  ('vauxhall-corsa-2019-2023-1.2-startstop', 'Vauxhall', 'Corsa', '1.2 Turbo s/s', 2019, 2023, 1199, 'petrol', true, '0', 242, 175, 190, 60, 65, 600, 'efb', 'B13', 'F 5th gen with auto start/stop.'),
  ('bmw-320d-2015-2019-f30', 'BMW', '3 Series', '320d (F30)', 2015, 2019, 1995, 'diesel', true, '0', 315, 175, 190, 80, 90, 800, 'agm', 'B13', 'High spec AGM preferred on many BMWs.'),
  ('ford-focus-2015-2018-1.5-tdci', 'Ford', 'Focus', '1.5 TDCi', 2015, 2018, 1499, 'diesel', true, '0', 278, 175, 190, 68, 72, 680, 'efb', 'B13', 'MK3.5 Focus popular fleet car.'),
  ('nissan-qashqai-2014-2021-1.5-dci', 'Nissan', 'Qashqai', '1.5 dCi', 2014, 2021, 1461, 'diesel', true, '0', 278, 175, 190, 65, 70, 640, 'efb', 'B13', 'J11 Qashqai very common.'),
  ('toyota-yaris-2014-2020-1.33', 'Toyota', 'Yaris', '1.33 VVT-i', 2014, 2020, 1329, 'petrol', false, '0', 207, 175, 190, 40, 45, 400, 'standard', 'B0', 'Reliable non start/stop.'),
  ('audi-a3-2013-2020-2.0-tdi', 'Audi', 'A3', '2.0 TDI', 2013, 2020, 1968, 'diesel', true, '0', 278, 175, 190, 68, 72, 680, 'agm', 'B13', '8V A3 often recommends AGM.'),
  ('mercedes-c220-2015-2021-w205', 'Mercedes-Benz', 'C-Class', 'C220d (W205)', 2015, 2021, 2143, 'diesel', true, '0', 315, 175, 190, 80, 95, 850, 'agm', 'B13', 'Premium stop/start AGM.'),
  ('honda-civic-2015-2021-1.6-ides', 'Honda', 'Civic', '1.6 i-DTEC', 2015, 2021, 1597, 'diesel', true, '0', 242, 175, 190, 60, 65, 600, 'efb', 'B13', 'FK 10th gen diesel.'),
  ('hyundai-i30-2017-2022-1.6-crdi', 'Hyundai', 'i30', '1.6 CRDi', 2017, 2022, 1582, 'diesel', true, '0', 242, 175, 190, 60, 68, 640, 'efb', 'B13', 'PD 3rd gen.'),
  ('skoda-octavia-2017-2023-2.0-tdi', 'Skoda', 'Octavia', '2.0 TDI', 2017, 2023, 1968, 'diesel', true, '0', 278, 175, 190, 68, 72, 680, 'agm', 'B13', 'MK3 Octavia estate common.'),
  ('peugeot-208-2019-2023-1.2-puretech', 'Peugeot', '208', '1.2 PureTech s/s', 2019, 2023, 1199, 'petrol', true, '0', 242, 175, 190, 60, 65, 580, 'efb', 'B13', 'P21 start/stop model.'),
  ('renault-captur-2017-2022-1.5-dci', 'Renault', 'Captur', '1.5 dCi', 2017, 2022, 1461, 'diesel', true, '0', 242, 175, 190, 60, 65, 600, 'efb', 'B13', 'J87 Captur.'),
  ('mini-cooper-2014-2018-f56-1.5', 'MINI', 'Cooper', '1.5 (F56)', 2014, 2018, 1499, 'petrol', true, '0', 242, 175, 190, 60, 65, 600, 'agm', 'B13', 'Many with start/stop use AGM.'),
  ('land-rover-discovery-sport-2015-2019-2.0', 'Land Rover', 'Discovery Sport', '2.0 TD4', 2015, 2019, 1999, 'diesel', true, '0', 315, 175, 190, 80, 90, 800, 'agm', 'B13', 'L550 large battery tray.'),
  ('volvo-xc60-2018-2023-d4', 'Volvo', 'XC60', 'D4 (SPA)', 2018, 2023, 1969, 'diesel', true, '0', 315, 175, 190, 80, 95, 850, 'agm', 'B13', 'SPA platform often AGM.'),
  ('tesla-model3-2019-2024', 'Tesla', 'Model 3', 'Standard Range', 2019, 2024, NULL, 'other', false, '0', 207, 175, 190, 40, 50, 400, 'standard', 'B0', '12V auxiliary battery only (Li main pack).'),
  ('ford-transit-custom-2018-2023-2.0', 'Ford', 'Transit Custom', '2.0 EcoBlue', 2018, 2023, 1996, 'diesel', false, '0', 353, 175, 190, 90, 105, 900, 'standard', 'B0', 'Van - larger case often 096/019.'),
  ('vauxhall-vivaro-2019-2023-2.0', 'Vauxhall', 'Vivaro', '2.0 CDTi', 2019, 2023, 1996, 'diesel', false, '0', 353, 175, 190, 90, 100, 850, 'standard', 'B0', 'Common van size.')
ON CONFLICT (slug) DO NOTHING;

-- ========== REG LOOKUPS (demo popular UK style regs - normalize to UPPER no spaces) ==========
-- These are fictional but realistic format for demo purposes.
INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'AB12CDE', v.id FROM vehicles v WHERE v.slug = 'ford-fiesta-2013-2019-1.0-ecoboost'
ON CONFLICT (reg) DO NOTHING;

INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'BX15KLM', v.id FROM vehicles v WHERE v.slug = 'vw-golf-2013-2020-1.6-tdi'
ON CONFLICT (reg) DO NOTHING;

INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'DE68FNP', v.id FROM vehicles v WHERE v.slug = 'vauxhall-corsa-2019-2023-1.2-startstop'
ON CONFLICT (reg) DO NOTHING;

INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'GV17XYZ', v.id FROM vehicles v WHERE v.slug = 'nissan-qashqai-2014-2021-1.5-dci'
ON CONFLICT (reg) DO NOTHING;

INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'HK19ABC', v.id FROM vehicles v WHERE v.slug = 'ford-focus-2015-2018-1.5-tdci'
ON CONFLICT (reg) DO NOTHING;

INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'LC65MNO', v.id FROM vehicles v WHERE v.slug = 'bmw-320d-2015-2019-f30'
ON CONFLICT (reg) DO NOTHING;

INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'PK68RST', v.id FROM vehicles v WHERE v.slug = 'audi-a3-2013-2020-2.0-tdi'
ON CONFLICT (reg) DO NOTHING;

INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'WR20UVX', v.id FROM vehicles v WHERE v.slug = 'mercedes-c220-2015-2021-w205'
ON CONFLICT (reg) DO NOTHING;

INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'YT14PQR', v.id FROM vehicles v WHERE v.slug = 'toyota-yaris-2014-2020-1.33'
ON CONFLICT (reg) DO NOTHING;

INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'AF21BCD', v.id FROM vehicles v WHERE v.slug = 'peugeot-208-2019-2023-1.2-puretech'
ON CONFLICT (reg) DO NOTHING;

INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'MX18EFG', v.id FROM vehicles v WHERE v.slug = 'skoda-octavia-2017-2023-2.0-tdi'
ON CONFLICT (reg) DO NOTHING;

INSERT INTO reg_lookups (reg, vehicle_id)
SELECT 'BD15HIJ', v.id FROM vehicles v WHERE v.slug = 'ford-transit-custom-2018-2023-2.0'
ON CONFLICT (reg) DO NOTHING;

-- ========== BATTERIES (realistic popular UK range) ==========
INSERT INTO batteries (slug, brand, model, ah, cca, type, length_mm, width_mm, height_mm, polarity, weight_kg, warranty_months, technology, group_size)
VALUES
  -- Budget / standard
  ('banner-running-bull-44', 'Banner', 'Running Bull 44Ah', 44, 400, 'standard', 207, 175, 190, '0', 10, 24, 'Calcium', '063'),
  ('exide-eb440', 'Exide', 'EB440', 44, 420, 'standard', 207, 175, 190, '0', 10, 24, 'Calcium', '063'),
  ('yuasa-ybx1005', 'Yuasa', 'YBX1005 45Ah', 45, 400, 'standard', 207, 175, 190, '0', 10, 36, 'SMF Calcium', '063'),
  ('varta-blue-dynamic-52', 'Varta', 'Blue Dynamic 52Ah', 52, 470, 'standard', 242, 175, 190, '0', 12, 30, 'SMF', '065'),
  ('bosch-s4005', 'Bosch', 'S4 005 52Ah', 52, 470, 'standard', 242, 175, 190, '0', 12, 24, 'PowerFrame', '065'),

  -- Popular mid 60-70Ah
  ('varta-blue-dynamic-60', 'Varta', 'Blue Dynamic 60Ah', 60, 540, 'standard', 242, 175, 190, '0', 13, 30, 'SMF', '065'),
  ('yuasa-ybx1013', 'Yuasa', 'YBX1013 60Ah', 60, 550, 'standard', 242, 175, 190, '0', 13, 36, 'SMF', '065'),
  ('exide-eb620', 'Exide', 'EB620 62Ah', 62, 540, 'standard', 242, 175, 190, '0', 13, 24, 'SMF', '065'),
  ('varta-silver-dynamic-70', 'Varta', 'Silver Dynamic 70Ah', 70, 630, 'standard', 278, 175, 190, '0', 15, 36, 'SMF Enhanced', '096'),
  ('bosch-s4008', 'Bosch', 'S4 008 70Ah', 70, 630, 'standard', 278, 175, 190, '0', 15, 24, 'PowerFrame', '096'),

  -- EFB start/stop
  ('varta-blue-dynamic-efb-65', 'Varta', 'Blue Dynamic EFB 65Ah', 65, 600, 'efb', 242, 175, 190, '0', 15, 36, 'EFB', 'EFB065'),
  ('yuasa-ybx7005', 'Yuasa', 'YBX7005 EFB 65Ah', 65, 620, 'efb', 242, 175, 190, '0', 15, 48, 'EFB', 'EFB065'),
  ('bosch-s5005', 'Bosch', 'S5 005 EFB 65Ah', 65, 650, 'efb', 242, 175, 190, '0', 15, 36, 'EFB', 'EFB065'),
  ('varta-blue-dynamic-efb-70', 'Varta', 'Blue Dynamic EFB 70Ah', 70, 680, 'efb', 278, 175, 190, '0', 16, 36, 'EFB', 'EFB096'),
  ('exide-efb-efb700', 'Exide', 'EFB 700 70Ah', 70, 680, 'efb', 278, 175, 190, '0', 16, 36, 'EFB', 'EFB096'),
  ('yuasa-ybx7013', 'Yuasa', 'YBX7013 EFB 70Ah', 70, 700, 'efb', 278, 175, 190, '0', 16, 48, 'EFB', 'EFB096'),

  -- AGM premium start/stop + high performance
  ('varta-silver-dynamic-agm-70', 'Varta', 'Silver Dynamic AGM 70Ah', 70, 760, 'agm', 278, 175, 190, '0', 17, 48, 'AGM', 'AGM096'),
  ('varta-silver-dynamic-agm-80', 'Varta', 'Silver Dynamic AGM 80Ah', 80, 800, 'agm', 315, 175, 190, '0', 20, 48, 'AGM', 'AGM H7'),
  ('yuasa-ybx9005', 'Yuasa', 'YBX9005 AGM 70Ah', 70, 760, 'agm', 278, 175, 190, '0', 17, 60, 'AGM VRLA', 'AGM096'),
  ('bosch-s6005', 'Bosch', 'S6 005 AGM 70Ah', 70, 760, 'agm', 278, 175, 190, '0', 17, 48, 'AGM', 'AGM096'),
  ('yuasa-ybx9013', 'Yuasa', 'YBX9013 AGM 80Ah', 80, 820, 'agm', 315, 175, 190, '0', 20, 60, 'AGM VRLA', 'AGM H7'),
  ('varta-silver-dynamic-agm-95', 'Varta', 'Silver Dynamic AGM 95Ah', 95, 850, 'agm', 353, 175, 190, '0', 24, 48, 'AGM', 'AGM H8'),
  ('bosch-s6013', 'Bosch', 'S6 013 AGM 95Ah', 95, 850, 'agm', 353, 175, 190, '0', 24, 48, 'AGM', 'AGM H8'),

  -- Some reverse polarity examples (1)
  ('varta-blue-dynamic-60-r', 'Varta', 'Blue Dynamic 60Ah (Rev)', 60, 540, 'standard', 242, 175, 190, '1', 13, 30, 'SMF', '065R'),
  ('yuasa-ybx1013-r', 'Yuasa', 'YBX1013 60Ah (Rev)', 60, 550, 'standard', 242, 175, 190, '1', 13, 36, 'SMF', '065R'),

  -- Van / larger
  ('varta-promotive-105', 'Varta', 'Promotive 105Ah', 105, 950, 'standard', 353, 175, 190, '0', 26, 24, 'Commercial', '019'),
  ('yuasa-ybx5027', 'Yuasa', 'YBX5027 100Ah', 100, 900, 'standard', 353, 175, 190, '0', 25, 36, 'SMF', '019'),
  ('exide-eg1100', 'Exide', 'EG1100 110Ah', 110, 1000, 'standard', 394, 175, 190, '0', 28, 24, 'SMF', '031'),

  -- A couple of higher Ah standard for older large cars
  ('banner-power-bull-74', 'Banner', 'Power Bull 74Ah', 74, 680, 'standard', 278, 175, 190, '0', 16, 24, 'Calcium', '096'),
  ('varta-blue-dynamic-74', 'Varta', 'Blue Dynamic 74Ah', 74, 680, 'standard', 278, 175, 190, '0', 16, 30, 'SMF', '096')
ON CONFLICT (slug) DO NOTHING;

-- ========== EXPLICIT RECOMMENDATIONS (best matches) ==========
-- Link some popular vehicles to their best batteries via slug match
INSERT INTO vehicle_battery_recommendations (vehicle_id, battery_id, is_best_match, fit_notes)
SELECT v.id, b.id, true, 'Direct OE equivalent fit. Meets start/stop and tray dimensions.'
FROM vehicles v, batteries b
WHERE v.slug = 'ford-fiesta-2018-2023-1.0-startstop' AND b.slug = 'varta-blue-dynamic-efb-65'
ON CONFLICT (vehicle_id, battery_id) DO NOTHING;

INSERT INTO vehicle_battery_recommendations (vehicle_id, battery_id, is_best_match, fit_notes)
SELECT v.id, b.id, true, 'Recommended EFB upgrade for reliable start/stop performance.'
FROM vehicles v, batteries b
WHERE v.slug = 'vw-golf-2013-2020-1.6-tdi' AND b.slug = 'yuasa-ybx7005'
ON CONFLICT (vehicle_id, battery_id) DO NOTHING;

INSERT INTO vehicle_battery_recommendations (vehicle_id, battery_id, is_best_match, fit_notes)
SELECT v.id, b.id, true, 'Premium AGM choice. Excellent for high electrical load vehicles.'
FROM vehicles v, batteries b
WHERE v.slug = 'bmw-320d-2015-2019-f30' AND b.slug = 'varta-silver-dynamic-agm-80'
ON CONFLICT (vehicle_id, battery_id) DO NOTHING;

INSERT INTO vehicle_battery_recommendations (vehicle_id, battery_id, is_best_match, fit_notes)
SELECT v.id, b.id, true, 'Good value EFB that fits the tray perfectly.'
FROM vehicles v, batteries b
WHERE v.slug = 'nissan-qashqai-2014-2021-1.5-dci' AND b.slug = 'varta-blue-dynamic-efb-70'
ON CONFLICT (vehicle_id, battery_id) DO NOTHING;

INSERT INTO vehicle_battery_recommendations (vehicle_id, battery_id, is_best_match, fit_notes)
SELECT v.id, b.id, true, 'AGM spec for advanced start/stop and energy recovery.'
FROM vehicles v, batteries b
WHERE v.slug = 'audi-a3-2013-2020-2.0-tdi' AND b.slug = 'yuasa-ybx9005'
ON CONFLICT (vehicle_id, battery_id) DO NOTHING;

INSERT INTO vehicle_battery_recommendations (vehicle_id, battery_id, is_best_match, fit_notes)
SELECT v.id, b.id, true, 'Oversize capacity AGM for luxury models with many consumers.'
FROM vehicles v, batteries b
WHERE v.slug = 'mercedes-c220-2015-2021-w205' AND b.slug = 'varta-silver-dynamic-agm-95'
ON CONFLICT (vehicle_id, battery_id) DO NOTHING;

INSERT INTO vehicle_battery_recommendations (vehicle_id, battery_id, is_best_match, fit_notes)
SELECT v.id, b.id, true, 'Perfect match for the larger battery compartment in this van.'
FROM vehicles v, batteries b
WHERE v.slug = 'ford-transit-custom-2018-2023-2.0' AND b.slug = 'yuasa-ybx5027'
ON CONFLICT (vehicle_id, battery_id) DO NOTHING;

-- Extra good alternatives (non-best) for variety
INSERT INTO vehicle_battery_recommendations (vehicle_id, battery_id, is_best_match, fit_notes)
SELECT v.id, b.id, false, 'Budget-friendly EFB alternative that still meets requirements.'
FROM vehicles v, batteries b
WHERE v.slug = 'vauxhall-corsa-2019-2023-1.2-startstop' AND b.slug = 'exide-efb-efb700'
ON CONFLICT (vehicle_id, battery_id) DO NOTHING;

INSERT INTO vehicle_battery_recommendations (vehicle_id, battery_id, is_best_match, fit_notes)
SELECT v.id, b.id, false, 'Solid all-rounder upgrade with extra capacity.'
FROM vehicles v, batteries b
WHERE v.slug = 'ford-focus-2015-2018-1.5-tdci' AND b.slug = 'varta-silver-dynamic-70'
ON CONFLICT (vehicle_id, battery_id) DO NOTHING;
