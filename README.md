# Ratatxt
Enable SMS API on android devices.

## Overview
Simple service that enables android devices to be use as SMS API to send and receive SMS.
Uses MQTT(Message Queuing Telemetry Transport) to send command to devices and keeps connection from the server.

DO NOT USE IN PRODUCTION. MQTT broker is insecure and android client is unstable but you can use it for fun.

## Features
- Send and receive SMS
- Deployable on local and cloud server

## Requirements
- Local or cloud server with Docker
- Android device (Nougat 7.1 and below)

## Setup
### 1. Run and install server using docker
```shell
docker run -p 8080:8080 -p 7100:7100 -p 1883:1883 kudarap/ratatxt
```
- Console UI on http://localhost:8080
- REST API on http://localhost:7100
- MQTT broker on tcp://localhost:1883

If you are running the server on cloud, open up the ports on public network. 

### 2. Download and install android app
*Warning: Only tested the app on Android Nougat 7.1*
- Download debug APK from https://github.com/kudarap/ratatxt-android and install to device.
- Login your credentials on the app.
- Select a device available.
- Start receiver service to receive messages.
- Start sender service to send messages.

## Usage
### Authentication
- Go to console http://localhost:8080/appkeys and create an appkey.
- Copy the appkey token to authenticate requests.
```shell
# sample authenticated request, replace the token with your own.
curl http://localhost:7100/devices -u 'ak_2ee7d151d5eb6c7bcbd35ec7f47a3bb8c1b61fc9:' 
```

### Send message
```shell
curl http://localhost:7100/outbox \
    -u 'ak_2ee7d151d5eb6c7bcbd35ec7f47a3bb8c1b61fc9:' \
    -X POST -d '{
        "device_id": "c2g185v0eqtq26rmcnj0",
        "address": "09123456789",
        "text": "hello world"
    }'
```

### Receive message
Go to console http://localhost:8080/webhooks and create a webhook.
This will receive a POST request with the message payload.

Sample webhook payload:
```json
{
  "webhook_id": "c2jtmu2h30sl6f6f83c0",
  "payload_url": "https://yourserver.com/webhooks-test",
  "secret": "mysecret123",
  "message": {
    "id": "c2mik6ih30sjldehe1p0",
    "user_id": "c2en1nv0eqtopabpvcrg",
    "device_id": "c2fslnn0eqtq26rmcn2g",
    "kind": 10,
    "status": 110,
    "address": "09123456789",
    "text": "hello world",
    "timestamp": 1621091609,
    "retry_count": 0,
    "created_at": "2021-05-26T00:47:22.067722715+08:00",
    "updated_at": "2021-05-26T00:47:22.067722715+08:00",
    "device": {
      "id": "c2fslnn0eqtq26rmcn2g",
      "user_id": "c2en1nv0eqtopabpvcrg",
      "name": "My device",
      "address": "09000000001",
      "status": 20,
      "last_active": null,
      "created_at": "2021-05-15T13:21:34.051937862Z",
      "updated_at": "2021-05-15T13:21:34.051937862Z"
    }
  }
}
```

### Send pin code
This sample application that generates code with expiration and send to destination address.
```shell
# request
curl http://localhost:7100/smsguard \
    -u 'ak_2ee7d151d5eb6c7bcbd35ec7f47a3bb8c1b61fc9:' \
    -X POST -d '{
        "device_id": "c2g185v0eqtq26rmcnj0",
        "address": "09123456789",
        "duration_min": 5
    }'

# response
{
    "code": "XJE1K",
    "expiration": "2021-05-26T01:17:16.22595439+08:00"
}
```

To check the validity of the code.
```shell
# request
curl http://localhost:7100/smsguard/XJE1K \
  -u 'ak_2ee7d151d5eb6c7bcbd35ec7f47a3bb8c1b61fc9:' 
  
# response
{
    "is_valid": true
}
```
