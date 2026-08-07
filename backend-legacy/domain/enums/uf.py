from enum import Enum

class UF(Enum):
    AC = (12, "Acre", "AC")
    AL = (27, "Alagoas", "AL")
    AP = (16, "Amapá", "AP")
    AM = (13, "Amazonas", "AM")
    BA = (29, "Bahia", "BA")
    CE = (23, "Ceará", "CE")
    DF = (53, "Distrito Federal", "DF")
    ES = (32, "Espírito Santo", "ES")
    GO = (52, "Goiás", "GO")
    MA = (21, "Maranhão", "MA")
    MT = (51, "Mato Grosso", "MT")
    MS = (50, "Mato Grosso do Sul", "MS")
    MG = (31, "Minas Gerais", "MG")
    PA = (15, "Pará", "PA")
    PB = (25, "Paraíba", "PB")
    PR = (41, "Paraná", "PR")
    PE = (26, "Pernambuco", "PE")
    PI = (22, "Piauí", "PI")
    RJ = (33, "Rio de Janeiro", "RJ")
    RN = (24, "Rio Grande do Norte", "RN")
    RS = (43, "Rio Grande do Sul", "RS")
    RO = (11, "Rondônia", "RO")
    RR = (14, "Roraima", "RR")
    SC = (42, "Santa Catarina", "SC")
    SP = (35, "São Paulo", "SP")
    SE = (28, "Sergipe", "SE")
    TO = (17, "Tocantins", "TO")

    @property
    def code(self):
        return self.value[0]

    @property
    def full_name(self):
        return self.value[1]

    @property
    def abbreviation(self):
        return self.value[2]