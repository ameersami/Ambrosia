FROM node:11-slim

# Set working dir
RUN mkdir /app
WORKDIR /app

# Copy files and remove node_modules dir if accidently copied
copy . /app
RUN rm -rf ./node_modules

# Install deps
RUN npm install yarn -g
RUN yarn install

#Expose ports
EXPOSE 4000

ENTRYPOINT ["yarn", "start"]
