// Central mock dataset — all pages reference this file

export const veterinarios = [
  { id: "v1", nome: "Dr. Carlos Mendes",   crmv: "CRMV/MG-12345", telefone: "(34) 99812-3456", email: "carlos.mendes@vet.com", especialidade: "Reprodução Bovina", ativo: true },
  { id: "v2", nome: "Dra. Ana Ferreira",   crmv: "CRMV/MG-67890", telefone: "(34) 99745-6789", email: "ana.ferreira@vet.com",  especialidade: "Clínica de Bovinos",  ativo: true },
  { id: "v3", nome: "Dr. Roberto Lima",    crmv: "CRMV/MG-11223", telefone: "(34) 98823-4567", email: "roberto.lima@vet.com",  especialidade: "Saúde do Rebanho",    ativo: false },
]

export const encarregados = [
  { id: "e1", nome: "João Silva",    cargo: "ENCARREGADO", telefone: "(34) 99901-2345", lotes: ["Lote 2025-A", "Lote 2025-B"], ativo: true },
  { id: "e2", nome: "Pedro Santos",  cargo: "VAQUEIRO",    telefone: "(34) 99723-4567", lotes: ["Lote 2025-A"],                ativo: true },
  { id: "e3", nome: "Maria Oliveira",cargo: "GERENTE",     telefone: "(34) 99834-5678", lotes: ["Lote 2025-A","Lote 2025-B","Lote 2024-A"], ativo: true },
  { id: "e4", nome: "Lucas Alves",   cargo: "VAQUEIRO",    telefone: "(34) 99645-6789", lotes: ["Lote 2025-B"],                ativo: true },
]

export const lotes = [
  {
    id: "l1", nome: "Lote 2025-A", tipo: "VACA_CRIA", status: "PARTO",
    dataAbertura: new Date(2024, 7, 1), dataFechamento: new Date(2025, 5, 30),
    touro: "Imperador 450",
    totalVacas: 50, gestantes: 38, paridasNoMes: 8, bezerrosVivos: 8, desmamados: 0,
    encarregados: ["João Silva", "Pedro Santos"],
  },
  {
    id: "l2", nome: "Lote 2025-B", tipo: "VACA_CRIA", status: "EM_MONTA",
    dataAbertura: new Date(2025, 0, 15), dataFechamento: new Date(2025, 5, 30),
    touro: "Brutus 520",
    totalVacas: 48, gestantes: 0, paridasNoMes: 0, bezerrosVivos: 0, desmamados: 0,
    encarregados: ["João Silva", "Lucas Alves"],
  },
  {
    id: "l3", nome: "Lote 2024-A", tipo: "VACA_CRIA", status: "ENCERRADO",
    dataAbertura: new Date(2023, 7, 1), dataFechamento: new Date(2024, 5, 30),
    touro: "Sultão 490",
    totalVacas: 50, gestantes: 0, paridasNoMes: 0, bezerrosVivos: 48, desmamados: 48,
    encarregados: ["Maria Oliveira"],
  },
]

