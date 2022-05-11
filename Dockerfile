#get base images from node
FROM node:14.17

#create Directory for react
RUN mkdir /usr/src/app
#set PWD
WORKDIR /usr/src/app

#add node modules Environment Path 
ENV PATH /usr/src/app/node_modules/.bin:$PATH

#copy code to directory container
COPY . /usr/src/app/

#copy package.json to directory container
COPY package.json /usr/src/app/package.json

#install dependencies followed by package.json
RUN npm install

#install npm start
RUN npm install react-scripts -g

#npm start
CMD ["npm", "start"]