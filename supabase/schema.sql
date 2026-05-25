-- ─── Schema ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS veterinarios (
  id          TEXT PRIMARY KEY,
  nome        TEXT NOT NULL,
  crmv        TEXT,
  telefone    TEXT,
  email       TEXT,
  especialidade TEXT,
  ativo       BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS encarregados (
  id          TEXT PRIMARY KEY,
  nome        TEXT NOT NULL,
  cargo       TEXT,
  telefone    TEXT,
  lotes       TEXT[] DEFAULT '{}',
  ativo       BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS lotes (
  id              TEXT PRIMARY KEY,
  nome            TEXT NOT NULL,
  tipo            TEXT DEFAULT 'VACA_CRIA',
  status          TEXT DEFAULT 'ABERTO',
  data_abertura   DATE,
  data_fechamento DATE,
  touro           TEXT,
  total_vacas     INT  DEFAULT 0,
  gestantes       INT  DEFAULT 0,
  paridas_no_mes  INT  DEFAULT 0,
  bezerros_vivos  INT  DEFAULT 0,
  desmamados      INT  DEFAULT 0,
  encarregados    TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS animais (
  id                   TEXT PRIMARY KEY,
  id_etiqueta          TEXT,
  nome                 TEXT,
  lote_id              TEXT REFERENCES lotes(id),
  lote                 TEXT,
  status               TEXT DEFAULT 'VAZIA',
  data_nascimento      DATE,
  data_ultimo_parto    DATE,
  data_parto_estimado  DATE,
  em_lactacao          BOOLEAN DEFAULT false,
  peso_kg              NUMERIC,
  raca                 TEXT
);

CREATE TABLE IF NOT EXISTS bezerros (
  id                     TEXT PRIMARY KEY,
  id_etiqueta            TEXT,
  mae_id                 TEXT REFERENCES animais(id),
  mae_etiqueta           TEXT,
  sexo                   TEXT,
  data_nascimento        DATE,
  peso_nascimento        NUMERIC,
  peso_atual             NUMERIC,
  dias_vida              INT,
  data_desmame_estimada  DATE,
  status                 TEXT DEFAULT 'MAMANDO'
);

CREATE TABLE IF NOT EXISTS eventos_reprodutivos (
  id             TEXT PRIMARY KEY,
  animal_id      TEXT REFERENCES animais(id),
  etiqueta       TEXT,
  tipo           TEXT NOT NULL,
  data           DATE NOT NULL,
  veterinario_id TEXT,
  resultado      TEXT,
  obs            TEXT
);

CREATE TABLE IF NOT EXISTS medicamentos (
  id               TEXT PRIMARY KEY,
  nome             TEXT NOT NULL,
  principio_ativo  TEXT,
  tipo             TEXT,
  unidade          TEXT,
  dose_padrao      NUMERIC,
  estoque_atual    NUMERIC DEFAULT 0,
  estoque_minimo   NUMERIC DEFAULT 0,
  validade         DATE,
  fornecedor       TEXT,
  ativo            BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS aplicacoes (
  id             TEXT PRIMARY KEY,
  animal_id      TEXT REFERENCES animais(id),
  etiqueta       TEXT,
  medicamento_id TEXT REFERENCES medicamentos(id),
  medicamento    TEXT,
  dose_aplicada  NUMERIC,
  via            TEXT,
  data           TIMESTAMPTZ NOT NULL,
  responsavel    TEXT,
  motivo         TEXT,
  carencia_dias  INT DEFAULT 0,
  proxima_dose   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS transacoes (
  id        TEXT PRIMARY KEY,
  tipo      TEXT NOT NULL,
  categoria TEXT NOT NULL,
  valor     NUMERIC NOT NULL,
  data      TIMESTAMPTZ NOT NULL,
  descricao TEXT,
  animal_id TEXT
);

-- ─── Seed data ────────────────────────────────────────────────────────────────

INSERT INTO veterinarios VALUES
  ('v1','Dr. Carlos Mendes',  'CRMV/MG-12345','(34) 99812-3456','carlos.mendes@vet.com', 'Reprodução Bovina', true),
  ('v2','Dra. Ana Ferreira',  'CRMV/MG-67890','(34) 99745-6789','ana.ferreira@vet.com',  'Clínica de Bovinos', true),
  ('v3','Dr. Roberto Lima',   'CRMV/MG-11223','(34) 98823-4567','roberto.lima@vet.com',  'Saúde do Rebanho',   false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO encarregados VALUES
  ('e1','João Silva',     'ENCARREGADO','(34) 99901-2345', ARRAY['Lote 2025-A','Lote 2025-B'],                          true),
  ('e2','Pedro Santos',   'VAQUEIRO',   '(34) 99723-4567', ARRAY['Lote 2025-A'],                                        true),
  ('e3','Maria Oliveira', 'GERENTE',    '(34) 99834-5678', ARRAY['Lote 2025-A','Lote 2025-B','Lote 2024-A'],            true),
  ('e4','Lucas Alves',    'VAQUEIRO',   '(34) 99645-6789', ARRAY['Lote 2025-B'],                                        true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lotes VALUES
  ('l1','Lote 2025-A','VACA_CRIA','PARTO',   '2024-08-01','2025-06-30','Imperador 450',50,38,8,8,0,  ARRAY['João Silva','Pedro Santos']),
  ('l2','Lote 2025-B','VACA_CRIA','EM_MONTA','2025-01-15','2025-06-30','Brutus 520',   48, 0,0,0,0,  ARRAY['João Silva','Lucas Alves']),
  ('l3','Lote 2024-A','VACA_CRIA','ENCERRADO','2023-08-01','2024-06-30','Sultão 490',  50, 0,0,48,48,ARRAY['Maria Oliveira'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO animais (id,id_etiqueta,nome,lote_id,lote,status,data_nascimento,data_ultimo_parto,data_parto_estimado,em_lactacao) VALUES
  ('a1', '0011',null,   'l1','Lote 2025-A','INSEMINADA', '2019-03-14','2024-02-10','2025-03-18',false),
  ('a2', '0014',null,   'l1','Lote 2025-A','LACTANDO',   '2018-06-22','2025-02-03',null,         true),
  ('a3', '0018',null,   'l1','Lote 2025-A','GESTANTE',   '2020-01-08','2024-02-18','2025-02-21',false),
  ('a4', '0022',null,   'l1','Lote 2025-A','LACTANDO',   '2019-09-05','2025-01-28',null,         true),
  ('a5', '0029','Boneca','l1','Lote 2025-A','INSEMINADA', '2018-04-17','2024-01-15','2025-03-05',false),
  ('a6', '0031',null,   'l1','Lote 2025-A','GESTANTE',   '2021-02-03','2024-03-01','2025-03-01',false),
  ('a7', '0036',null,   'l1','Lote 2025-A','LACTANDO',   '2019-12-20','2025-01-16',null,         true),
  ('a8', '0042','Mimosa','l1','Lote 2025-A','GESTANTE',  '2018-04-12','2024-02-05','2025-02-18',false),
  ('a9', '0047',null,   'l1','Lote 2025-A','INSEMINADA', '2020-07-09','2024-01-22','2025-03-12',false),
  ('a10','0051',null,   'l1','Lote 2025-A','LACTANDO',   '2019-05-30','2025-01-20',null,         true),
  ('a11','0055',null,   'l2','Lote 2025-B','EM_PROTOCOLO','2020-03-15','2024-03-08',null,         false),
  ('a12','0063',null,   'l1','Lote 2025-A','LACTANDO',   '2018-11-07','2025-01-10',null,         true),
  ('a13','0071',null,   'l1','Lote 2025-A','LACTANDO',   '2019-08-14','2025-02-07',null,         true),
  ('a14','0077','Pretinha','l1','Lote 2025-A','GESTANTE','2020-10-25','2024-03-14','2025-02-25',false),
  ('a15','0088','Estrela', 'l2','Lote 2025-B','EM_PROTOCOLO','2019-06-03','2024-04-12',null,      false),
  ('a16','0103',null,   'l2','Lote 2025-B','EM_PROTOCOLO','2021-01-19','2024-04-05',null,         false),
  ('a17','0112','Negra', 'l2','Lote 2025-B','VAZIA',     '2020-05-11','2024-03-20',null,         false),
  ('a18','0128',null,   'l2','Lote 2025-B','VAZIA',      '2022-04-07',null,null,                 false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO bezerros (id,id_etiqueta,mae_id,mae_etiqueta,sexo,data_nascimento,peso_nascimento,peso_atual,dias_vida,data_desmame_estimada,status) VALUES
  ('b1','B-201','a2', '0014','M','2025-02-03',34,42, 12,'2025-08-31','MAMANDO'),
  ('b2','B-202','a4', '0022','F','2025-01-28',32,45, 18,'2025-08-26','MAMANDO'),
  ('b3','B-203','a7', '0036','M','2025-01-16',36,58, 30,'2025-08-14','MAMANDO'),
  ('b4','B-204','a10','0051','F','2025-01-04',33,71, 42,'2025-08-02','MAMANDO'),
  ('b5','B-205','a12','0063','M','2025-01-01',35,74, 45,'2025-07-30','MAMANDO'),
  ('b6','B-206','a13','0071','F','2025-02-07',31,37,  8,'2025-09-05','MAMANDO'),
  ('b7','B-155','a8', '0042','M','2024-03-10',37,182,341,'2024-09-05','DESMAMADO'),
  ('b8','B-134','a14','0077','F','2024-03-18',33,178,333,'2024-09-13','DESMAMADO')
ON CONFLICT (id) DO NOTHING;

INSERT INTO eventos_reprodutivos (id,animal_id,etiqueta,tipo,data,veterinario_id,resultado,obs) VALUES
  ('er1', 'a8', '0042','IMPLANTE_HORMONAL',  '2024-08-18','v1',null,   null),
  ('er2', 'a8', '0042','INSEMINACAO_IATF',   '2024-08-20','v1',null,   'Sêmen touro A-14'),
  ('er3', 'a8', '0042','DIAGNOSTICO_PRENHEZ','2024-09-18','v2','POSITIVO',null),
  ('er4', 'a8', '0042','PARTO',              '2024-02-05',null,null,   'Parto normal. Bezerro B-155 M 37kg'),
  ('er5', 'a11','0055','IMPLANTE_HORMONAL',  '2025-02-13','v1',null,   null),
  ('er6', 'a11','0055','INSEMINACAO_IATF',   '2025-02-15','v1',null,   null),
  ('er7', 'a15','0088','IMPLANTE_HORMONAL',  '2025-02-15','v1',null,   null),
  ('er8', 'a16','0103','IMPLANTE_HORMONAL',  '2025-01-14','v1',null,   null),
  ('er9', 'a16','0103','INSEMINACAO_IATF',   '2025-01-16','v1',null,   null),
  ('er10','a2', '0014','PARTO',              '2025-02-03',null,null,   'Parto normal. Bezerro B-201 M 34kg'),
  ('er11','a4', '0022','PARTO',              '2025-01-28',null,null,   'Parto normal. Bezerra B-202 F 32kg'),
  ('er12','a7', '0036','PARTO',              '2025-01-16',null,null,   null),
  ('er13','a1', '0011','INSEMINACAO_IATF',   '2025-01-18','v1',null,   null),
  ('er14','a5', '0029','INSEMINACAO_IATF',   '2025-01-14','v1',null,   null)
ON CONFLICT (id) DO NOTHING;

INSERT INTO medicamentos (id,nome,principio_ativo,tipo,unidade,dose_padrao,estoque_atual,estoque_minimo,validade,fornecedor,ativo) VALUES
  ('m1', 'Ocitocina 10UI',          'Ocitocina',      'HORMONIO',       'mL', 5,   2,  10,'2025-12-01','Zoetis',   true),
  ('m2', 'Progesterona Dispenser',  'Progesterona',   'HORMONIO',       'un', 1,   4,  10,'2026-03-01','Ourofino', true),
  ('m3', 'Cipionato de Estradiol',  'Estradiol',      'HORMONIO',       'mL', 1,   8,   5,'2025-03-05','Zoetis',   true),
  ('m4', 'GnRH Lecirelin',          'Lecirelina',     'HORMONIO',       'mL', 2,  15,  10,'2026-06-01','Zoetis',   true),
  ('m5', 'Ivermectina 1%',          'Ivermectina',    'ANTIPARASITARIO','mL',10, 120,  50,'2026-09-01','Ceva',     true),
  ('m6', 'Vitamina ADE',            'Vit. A/D/E',     'VITAMINA',       'mL', 5,  60,  30,'2026-02-01','Ceva',     true),
  ('m7', 'Enrofloxacina 10%',       'Enrofloxacina',  'ANTIBIOTICO',    'mL',25,  50,  20,'2026-05-01','Bayer',    true),
  ('m8', 'Flunixin Meglumine',      'Flunixin',       'OUTRO',          'mL',20,  30,  10,'2025-11-01','Ourofino', true),
  ('m9', 'Cálcio EV 23%',          'Gluconato Ca',   'VITAMINA',       'mL',500,  5,   8,'2026-01-01','Bravet',   true),
  ('m10','Oxitetraciclina LA',      'Oxitetraciclina','ANTIBIOTICO',    'mL',20,  40,  15,'2026-04-01','Zoetis',   true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO aplicacoes (id,animal_id,etiqueta,medicamento_id,medicamento,dose_aplicada,via,data,responsavel,motivo,carencia_dias) VALUES
  ('ap1', 'a8', '0042','m1','Ocitocina 10UI',         5, 'INTRAMUSCULAR','2025-02-05T10:00:00Z','João Silva',  'Auxílio ao parto',        0),
  ('ap2', 'a2', '0014','m1','Ocitocina 10UI',         5, 'INTRAMUSCULAR','2025-02-03T10:00:00Z','João Silva',  'Auxílio ao parto',        0),
  ('ap3', 'a11','0055','m2','Progesterona Dispenser', 1, 'SUBCUTANEA',   '2025-02-13T08:00:00Z','Dr. Carlos',  'Protocolo IATF',          0),
  ('ap4', 'a15','0088','m2','Progesterona Dispenser', 1, 'SUBCUTANEA',   '2025-02-15T08:00:00Z','Dr. Carlos',  'Protocolo IATF',          0),
  ('ap5', 'a11','0055','m3','Cipionato de Estradiol', 1, 'INTRAMUSCULAR','2025-02-13T08:00:00Z','Dr. Carlos',  'Protocolo IATF',          0),
  ('ap6', 'a8', '0042','m5','Ivermectina 1%',        10, 'SUBCUTANEA',   '2025-01-10T09:00:00Z','Pedro Santos','Controle parasitário',    42),
  ('ap7', 'a14','0077','m5','Ivermectina 1%',        10, 'SUBCUTANEA',   '2025-01-10T09:00:00Z','Pedro Santos','Controle parasitário',    42),
  ('ap8', 'a4', '0022','m6','Vitamina ADE',           5, 'INTRAMUSCULAR','2025-01-28T10:00:00Z','Pedro Santos','Suplementação pós-parto',  0),
  ('ap9', 'a17','0112','m7','Enrofloxacina 10%',     25, 'INTRAMUSCULAR','2025-02-10T09:00:00Z','Dra. Ana',    'Infecção uterina',        14),
  ('ap10','a13','0071','m8','Flunixin Meglumine',     20, 'INTRAMUSCULAR','2025-02-07T10:00:00Z','Dra. Ana',    'Anti-inflamatório pós-parto',5),
  ('ap11','a12','0063','m9','Cálcio EV 23%',        500, 'ORAL',         '2025-01-10T09:00:00Z','Dr. Carlos',  'Hipocalcemia pós-parto',   0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO transacoes (id,tipo,categoria,valor,data,descricao,animal_id) VALUES
  ('t1', 'RECEITA','VENDA_BEZERRO',3200,'2025-01-20T12:00:00Z','Venda bezerro B-155 (Mimosa)',       'a8'),
  ('t2', 'RECEITA','VENDA_BEZERRO',2800,'2025-01-25T12:00:00Z','Venda bezerra B-134 (Pretinha)',     'a14'),
  ('t3', 'DESPESA','MEDICAMENTO',   450,'2025-01-05T12:00:00Z','Reposição Ivermectina 1% — 500mL',  null),
  ('t4', 'DESPESA','VETERINARIO',   800,'2025-02-13T12:00:00Z','Protocolo IATF — Dr. Carlos Mendes',null),
  ('t5', 'DESPESA','RACAO',        1200,'2025-02-01T12:00:00Z','Ração suplementar jan/fev — Lote 2025-A',null),
  ('t6', 'DESPESA','MEDICAMENTO',   320,'2025-02-10T12:00:00Z','Enrofloxacina 10% + Flunixin Meglumine',null),
  ('t7', 'DESPESA','VETERINARIO',   200,'2025-02-07T12:00:00Z','Visita emergência — Dra. Ana Ferreira',null),
  ('t8', 'RECEITA','OUTRO',         500,'2024-12-20T12:00:00Z','Venda esterco orgânico',             null),
  ('t9', 'DESPESA','OUTRO',         350,'2025-01-15T12:00:00Z','Manutenção cercas e instalações',    null),
  ('t10','DESPESA','MEDICAMENTO',   180,'2024-12-10T12:00:00Z','Vitamina ADE — Ceva 1L',             null),
  ('t11','DESPESA','RACAO',         980,'2024-12-01T12:00:00Z','Ração suplementar dez/2024',         null),
  ('t12','RECEITA','VENDA_BEZERRO',2600,'2024-11-15T12:00:00Z','Venda 2 bezerros Lote 2024-A',       null)
ON CONFLICT (id) DO NOTHING;
