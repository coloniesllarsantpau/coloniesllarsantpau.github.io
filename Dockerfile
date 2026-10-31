# Imatge només per compilar la web (nuxt generate); no es fa servir en producció.
FROM node:14-bullseye

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

ENV HUSKY=0
WORKDIR /app
