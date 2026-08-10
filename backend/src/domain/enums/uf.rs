use core::fmt;
use std::str::FromStr;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Uf {
    AC,
    AL,
    AP,
    AM,
    BA,
    CE,
    DF,
    ES,
    GO,
    MA,
    MT,
    MS,
    MG,
    PA,
    PB,
    PR,
    PE,
    PI,
    RJ,
    RN,
    RS,
    RO,
    RR,
    SC,
    SP,
    SE,
    TO,
}

impl Uf {
    pub const fn code(&self) -> u8 {
        match self {
            Uf::AC => 12,
            Uf::AL => 27,
            Uf::AP => 16,
            Uf::AM => 13,
            Uf::BA => 29,
            Uf::CE => 23,
            Uf::DF => 53,
            Uf::ES => 32,
            Uf::GO => 52,
            Uf::MA => 21,
            Uf::MT => 51,
            Uf::MS => 50,
            Uf::MG => 31,
            Uf::PA => 15,
            Uf::PB => 25,
            Uf::PR => 41,
            Uf::PE => 26,
            Uf::PI => 22,
            Uf::RJ => 33,
            Uf::RN => 24,
            Uf::RS => 43,
            Uf::RO => 11,
            Uf::RR => 14,
            Uf::SC => 42,
            Uf::SP => 35,
            Uf::SE => 28,
            Uf::TO => 17,
        }
    }

    pub const fn full_name(&self) -> &'static str {
        match self {
            Uf::AC => "Acre",
            Uf::AL => "Alagoas",
            Uf::AP => "Amapá",
            Uf::AM => "Amazonas",
            Uf::BA => "Bahia",
            Uf::CE => "Ceará",
            Uf::DF => "Distrito Federal",
            Uf::ES => "Espírito Santo",
            Uf::GO => "Goiás",
            Uf::MA => "Maranhão",
            Uf::MT => "Mato Grosso",
            Uf::MS => "Mato Grosso do Sul",
            Uf::MG => "Minas Gerais",
            Uf::PA => "Pará",
            Uf::PB => "Paraíba",
            Uf::PR => "Paraná",
            Uf::PE => "Pernambuco",
            Uf::PI => "Piauí",
            Uf::RJ => "Rio de Janeiro",
            Uf::RN => "Rio Grande do Norte",
            Uf::RS => "Rio Grande do Sul",
            Uf::RO => "Rondônia",
            Uf::RR => "Roraima",
            Uf::SC => "Santa Catarina",
            Uf::SP => "São Paulo",
            Uf::SE => "Sergipe",
            Uf::TO => "Tocantins",
        }
    }
}

impl FromStr for Uf {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_uppercase().as_str() {
            "AC" => Ok(Uf::AC),
            "AL" => Ok(Uf::AL),
            "AP" => Ok(Uf::AP),
            "AM" => Ok(Uf::AM),
            "BA" => Ok(Uf::BA),
            "CE" => Ok(Uf::CE),
            "DF" => Ok(Uf::DF),
            "ES" => Ok(Uf::ES),
            "GO" => Ok(Uf::GO),
            "MA" => Ok(Uf::MA),
            "MT" => Ok(Uf::MT),
            "MS" => Ok(Uf::MS),
            "MG" => Ok(Uf::MG),
            "PA" => Ok(Uf::PA),
            "PB" => Ok(Uf::PB),
            "PR" => Ok(Uf::PR),
            "PE" => Ok(Uf::PE),
            "PI" => Ok(Uf::PI),
            "RJ" => Ok(Uf::RJ),
            "RN" => Ok(Uf::RN),
            "RS" => Ok(Uf::RS),
            "RO" => Ok(Uf::RO),
            "RR" => Ok(Uf::RR),
            "SC" => Ok(Uf::SC),
            "SP" => Ok(Uf::SP),
            "SE" => Ok(Uf::SE),
            "TO" => Ok(Uf::TO),
            _ => Err(()),
        }
    }
}

impl std::fmt::Display for Uf {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Uf::AC => write!(f, "AC"),
            Uf::AL => write!(f, "AL"),
            Uf::AP => write!(f, "AP"),
            Uf::AM => write!(f, "AM"),
            Uf::BA => write!(f, "BA"),
            Uf::CE => write!(f, "CE"),
            Uf::DF => write!(f, "DF"),
            Uf::ES => write!(f, "ES"),
            Uf::GO => write!(f, "GO"),
            Uf::MA => write!(f, "MA"),
            Uf::MT => write!(f, "MT"),
            Uf::MS => write!(f, "MS"),
            Uf::MG => write!(f, "MG"),
            Uf::PA => write!(f, "PA"),
            Uf::PB => write!(f, "PB"),
            Uf::PR => write!(f, "PR"),
            Uf::PE => write!(f, "PE"),
            Uf::PI => write!(f, "PI"),
            Uf::RJ => write!(f, "RJ"),
            Uf::RN => write!(f, "RN"),
            Uf::RS => write!(f, "RS"),
            Uf::RO => write!(f, "RO"),
            Uf::RR => write!(f, "RR"),
            Uf::SC => write!(f, "SC"),
            Uf::SP => write!(f, "SP"),
            Uf::SE => write!(f, "SE"),
            Uf::TO => write!(f, "TO"),
        }
    }
}
