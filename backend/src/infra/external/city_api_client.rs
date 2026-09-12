use crate::domain::enums::uf::Uf;
use bigdecimal::BigDecimal;
use serde::Deserialize;
use sqlx::PgPool;

#[derive(Debug, Clone, Deserialize)]
pub struct ExternalCityData {
    pub uf: Uf,
    pub nome: String,
    pub distancia_km: i32,
    pub frete_base_truck: BigDecimal,
    pub pedagio_truck: BigDecimal,
    pub frete_base_carreta: BigDecimal,
    pub pedagio_carreta: BigDecimal,
}

#[derive(sqlx::FromRow)]
struct TarifaVeiculoModel {
    tipo_veiculo: String,
    taxa_km: BigDecimal,
    pedagio_km: BigDecimal,
}

#[derive(Deserialize)]
struct NominatimPlace {
    lat: String,
    lon: String,
}

#[derive(Deserialize)]
struct OsrmRoute {
    distance: f64,
}

#[derive(Deserialize)]
struct OsrmResponse {
    routes: Vec<OsrmRoute>,
}

pub struct CityApiClient {
    db_pool: PgPool,
    http_client: reqwest::Client,
}

impl CityApiClient {
    pub fn new(db_pool: PgPool) -> Self {
        let http_client = reqwest::Client::builder()
            .user_agent("SistemaLogisticaRust/1.0 (contato@suaempresa.com.br)")
            .build()
            .unwrap_or_default();

        Self {
            db_pool,
            http_client,
        }
    }

    pub async fn fetch_city(
        &self,
        city_name: &str,
        uf: Uf,
    ) -> Result<Option<ExternalCityData>, String> {
        let Some(distancia_km) = self.get_distance_from_maps_api(city_name, uf).await? else {
            return Ok(None);
        };

        let tarifas = sqlx::query_as::<_, TarifaVeiculoModel>(
            "SELECT tipo_veiculo, taxa_km, pedagio_km FROM public.tarifas_veiculo",
        )
        .fetch_all(&self.db_pool)
        .await
        .map_err(|e| format!("Failed to fetch vehicle rates from database: {e}"))?;

        let truck_tarifa = tarifas
            .iter()
            .find(|t| t.tipo_veiculo == "truck")
            .ok_or_else(|| {
                "Rate for 'truck' not found in tarifas_veiculo table".to_string()
            })?;

        let carreta_tarifa = tarifas
            .iter()
            .find(|t| t.tipo_veiculo == "carreta")
            .ok_or_else(|| {
                "Rate for 'carreta' not found in tarifas_veiculo table".to_string()
            })?;

        let dist_bd = BigDecimal::from(distancia_km);

        let frete_base_truck = &dist_bd * &truck_tarifa.taxa_km;
        let pedagio_truck = &dist_bd * &truck_tarifa.pedagio_km;
        let frete_base_carreta = &dist_bd * &carreta_tarifa.taxa_km;
        let pedagio_carreta = &dist_bd * &carreta_tarifa.pedagio_km;

        Ok(Some(ExternalCityData {
            uf,
            nome: city_name.to_uppercase(),
            distancia_km,
            frete_base_truck,
            pedagio_truck,
            frete_base_carreta,
            pedagio_carreta,
        }))
    }

    async fn get_distance_from_maps_api(
        &self,
        destination_city: &str,
        destination_uf: Uf,
    ) -> Result<Option<i32>, String> {
        const ORIGIN_LON: &str = "-51.1596";
        const ORIGIN_LAT: &str = "-23.3103";

        let nominatim_url = format!(
            "https://nominatim.openstreetmap.org/search?city={}&state={}&country=Brazil&format=json",
            urlencoding::encode(destination_city),
            destination_uf
        );

        let places: Vec<NominatimPlace> = self
            .http_client
            .get(&nominatim_url)
            .send()
            .await
            .map_err(|e| format!("Nominatim API request failed: {e}"))?
            .json()
            .await
            .map_err(|e| format!("Failed to parse Nominatim JSON response: {e}"))?;

        let Some(dest_place) = places.first() else {
            return Ok(None);
        };

        let osrm_url = format!(
            "http://router.project-osrm.org/route/v1/driving/{},{};{},{}?overview=false",
            ORIGIN_LON, ORIGIN_LAT, dest_place.lon, dest_place.lat
        );

        let osrm_res: OsrmResponse = self
            .http_client
            .get(&osrm_url)
            .send()
            .await
            .map_err(|e| format!("OSRM API request failed: {e}"))?
            .json()
            .await
            .map_err(|e| format!("Failed to parse OSRM JSON response: {e}"))?;

        if let Some(route) = osrm_res.routes.first() {
            let km_f64 = (route.distance / 1000.0).round();

            let distancia_km: i32 = km_f64
                .clamp(0.0, f64::from(i32::MAX))
                .to_string()
                .parse()
                .map_err(|e| format!("Failed to convert calculated distance to i32: {e}"))?;

            Ok(Some(distancia_km))
        } else {
            Ok(None)
        }
    }
}