export const animais = [
  { id: "a1",  idEtiqueta: "0011", nome: null,       loteId: "l1", lote: "Lote 2025-A", status: "INSEMINADA",    dataNascimento: new Date(2019, 2, 14), dataUltimoParto: new Date(2024, 1, 10), dataPartoEstimado: new Date(2025, 2, 18), emLactacao: false },
  { id: "a2",  idEtiqueta: "0014", nome: null,       loteId: "l1", lote: "Lote 2025-A", status: "LACTANDO",      dataNascimento: new Date(2018, 5, 22), dataUltimoParto: new Date(2025, 1, 3),  dataPartoEstimado: null,                  emLactacao: true  },
  { id: "a3",  idEtiqueta: "0018", nome: null,       loteId: "l1", lote: "Lote 2025-A", status: "GESTANTE",      dataNascimento: new Date(2020, 0, 8),  dataUltimoParto: new Date(2024, 1, 18), dataPartoEstimado: new Date(2025, 1, 21), emLactacao: false },
  { id: "a4",  idEtiqueta: "0022", nome: null,       loteId: "l1", lote: "Lote 2025-A", status: "LACTANDO",      dataNascimento: new Date(2019, 8, 5),  dataUltimoParto: new Date(2025, 0, 28), dataPartoEstimado: null,                  emLactacao: true  },
  { id: "a5",  idEtiqueta: "0029", nome: "Boneca",   loteId: "l1", lote: "Lote 2025-A", status: "INSEMINADA",    dataNascimento: new Date(2018, 3, 17), dataUltimoParto: new Date(2024, 0, 15), dataPartoEstimado: new Date(2025, 2, 5),  emLactacao: false },
  { id: "a6",  idEtiqueta: "0031", nome: null,       loteId: "l1", lote: "Lote 2025-A", status: "GESTANTE",      dataNascimento: new Date(2021, 1, 3),  dataUltimoParto: new Date(2024, 2, 1),  dataPartoEstimado: new Date(2025, 2, 1),  emLactacao: false },
  { id: "a7",  idEtiqueta: "0036", nome: null,       loteId: "l1", lote: "Lote 2025-A", status: "LACTANDO",      dataNascimento: new Date(2019, 11, 20),dataUltimoParto: new Date(2025, 0, 16), dataPartoEstimado: null,                  emLactacao: true  },
  { id: "a8",  idEtiqueta: "0042", nome: "Mimosa",   loteId: "l1", lote: "Lote 2025-A", status: "GESTANTE",      dataNascimento: new Date(2018, 3, 12), dataUltimoParto: new Date(2024, 1, 5),  dataPartoEstimado: new Date(2025, 1, 18), emLactacao: false },
  { id: "a9",  idEtiqueta: "0047", nome: null,       loteId: "l1", lote: "Lote 2025-A", status: "INSEMINADA",    dataNascimento: new Date(2020, 6, 9),  dataUltimoParto: new Date(2024, 0, 22), dataPartoEstimado: new Date(2025, 2, 12), emLactacao: false },
  { id: "a10", idEtiqueta: "0051", nome: null,       loteId: "l1", lote: "Lote 2025-A", status: "LACTANDO",      dataNascimento: new Date(2019, 4, 30), dataUltimoParto: new Date(2025, 0, 20), dataPartoEstimado: null,                  emLactacao: true  },
  { id: "a11", idEtiqueta: "0055", nome: null,       loteId: "l2", lote: "Lote 2025-B", status: "EM_PROTOCOLO",  dataNascimento: new Date(2020, 2, 15), dataUltimoParto: new Date(2024, 2, 8),  dataPartoEstimado: null,                  emLactacao: false },
  { id: "a12", idEtiqueta: "0063", nome: null,       loteId: "l1", lote: "Lote 2025-A", status: "LACTANDO",      dataNascimento: new Date(2018, 10, 7), dataUltimoParto: new Date(2025, 0, 10), dataPartoEstimado: null,                  emLactacao: true  },
  { id: "a13", idEtiqueta: "0071", nome: null,       loteId: "l1", lote: "Lote 2025-A", status: "LACTANDO",      dataNascimento: new Date(2019, 7, 14), dataUltimoParto: new Date(2025, 1, 7),  dataPartoEstimado: null,                  emLactacao: true  },
  { id: "a14", idEtiqueta: "0077", nome: "Pretinha", loteId: "l1", lote: "Lote 2025-A", status: "GESTANTE",      dataNascimento: new Date(2020, 9, 25), dataUltimoParto: new Date(2024, 2, 14), dataPartoEstimado: new Date(2025, 1, 25), emLactacao: false },
  { id: "a15", idEtiqueta: "0088", nome: "Estrela",  loteId: "l2", lote: "Lote 2025-B", status: "EM_PROTOCOLO",  dataNascimento: new Date(2019, 5, 3),  dataUltimoParto: new Date(2024, 3, 12), dataPartoEstimado: null,                  emLactacao: false },
  { id: "a16", idEtiqueta: "0103", nome: null,       loteId: "l2", lote: "Lote 2025-B", status: "EM_PROTOCOLO",  dataNascimento: new Date(2021, 0, 19), dataUltimoParto: new Date(2024, 3, 5),  dataPartoEstimado: null,                  emLactacao: false },
  { id: "a17", idEtiqueta: "0112", nome: "Negra",    loteId: "l2", lote: "Lote 2025-B", status: "VAZIA",         dataNascimento: new Date(2020, 4, 11), dataUltimoParto: new Date(2024, 2, 20), dataPartoEstimado: null,                  emLactacao: false },
  { id: "a18", idEtiqueta: "0128", nome: null,       loteId: "l2", lote: "Lote 2025-B", status: "VAZIA",         dataNascimento: new Date(2022, 3, 7),  dataUltimoParto: null,                  dataPartoEstimado: null,                  emLactacao: false },
]

