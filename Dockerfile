# 🔨 Builder Stage
FROM node:20-slim AS builder
WORKDIR /app

# Install build tools
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install deps (including optional ones) + required native binaries
RUN npm install --legacy-peer-deps --include=optional \
  && npm install lightningcss-linux-x64-gnu @tailwindcss/oxide-linux-x64-gnu

# Copy remaining project files
COPY . .

# Force WASM fallback just in case
ENV LIGHTNINGCSS_FORCE_WASM=true

# Build the app
RUN npm run build

# 🚀 Runtime Stage
FROM node:20-slim AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
