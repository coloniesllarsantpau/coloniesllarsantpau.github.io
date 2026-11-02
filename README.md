# llar-sant-pau

Web estàtica de les colònies Llar Sant Pau, generada amb Nuxt 4 i Node 26. Tot es fa amb Docker.

```bash
# compilar: el resultat queda a docs/
$ HOST_UID=$(id -u) HOST_GID=$(id -g) docker compose --profile build run --rm build

# obrir a http://127.0.0.1:8081/
$ docker compose up -d web

# validar de cap a cap
$ scripts/valida.sh
```

Més detalls a `CLAUDE.md`.