export const bezerros = [
  { id: "b1", idEtiqueta: "B-201", maeId: "a2",  maeEtiqueta: "0014", sexo: "M", dataNascimento: new Date(2025, 1, 3),  pesoNascimento: 34, pesoAtual: 42,  diasVida: 12,  dataDesmameEstimada: new Date(2025, 7, 31), status: "MAMANDO"  },
  { id: "b2", idEtiqueta: "B-202", maeId: "a4",  maeEtiqueta: "0022", sexo: "F", dataNascimento: new Date(2025, 0, 28), pesoNascimento: 32, pesoAtual: 45,  diasVida: 18,  dataDesmameEstimada: new Date(2025, 7, 26), status: "MAMANDO"  },
  { id: "b3", idEtiqueta: "B-203", maeId: "a7",  maeEtiqueta: "0036", sexo: "M", dataNascimento: new Date(2025, 0, 16), pesoNascimento: 36, pesoAtual: 58,  diasVida: 30,  dataDesmameEstimada: new Date(2025, 7, 14), status: "MAMANDO"  },
  { id: "b4", idEtiqueta: "B-204", maeId: "a10", maeEtiqueta: "0051", sexo: "F", dataNascimento: new Date(2025, 0, 4),  pesoNascimento: 33, pesoAtual: 71,  diasVida: 42,  dataDesmameEstimada: new Date(2025, 7, 2),  status: "MAMANDO"  },
  { id: "b5", idEtiqueta: "B-205", maeId: "a12", maeEtiqueta: "0063", sexo: "M", dataNascimento: new Date(2025, 0, 1),  pesoNascimento: 35, pesoAtual: 74,  diasVida: 45,  dataDesmameEstimada: new Date(2025, 6, 30), status: "MAMANDO"  },
  { id: "b6", idEtiqueta: "B-206", maeId: "a13", maeEtiqueta: "0071", sexo: "F", dataNascimento: new Date(2025, 1, 7),  pesoNascimento: 31, pesoAtual: 37,  diasVida: 8,   dataDesmameEstimada: new Date(2025, 8, 5),  status: "MAMANDO"  },
  { id: "b7", idEtiqueta: "B-155", maeId: "a8",  maeEtiqueta: "0042", sexo: "M", dataNascimento: new Date(2024, 2, 10), pesoNascimento: 37, pesoAtual: 182, diasVida: 341, dataDesmameEstimada: new Date(2024, 8, 5),  status: "DESMAMADO"},
  { id: "b8", idEtiqueta: "B-134", maeId: "a14", maeEtiqueta: "0077", sexo: "F", dataNascimento: new Date(2024, 2, 18), pesoNascimento: 33, pesoAtual: 178, diasVida: 333, dataDesmameEstimada: new Date(2024, 8, 13), status: "DESMAMADO"},
]

