import type { CasoArbovirose, Doenca, UnidadeSaude } from "@/types";

// ─── Constantes de bairros e tipos ───────────────────────────────────────────

export const BAIRROS = [
  "Boa Viagem",
  "Casa Amarela",
  "Cordeiro",
  "Boa Vista",
  "Imbiribeira",
  "Afogados",
  "Madalena",
  "Pina",
  "Várzea",
  "Iputinga",
  "Torre",
  "Nova Descoberta",
  "Casa Forte",
  "Encruzilhada",
  "Espinheiro",
];

export const TIPOS_UNIDADE = [
  "UBS",
  "USF",
  "UPA",
  "Hospital",
  "Policlínica",
  "Maternidade",
];

// ─── Utilitários de geração determinística ───────────────────────────────────

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function pickWeighted<T>(items: T[], weights: number[], r: number): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let v = r * total;
  for (let i = 0; i < items.length; i++) {
    v -= weights[i];
    if (v <= 0) return items[i];
  }
  return items[items.length - 1];
}

// ─── Pesos epidemiológicos ────────────────────────────────────────────────────

const PESO_BAIRRO: Record<string, number> = {
  "Boa Viagem":       18,
  "Imbiribeira":      16,
  "Casa Amarela":     11,
  "Cordeiro":          9,
  "Afogados":          9,
  "Nova Descoberta":   8,
  "Várzea":            7,
  "Madalena":          6,
  "Iputinga":          6,
  "Pina":              5,
  "Boa Vista":         4,
  "Torre":             4,
  "Encruzilhada":      3,
  "Casa Forte":        2,
  "Espinheiro":        2,
};

// Peso sazonal por mês — pico em abril/maio (semana epidemiológica típica do Recife)
const PESO_MES_BASE    = [3,  4,  7, 10, 12, 11,  8,  5,  3,  2,  2,  3];
const PESO_MES_HISTORICO = [3, 5,  9, 14, 12,  8,  5,  4,  3,  2,  2,  3];

// ─── Gerador genérico de casos por ano ───────────────────────────────────────

function gerarCasosAno(
  ano: number,
  total: number,
  seed: number,
  pesoMes: number[],
): CasoArbovirose[] {
  const rand = rng(seed);
  const doencas: Doenca[] = ["Dengue", "Zika", "Chikungunya"];
  const pesoDoenca = [65, 20, 15];
  const pesosBairro = BAIRROS.map((b) => PESO_BAIRRO[b] ?? 1);
  const meses = Array.from({ length: 12 }, (_, k) => k + 1);

  const casos: CasoArbovirose[] = [];
  for (let i = 0; i < total; i++) {
    casos.push({
      id:     `hist-${ano}-${i}`,
      doenca: pickWeighted(doencas, pesoDoenca,  rand()),
      bairro: pickWeighted(BAIRROS, pesosBairro, rand()),
      ano,
      mes:    pickWeighted(meses,   pesoMes,     rand()),
    });
  }
  return casos;
}

// ─── Unidades de saúde (mock) ─────────────────────────────────────────────────

const rand = rng(42);

