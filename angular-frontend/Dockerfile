# ---- Build Angular ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

# ---- Serve with Nginx ----
FROM nginx:1.27-alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# ✅ Copy CONTENT of browser folder (not the folder)
COPY --from=build /app/dist/browser/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
