-- ─── Seed de teste — datas relativas a 2026-05-25 ─────────────────────────────
-- Execute no SQL Editor do Supabase Dashboard.
-- Atualiza registros existentes e insere novos para testar o dashboard.

-- ─── Animais: status e datas atualizados ─────────────────────────────────────

-- 4 partos próximos (next 15 days from 2026-05-25)
UPDATE animais SET status='GESTANTE', data_parto_estimado='2026-05-28', data_ultimo_parto='2025-05-20', em_lactacao=false WHERE id='a3';  -- 0018  →  3d
UPDATE animais SET status='GESTANTE', data_parto_estimado='2026-06-02', data_ultimo_parto='2025-06-01', em_lactacao=false WHERE id='a5';  -- 0029 Boneca  →  8d
UPDATE animais SET status='GESTANTE', data_parto_estimado='2026-06-05', data_ultimo_parto='2025-06-08', em_lactacao=false WHERE id='a6';  -- 0031  →  11d
UPDATE animais SET status='GESTANTE', data_parto_estimado='2026-06-07', data_ultimo_parto='2025-06-10', em_lactacao=false WHERE id='a8';  -- 0042 Mimosa  →  13d

-- Vacas lactando com partos recentes
UPDATE animais SET status='LACTANDO', data_ultimo_parto='2026-03-05', data_parto_estimado=NULL, em_lactacao=true  WHERE id='a2';   -- 0014
UPDATE animais SET status='LACTANDO', data_ultimo_parto='2026-03-12', data_parto_estimado=NULL, em_lactacao=true  WHERE id='a4';   -- 0022
UPDATE animais SET status='LACTANDO', data_ultimo_parto='2026-03-20', data_parto_estimado=NULL, em_lactacao=true  WHERE id='a7';   -- 0036
UPDATE animais SET status='LACTANDO', data_ultimo_parto='2026-04-01', data_parto_estimado=NULL, em_lactacao=true  WHERE id='a10';  -- 0051
UPDATE animais SET status='LACTANDO', data_ultimo_parto='2026-04-08', data_parto_estimado=NULL, em_lactacao=true  WHERE id='a12';  -- 0063
UPDATE animais SET status='LACTANDO', data_ultimo_parto='2026-04-15', data_parto_estimado=NULL, em_lactacao=true  WHERE id='a13';  -- 0071

-- Vacas inseminadas aguardando diagnóstico
UPDATE animais SET status='INSEMINADA', data_parto_estimado=NULL WHERE id='a1';   -- 0011  (insem. 2026-04-17, 38d atrás)
UPDATE animais SET status='INSEMINADA', data_parto_estimado=NULL WHERE id='a9';   -- 0047  (insem. 2026-04-24, 31d atrás)

-- ─── Bezerros: substituir mamando por nascimentos de 2026 ─────────────────────

UPDATE bezerros SET
  id_etiqueta='B-401', mae_id='a2',  mae_etiqueta='0014',
  data_nascimento='2026-03-05', peso_nascimento=35, peso_atual=98,
  data_desmame_estimada='2026-10-01', status='MAMANDO'
WHERE id='b1';

UPDATE bezerros SET
  id_etiqueta='B-402', mae_id='a4',  mae_etiqueta='0022',
  data_nascimento='2026-03-12', peso_nascimento=32, peso_atual=90,
  data_desmame_estimada='2026-10-08', status='MAMANDO'
WHERE id='b2';

UPDATE bezerros SET
  id_etiqueta='B-403', mae_id='a7',  mae_etiqueta='0036',
  data_nascimento='2026-03-20', peso_nascimento=36, peso_atual=82,
  data_desmame_estimada='2026-10-16', status='MAMANDO'
WHERE id='b3';

UPDATE bezerros SET
  id_etiqueta='B-404', mae_id='a10', mae_etiqueta='0051',
  data_nascimento='2026-04-01', peso_nascimento=33, peso_atual=70,
  data_desmame_estimada='2026-10-28', status='MAMANDO'
WHERE id='b4';

UPDATE bezerros SET
  id_etiqueta='B-405', mae_id='a12', mae_etiqueta='0063',
  data_nascimento='2026-04-08', peso_nascimento=35, peso_atual=64,
  data_desmame_estimada='2026-11-04', status='MAMANDO'
WHERE id='b5';

UPDATE bezerros SET
  id_etiqueta='B-406', mae_id='a13', mae_etiqueta='0071',
  data_nascimento='2026-04-15', peso_nascimento=31, peso_atual=56,
  data_desmame_estimada='2026-11-11', status='MAMANDO'
WHERE id='b6';

-- Bezerros com desmame próximo (nascidos out/nov 2025, ~210 dias → vence mai/jun 2026)
INSERT INTO bezerros (id, id_etiqueta, mae_id, mae_etiqueta, sexo, data_nascimento, peso_nascimento, peso_atual, dias_vida, data_desmame_estimada, status) VALUES
  ('b9', 'B-350', 'a2',  '0014', 'M', '2025-10-29', 37, 175, 208, '2026-05-27', 'MAMANDO'),  -- desmame em 2d
  ('b10','B-351', 'a4',  '0022', 'F', '2025-11-01', 33, 170, 205, '2026-05-30', 'MAMANDO'),  -- desmame em 5d
  ('b11','B-352', 'a7',  '0036', 'M', '2025-11-07', 36, 165, 199, '2026-06-05', 'MAMANDO')   -- desmame em 11d
ON CONFLICT (id) DO NOTHING;

-- ─── Eventos reprodutivos: protocolo IATF mai/2026 ───────────────────────────