const NOMES_UNIDADES: { nome: string; tipo: string; bairro: string }[] = [
  { nome: "Hospital da Restauração",        tipo: "Hospital",    bairro: "Boa Vista"       },
  { nome: "Hospital Barão de Lucena",        tipo: "Hospital",    bairro: "Iputinga"        },
  { nome: "Hospital Getúlio Vargas",         tipo: "Hospital",    bairro: "Cordeiro"        },
  { nome: "Hospital Agamenon Magalhães",     tipo: "Hospital",    bairro: "Encruzilhada"    },
  { nome: "UPA Nova Descoberta",             tipo: "UPA",         bairro: "Nova Descoberta" },
  { nome: "UPA Imbiribeira",                 tipo: "UPA",         bairro: "Imbiribeira"     },
  { nome: "UPA Torrões",                     tipo: "UPA",         bairro: "Madalena"        },
  { nome: "UPA Boa Viagem",                  tipo: "UPA",         bairro: "Boa Viagem"      },
  { nome: "Policlínica Lessa de Andrade",    tipo: "Policlínica", bairro: "Madalena"        },
  { nome: "Policlínica Albert Sabin",        tipo: "Policlínica", bairro: "Casa Amarela"    },
  { nome: "Policlínica Amaury Coutinho",     tipo: "Policlínica", bairro: "Afogados"        },
  { nome: "Maternidade Bandeira Filho",      tipo: "Maternidade", bairro: "Afogados"        },
  { nome: "Maternidade Professor Barros Lima", tipo: "Maternidade", bairro: "Casa Amarela" },
  { nome: "USF Vila Brasil",                 tipo: "USF",         bairro: "Pina"            },
  { nome: "USF Cordeiro",                    tipo: "USF",         bairro: "Cordeiro"        },
  { nome: "USF Várzea",                      tipo: "USF",         bairro: "Várzea"          },
  { nome: "USF Iputinga",                    tipo: "USF",         bairro: "Iputinga"        },
  { nome: "USF Casa Forte",                  tipo: "USF",         bairro: "Casa Forte"      },
  { nome: "USF Espinheiro",                  tipo: "USF",         bairro: "Espinheiro"      },
  { nome: "USF Torre",                       tipo: "USF",         bairro: "Torre"           },
  { nome: "USF Boa Viagem II",               tipo: "USF",         bairro: "Boa Viagem"      },
  { nome: "USF Imbiribeira",                 tipo: "USF",         bairro: "Imbiribeira"     },
  { nome: "UBS Encruzilhada",                tipo: "UBS",         bairro: "Encruzilhada"    },
  { nome: "UBS Madalena",                    tipo: "UBS",         bairro: "Madalena"        },
  { nome: "UBS Boa Vista",                   tipo: "UBS",         bairro: "Boa Vista"       },
  { nome: "UBS Pina",                        tipo: "UBS",         bairro: "Pina"            },
  { nome: "UBS Casa Amarela",                tipo: "UBS",         bairro: "Casa Amarela"    },
  { nome: "UBS Nova Descoberta",             tipo: "UBS",         bairro: "Nova Descoberta" },
  { nome: "UBS Afogados",                    tipo: "UBS",         bairro: "Afogados"        },
  { nome: "UBS Torre",                       tipo: "UBS",         bairro: "Torre"           },
];

const RUAS = [
  "Av. Boa Viagem",
  "Rua do Sol",
  "Av. Caxangá",
  "Av. Conde da Boa Vista",
  "Rua da Aurora",
  "Av. Domingos Ferreira",
  "Rua Real da Torre",
  "Av. Norte",
  "Av. Recife",
  "Rua Imperial",
];

export const UNIDADES_SAUDE: UnidadeSaude[] = NOMES_UNIDADES.map((u, i) => ({
  id:       `un-${i + 1}`,
  nome:     u.nome,
  tipo:     u.tipo,
  bairro:   u.bairro,
  endereco: `${RUAS[Math.floor(rand() * RUAS.length)]}, ${Math.floor(rand() * 4000 + 100)}`,
  telefone: `(81) 3${Math.floor(rand() * 900 + 100)}-${Math.floor(rand() * 9000 + 1000)}`,
}));

// ─── Casos por ano ────────────────────────────────────────────────────────────

// 2023: ano de surto moderado
export const CASOS_2023: CasoArbovirose[] = gerarCasosAno(
  2023, 2800, 2023, PESO_MES_HISTORICO
);

// 2024: ano de surto alto (epidemia real de dengue no Brasil)
export const CASOS_2024: CasoArbovirose[] = gerarCasosAno(
  2024, 4200, 2024, PESO_MES_HISTORICO
);

// 2025: fallback mock caso a API esteja fora (usado como placeholderData)
export const CASOS: CasoArbovirose[] = gerarCasosAno(
  2025, 1500, 42, PESO_MES_BASE
);