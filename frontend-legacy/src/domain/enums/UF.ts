export enum UF {
  AC = "AC",
  AL = "AL",
  AP = "AP",
  AM = "AM",
  BA = "BA",
  CE = "CE",
  DF = "DF",
  ES = "ES",
  GO = "GO",
  MA = "MA",
  MT = "MT",
  MS = "MS",
  MG = "MG",
  PA = "PA",
  PB = "PB",
  PR = "PR",
  PE = "PE",
  PI = "PI",
  RJ = "RJ",
  RN = "RN",
  RS = "RS",
  RO = "RO",
  RR = "RR",
  SC = "SC",
  SP = "SP",
  SE = "SE",
  TO = "TO"
}

interface UFMetadata {
  code: number;
  full_name: string;
  abbreviation: string;
}

const UFInfo: Record<UF, UFMetadata> = {
  [UF.AC]: { code: 12, full_name: "Acre", abbreviation: "AC" },
  [UF.AL]: { code: 27, full_name: "Alagoas", abbreviation: "AL" },
  [UF.AP]: { code: 16, full_name: "Amapá", abbreviation: "AP" },
  [UF.AM]: { code: 13, full_name: "Amazonas", abbreviation: "AM" },
  [UF.BA]: { code: 29, full_name: "Bahia", abbreviation: "BA" },
  [UF.CE]: { code: 23, full_name: "Ceará", abbreviation: "CE" },
  [UF.DF]: { code: 53, full_name: "Distrito Federal", abbreviation: "DF" },
  [UF.ES]: { code: 32, full_name: "Espírito Santo", abbreviation: "ES" },
  [UF.GO]: { code: 52, full_name: "Goiás", abbreviation: "GO" },
  [UF.MA]: { code: 21, full_name: "Maranhão", abbreviation: "MA" },
  [UF.MT]: { code: 51, full_name: "Mato Grosso", abbreviation: "MT" },
  [UF.MS]: { code: 50, full_name: "Mato Grosso do Sul", abbreviation: "MS" },
  [UF.MG]: { code: 31, full_name: "Minas Gerais", abbreviation: "MG" },
  [UF.PA]: { code: 15, full_name: "Pará", abbreviation: "PA" },
  [UF.PB]: { code: 25, full_name: "Paraíba", abbreviation: "PB" },
  [UF.PR]: { code: 41, full_name: "Paraná", abbreviation: "PR" },
  [UF.PE]: { code: 26, full_name: "Pernambuco", abbreviation: "PE" },
  [UF.PI]: { code: 22, full_name: "Piauí", abbreviation: "PI" },
  [UF.RJ]: { code: 33, full_name: "Rio de Janeiro", abbreviation: "RJ" },
  [UF.RN]: { code: 24, full_name: "Rio Grande do Norte", abbreviation: "RN" },
  [UF.RS]: { code: 43, full_name: "Rio Grande do Sul", abbreviation: "RS" },
  [UF.RO]: { code: 11, full_name: "Rondônia", abbreviation: "RO" },
  [UF.RR]: { code: 14, full_name: "Roraima", abbreviation: "RR" },
  [UF.SC]: { code: 42, full_name: "Santa Catarina", abbreviation: "SC" },
  [UF.SP]: { code: 35, full_name: "São Paulo", abbreviation: "SP" },
  [UF.SE]: { code: 28, full_name: "Sergipe", abbreviation: "SE" },
  [UF.TO]: { code: 17, full_name: "Tocantins", abbreviation: "TO" }
};

export const getUFCode = (uf: UF): number => UFInfo[uf].code;
export const getUFFullName = (uf: UF): string => UFInfo[uf].full_name;
export const getUFAbbreviation = (uf: UF): string => UFInfo[uf].abbreviation;