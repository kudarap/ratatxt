# build ui stage
FROM mhart/alpine-node:14 as ui-builder
WORKDIR /code

# download and cache build dependencies
COPY ui/package.json ui/yarn.lock ./
RUN yarn
# copy source code and build
COPY ui/ ./
RUN yarn run build:embedded

# build api stage
FROM golang:1.17-alpine AS builder
WORKDIR /code

RUN apk add --no-cache  --update gcc musl-dev make git
# download and cache go dependencies
COPY go.mod .
COPY go.sum .
RUN go mod download
# copy source code and ui build for embedding
COPY . .
COPY --from=ui-builder /code/build ui/build
# compile server binary
RUN make bundle

# final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates
ENV RTX_SQLITE_ADDR=/data/local.db
ENV RTX_LOG_FILE_OUT=/var/logs/app-out.log
ENV RTX_LOG_FILE_ERR=/var/logs/app-err.log
COPY --from=builder /code/rtxserver .

ENTRYPOINT ./rtxserver
LABEL Name=ratatxt Version=0.14.0
# Ports represents API, MQTT, and UI respectively
EXPOSE 7100 1883 8080
