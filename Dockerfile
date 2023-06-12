FROM node:slim

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  npm install -g pm2 && \
  rm -rf /var/lib/apt/lists/*

# Répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installation des dépendances du projet
RUN npm install

# Copie des fichiers sources du projet
COPY . .

# Port d'écoute de l'application
EXPOSE 3000

# Commande pour démarrer l'application
CMD [ "pm2-runtime", "start", "server.js" ]