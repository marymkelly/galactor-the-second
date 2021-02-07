FROM node
WORKDIR /
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD [ "node", "src/server.js"]