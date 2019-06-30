FROM node:8
#Note that, rather than copying the entire working directory, we are only copying the package.json file. This allows us to take advantage of cached Docker layers. Furthermore, the npm ci command, specified in the comments, helps provide faster, reliable, reproducible builds for production environments. 
COPY "./package.json" .
RUN yarn
RUN
COPY "./compiled-code/server" "./compiled-code/server"
COPY "./dist" "./dist"
EXPOSE 4444 69
CMD ["node", "webSocketServer.js"]