export const eventosReprodutivos = [
  { id: "er1",  animalId: "a8",  etiqueta: "0042", tipo: "IMPLANTE_HORMONAL",   data: new Date(2024, 7, 18), veterinarioId: "v1", resultado: null,       obs: null },
  { id: "er2",  animalId: "a8",  etiqueta: "0042", tipo: "INSEMINACAO_IATF",    data: new Date(2024, 7, 20), veterinarioId: "v1", resultado: null,       obs: "Sêmen touro A-14" },
  { id: "er3",  animalId: "a8",  etiqueta: "0042", tipo: "DIAGNOSTICO_PRENHEZ", data: new Date(2024, 8, 18), veterinarioId: "v2", resultado: "POSITIVO", obs: null },
  { id: "er4",  animalId: "a8",  etiqueta: "0042", tipo: "PARTO",               data: new Date(2024, 1, 5),  veterinarioId: null, resultado: null,       obs: "Parto normal. Bezerro B-155 M 37kg" },
  { id: "er5",  animalId: "a11", etiqueta: "0055", tipo: "IMPLANTE_HORMONAL",   data: new Date(2025, 1, 13), veterinarioId: "v1", resultado: null,       obs: null },
  { id: "er6",  animalId: "a11", etiqueta: "0055", tipo: "INSEMINACAO_IATF",    data: new Date(2025, 1, 15), veterinarioId: "v1", resultado: null,       obs: null },
  { id: "er7",  animalId: "a15", etiqueta: "0088", tipo: "IMPLANTE_HORMONAL",   data: new Date(2025, 1, 15), veterinarioId: "v1", resultado: null,       obs: null },
  { id: "er8",  animalId: "a16", etiqueta: "0103", tipo: "IMPLANTE_HORMONAL",   data: new Date(2025, 0, 14), veterinarioId: "v1", resultado: null,       obs: null },
  { id: "er9",  animalId: "a16", etiqueta: "0103", tipo: "INSEMINACAO_IATF",    data: new Date(2025, 0, 16), veterinarioId: "v1", resultado: null,       obs: null },
  { id: "er10", animalId: "a2",  etiqueta: "0014", tipo: "PARTO",               data: new Date(2025, 1, 3),  veterinarioId: null, resultado: null,       obs: "Parto normal. Bezerro B-201 M 34kg" },
  { id: "er11", animalId: "a4",  etiqueta: "0022", tipo: "PARTO",               data: new Date(2025, 0, 28), veterinarioId: null, resultado: null,       obs: "Parto normal. Bezerra B-202 F 32kg" },
  { id: "er12", animalId: "a7",  etiqueta: "0036", tipo: "PARTO",               data: new Date(2025, 0, 16), veterinarioId: null, resultado: null,       obs: null },
  { id: "er13", animalId: "a1",  etiqueta: "0011", tipo: "INSEMINACAO_IATF",    data: new Date(2025, 0, 18), veterinarioId: "v1", resultado: null,       obs: null },
  { id: "er14", animalId: "a5",  etiqueta: "0029", tipo: "INSEMINACAO_IATF",    data: new Date(2025, 0, 14), veterinarioId: "v1", resultado: null,       obs: null },
]

