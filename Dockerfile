# all thia does is run tests and package it up, then
# export to local machine

FROM node:8
ADD lambda /myDir
ADD models /myDir

WORKDIR /myDir/lambda/custom
RUN npm install
RUN npm test

WORKDIR /
RUN tar -zcf myThing.tar.gz /myDir

CMD ["cp", "myThing.tar.gz", "outputDir"]

# then in the terminal from this locn:
    # docker build -t myNewImage
    # docker run -v ~/code-stuff/theHouse/outputDir:/outputDir myNewImage