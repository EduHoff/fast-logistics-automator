use backend::api;

#[macro_use]
extern crate rocket;

#[launch]
fn rocket() -> _ {
    api::build_rocket()
}

//tree . -I "public|node_modules|venv|__pycache__|target"