export const medicamentos = [
  { id: "m1",  nome: "Ocitocina 10UI",          principioAtivo: "Ocitocina",       tipo: "HORMONIO",        unidade: "mL",  dosePadrao: 5,   estoqueAtual: 2,  estoqueMinimo: 10, validade: new Date(2025, 11, 1),  fornecedor: "Zoetis",     ativo: true },
  { id: "m2",  nome: "Progesterona Dispenser",   principioAtivo: "Progesterona",    tipo: "HORMONIO",        unidade: "un",  dosePadrao: 1,   estoqueAtual: 4,  estoqueMinimo: 10, validade: new Date(2026, 2, 1),   fornecedor: "Ourofino",   ativo: true },
  { id: "m3",  nome: "Cipionato de Estradiol",   principioAtivo: "Estradiol",       tipo: "HORMONIO",        unidade: "mL",  dosePadrao: 1,   estoqueAtual: 8,  estoqueMinimo: 5,  validade: new Date(2025, 2, 5),   fornecedor: "Zoetis",     ativo: true },
  { id: "m4",  nome: "GnRH Lecirelin",           principioAtivo: "Lecirelina",      tipo: "HORMONIO",        unidade: "mL",  dosePadrao: 2,   estoqueAtual: 15, estoqueMinimo: 10, validade: new Date(2026, 5, 1),   fornecedor: "Zoetis",     ativo: true },
  { id: "m5",  nome: "Ivermectina 1%",           principioAtivo: "Ivermectina",     tipo: "ANTIPARASITARIO", unidade: "mL",  dosePadrao: 10,  estoqueAtual: 120,estoqueMinimo: 50, validade: new Date(2026, 8, 1),   fornecedor: "Ceva",       ativo: true },
  { id: "m6",  nome: "Vitamina ADE",             principioAtivo: "Vit. A/D/E",      tipo: "VITAMINA",        unidade: "mL",  dosePadrao: 5,   estoqueAtual: 60, estoqueMinimo: 30, validade: new Date(2026, 1, 1),   fornecedor: "Ceva",       ativo: true },
  { id: "m7",  nome: "Enrofloxacina 10%",        principioAtivo: "Enrofloxacina",   tipo: "ANTIBIOTICO",     unidade: "mL",  dosePadrao: 25,  estoqueAtual: 50, estoqueMinimo: 20, validade: new Date(2026, 4, 1),   fornecedor: "Bayer",      ativo: true },
  { id: "m8",  nome: "Flunixin Meglumine",        principioAtivo: "Flunixin",        tipo: "OUTRO",           unidade: "mL",  dosePadrao: 20,  estoqueAtual: 30, estoqueMinimo: 10, validade: new Date(2025, 10, 1),  fornecedor: "Ourofino",   ativo: true },
  { id: "m9",  nome: "Cálcio EV 23%",            principioAtivo: "Gluconato Ca",    tipo: "VITAMINA",        unidade: "mL",  dosePadrao: 500, estoqueAtual: 5,  estoqueMinimo: 8,  validade: new Date(2026, 0, 1),   fornecedor: "Bravet",     ativo: true },
  { id: "m10", nome: "Oxitetraciclina LA",        principioAtivo: "Oxitetraciclina", tipo: "ANTIBIOTICO",     unidade: "mL",  dosePadrao: 20,  estoqueAtual: 40, estoqueMinimo: 15, validade: new Date(2026, 3, 1),   fornecedor: "Zoetis",     ativo: true },
]

