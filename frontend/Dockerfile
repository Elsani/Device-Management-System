# -------------------------------------------------------------
# FAZA 1: Kompili i React dhe TypeScript (Build Stage)
# -------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------------------------------------------------------------
# FAZA 2: Shërbimi me Nginx Web Server (Ultra i shpejtë)
# -------------------------------------------------------------
FROM nginx:alpine

# Fshij skedarin default të Nginx
RUN rm -rf /usr/share/nginx/html/*

# Kopjo skedarët e gatshëm të React nga Faza 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Kopjo konfigurimin tonë të Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
