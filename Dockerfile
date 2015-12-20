FROM node:4
MAINTAINER Benoit TRAVERS <benoit.travers.fr@gamil.com>

ENV WORKDIR /app

RUN mkdir $WORKDIR

WORKDIR $WORKDIR

ADD . $WORKDIR

RUN npm build

EXPOSE 3000

CMD ["npm", "serve"]