export const aplicacoes = [
  { id: "ap1",  animalId: "a8",  etiqueta: "0042", medicamentoId: "m1", medicamento: "Ocitocina 10UI",        doseAplicada: 5,  via: "INTRAMUSCULAR", data: new Date(2025, 1, 5),  responsavel: "João Silva",    motivo: "Auxílio ao parto",      carenciaDias: 0  },
  { id: "ap2",  animalId: "a2",  etiqueta: "0014", medicamentoId: "m1", medicamento: "Ocitocina 10UI",        doseAplicada: 5,  via: "INTRAMUSCULAR", data: new Date(2025, 1, 3),  responsavel: "João Silva",    motivo: "Auxílio ao parto",      carenciaDias: 0  },
  { id: "ap3",  animalId: "a11", etiqueta: "0055", medicamentoId: "m2", medicamento: "Progesterona Dispenser",doseAplicada: 1,  via: "SUBCUTANEA",    data: new Date(2025, 1, 13), responsavel: "Dr. Carlos",    motivo: "Protocolo IATF",        carenciaDias: 0  },
  { id: "ap4",  animalId: "a15", etiqueta: "0088", medicamentoId: "m2", medicamento: "Progesterona Dispenser",doseAplicada: 1,  via: "SUBCUTANEA",    data: new Date(2025, 1, 15), responsavel: "Dr. Carlos",    motivo: "Protocolo IATF",        carenciaDias: 0  },
  { id: "ap5",  animalId: "a11", etiqueta: "0055", medicamentoId: "m3", medicamento: "Cipionato de Estradiol",doseAplicada: 1,  via: "INTRAMUSCULAR", data: new Date(2025, 1, 13), responsavel: "Dr. Carlos",    motivo: "Protocolo IATF",        carenciaDias: 0  },
  { id: "ap6",  animalId: "a8",  etiqueta: "0042", medicamentoId: "m5", medicamento: "Ivermectina 1%",        doseAplicada: 10, via: "SUBCUTANEA",    data: new Date(2025, 0, 10), responsavel: "Pedro Santos",  motivo: "Controle parasitário",  carenciaDias: 42 },
  { id: "ap7",  animalId: "a14", etiqueta: "0077", medicamentoId: "m5", medicamento: "Ivermectina 1%",        doseAplicada: 10, via: "SUBCUTANEA",    data: new Date(2025, 0, 10), responsavel: "Pedro Santos",  motivo: "Controle parasitário",  carenciaDias: 42 },
  { id: "ap8",  animalId: "a4",  etiqueta: "0022", medicamentoId: "m6", medicamento: "Vitamina ADE",          doseAplicada: 5,  via: "INTRAMUSCULAR", data: new Date(2025, 0, 28), responsavel: "Pedro Santos",  motivo: "Suplementação pós-parto",carenciaDias: 0  },
  { id: "ap9",  animalId: "a17", etiqueta: "0112", medicamentoId: "m7", medicamento: "Enrofloxacina 10%",     doseAplicada: 25, via: "INTRAMUSCULAR", data: new Date(2025, 1, 10), responsavel: "Dra. Ana",      motivo: "Infecção uterina",      carenciaDias: 14 },
  { id: "ap10", animalId: "a13", etiqueta: "0071", medicamentoId: "m8", medicamento: "Flunixin Meglumine",    doseAplicada: 20, via: "INTRAMUSCULAR", data: new Date(2025, 1, 7),  responsavel: "Dra. Ana",      motivo: "Anti-inflamatório pós-parto", carenciaDias: 5 },
  { id: "ap11", animalId: "a12", etiqueta: "0063", medicamentoId: "m9", medicamento: "Cálcio EV 23%",         doseAplicada: 500,via: "ORAL",          data: new Date(2025, 0, 10), responsavel: "Dr. Carlos",    motivo: "Hipocalcemia pós-parto",carenciaDias: 0  },
]

export const protocolosAtivos = [
  {
    id: "p1", animalId: "a11", etiqueta: "0055", nome: null,      lote: "Lote 2025-B",
    etapaAtual: "inseminacao_iatf",
    dataImplante: new Date(2025, 1, 13), dataInseminacao: new Date(2025, 1, 15), dataDiagnostico: new Date(2025, 2, 17),
    veterinario: "Dr. Carlos Mendes",
  },
  {
    id: "p2", animalId: "a15", etiqueta: "0088", nome: "Estrela", lote: "Lote 2025-B",
    etapaAtual: "implante_hormonal",
    dataImplante: new Date(2025, 1, 15), dataInseminacao: new Date(2025, 1, 17), dataDiagnostico: new Date(2025, 2, 19),
    veterinario: "Dr. Carlos Mendes",
  },
  {
    id: "p3", animalId: "a16", etiqueta: "0103", nome: null,      lote: "Lote 2025-B",
    etapaAtual: "aguardando_diagnostico",
    dataImplante: new Date(2025, 0, 14), dataInseminacao: new Date(2025, 0, 16), dataDiagnostico: new Date(2025, 1, 15),
    veterinario: "Dr. Carlos Mendes",
  },
]

// Helpers
export function getAnimalById(id: string) {
  return animais.find(a => a.id === id)
}

export function getBezerrosByMae(maeId: string) {
  return bezerros.filter(b => b.maeId === maeId)
}

export function getEventosByAnimal(animalId: string) {
  return eventosReprodutivos.filter(e => e.animalId === animalId).sort((a, b) => b.data.getTime() - a.data.getTime())
}

export function getAplicacoesByAnimal(animalId: string) {
  return aplicacoes.filter(a => a.animalId === animalId).sort((a, b) => b.data.getTime() - a.data.getTime())
}

export function getLoteById(id: string) {
  return lotes.find(l => l.id === id)
}

export function getAnimaisByLote(loteId: string) {
  return animais.filter(a => a.loteId === loteId)
}