INSERT INTO eventos_reprodutivos (id, animal_id, etiqueta, tipo, data, veterinario_id, resultado, obs) VALUES
  -- a11/0055: implante 20/mai, inseminacao 22/mai (3d atrás → etapa "inseminacao_iatf")
  ('er15','a11','0055','IMPLANTE_HORMONAL',  '2026-05-20','v1',null,null),
  ('er16','a11','0055','INSEMINACAO_IATF',   '2026-05-22','v1',null,'Protocolo mai/2026'),
  -- a15/0088: só implante 22/mai (3d atrás → etapa "implante_hormonal")
  ('er17','a15','0088','IMPLANTE_HORMONAL',  '2026-05-22','v1',null,'Protocolo mai/2026'),
  -- a16/0103: implante 18/abr, inseminacao 20/abr (35d atrás → etapa "aguardando_diagnostico")
  ('er18','a16','0103','IMPLANTE_HORMONAL',  '2026-04-18','v1',null,null),
  ('er19','a16','0103','INSEMINACAO_IATF',   '2026-04-20','v1',null,null),
  -- a1/0011: inseminada 17/abr (38d atrás, sem diagnóstico → pendente)
  ('er20','a1', '0011','INSEMINACAO_IATF',   '2026-04-17','v1',null,null),
  -- a9/0047: inseminada 24/abr (31d atrás, sem diagnóstico → pendente)
  ('er21','a9', '0047','INSEMINACAO_IATF',   '2026-04-24','v1',null,null)
ON CONFLICT (id) DO NOTHING;

-- ─── Medicamentos: ajustar estoque/validade para gerar alertas ───────────────

UPDATE medicamentos SET estoque_atual=2,  estoque_minimo=10 WHERE id='m1';  -- Ocitocina: estoque baixo
UPDATE medicamentos SET estoque_atual=3,  estoque_minimo=10 WHERE id='m2';  -- Progesterona: estoque baixo
UPDATE medicamentos SET validade='2026-06-14', estoque_atual=8 WHERE id='m3';  -- Cipionato: vence em 20d
UPDATE medicamentos SET validade='2026-06-04' WHERE id='m8';  -- Flunixin: vence em 10d

-- ─── Aplicações: protocolo mai/2026 ──────────────────────────────────────────

INSERT INTO aplicacoes (id, animal_id, etiqueta, medicamento_id, medicamento, dose_aplicada, via, data, responsavel, motivo, carencia_dias) VALUES
  ('ap12','a11','0055','m2','Progesterona Dispenser',1,'SUBCUTANEA',  '2026-05-20T08:00:00Z','Dr. Carlos',  'Protocolo IATF',0),
  ('ap13','a15','0088','m2','Progesterona Dispenser',1,'SUBCUTANEA',  '2026-05-22T08:00:00Z','Dr. Carlos',  'Protocolo IATF',0),
  ('ap14','a11','0055','m3','Cipionato de Estradiol', 1,'INTRAMUSCULAR','2026-05-20T08:00:00Z','Dr. Carlos',  'Protocolo IATF',0),
  ('ap15','a3', '0018','m5','Ivermectina 1%',        10,'SUBCUTANEA',  '2026-05-10T09:00:00Z','Pedro Santos','Controle pré-parto',42),
  ('ap16','a5', '0029','m5','Ivermectina 1%',        10,'SUBCUTANEA',  '2026-05-10T09:00:00Z','Pedro Santos','Controle pré-parto',42),
  ('ap17','a2', '0014','m6','Vitamina ADE',           5,'INTRAMUSCULAR','2026-03-05T10:00:00Z','Pedro Santos','Suplementação pós-parto',0),
  ('ap18','a4', '0022','m6','Vitamina ADE',           5,'INTRAMUSCULAR','2026-03-12T10:00:00Z','Pedro Santos','Suplementação pós-parto',0)
ON CONFLICT (id) DO NOTHING;

-- ─── Transações financeiras 2026 ─────────────────────────────────────────────

INSERT INTO transacoes (id, tipo, categoria, valor, data, descricao, animal_id) VALUES
  ('t13','DESPESA','MEDICAMENTO', 680,'2026-05-20T12:00:00Z','Progesterona Dispenser + Cipionato — protocolo mai/2026', null),
  ('t14','DESPESA','VETERINARIO', 950,'2026-05-20T12:00:00Z','Protocolo IATF mai/2026 — Dr. Carlos Mendes',             null),
  ('t15','DESPESA','RACAO',      1350,'2026-05-01T12:00:00Z','Ração suplementar mai/2026',                              null),
  ('t16','RECEITA','VENDA_BEZERRO',3400,'2026-04-15T12:00:00Z','Venda bezerro B-355 — Lote 2025-A',                    null),
  ('t17','DESPESA','MEDICAMENTO', 280,'2026-04-10T12:00:00Z','Ivermectina 1% + Vitamina ADE — pré-parto',              null),
  ('t18','RECEITA','OUTRO',       600,'2026-03-20T12:00:00Z','Venda esterco orgânico',                                 null),
  ('t19','DESPESA','RACAO',      1280,'2026-04-01T12:00:00Z','Ração suplementar abr/2026',                             null),
  ('t20','RECEITA','VENDA_BEZERRO',2900,'2026-03-10T12:00:00Z','Venda bezerra B-320 — Lote 2025-A',                   null)
ON CONFLICT (id) DO NOTHING;

-- ─── Lotes: atualizar contadores ─────────────────────────────────────────────

UPDATE lotes SET status='PARTO',    gestantes=4, paridas_no_mes=3, bezerros_vivos=6, desmamados=0, total_vacas=50 WHERE id='l1';
UPDATE lotes SET status='EM_MONTA', gestantes=0, paridas_no_mes=0, bezerros_vivos=0, desmamados=0, total_vacas=48 WHERE id='l2';
