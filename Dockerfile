FROM node
WORKDIR /
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD [ "node", "-r", "dotenv/config", "src/server.js", "dotenv_config_path=./config/dev.env" ]