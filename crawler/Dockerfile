FROM node:latest
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /CRAWL
RUN npm install @web/test-runner-puppeteer@0.13.1
RUN whereis chromium
RUN npm install puppeteer
RUN echo 2
RUN npm install path
RUN echo 3
COPY . .
CMD ["node","./crawler.js"]
