# fast-logistics-automator

## Primeira execução / Rebuild
```
docker compose up --build
```

## Iniciar
```
docker compose up
```

## Encerrar
```
docker compose down
```

## Integrantes do Grupo:
- Danilo Odelon Wagner
- Eduardo Hoffmann do Carmo Silva
- Felipe Alves Bueno
- Pedro Augusto Oliveira

## Dependências do projeto:
Front-end (Next.js):
```
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npx shadcn@latest add card input table dialog dropdown-menu progress sheet -y
npm install sonner next-themes
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Back-end (Rust / Rocket):
```
cargo new backend
cargo add argon2
cargo add dotenvy
cargo add num-traits
cargo add pdf-extract
cargo add regex
cargo add serde_json
cargo add rocket --features json
cargo add serde --features derive
cargo add bigdecimal --features serde
cargo add chrono --features serde
cargo add jsonwebtoken --features rust_crypto
cargo add sqlx --features runtime-tokio,postgres,chrono,uuid,bigdecimal
cargo add tokio --features macros,rt-multi-thread
cargo add uuid --features v4,serde
```