FROM python:3.10.6

ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_ROOT_USER_ACTION=ignore

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

RUN apt-get update 

RUN apt-get install -y nodejs libgl1 libglib2.0-0 gcc

RUN node --version

RUN pip install imaginAIry

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Pre-install model for editing images
RUN aimg edit "./public/image.jpg" "turn into night" --steps 1

CMD ["npm", "start"]

