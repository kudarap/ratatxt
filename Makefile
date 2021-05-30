PROJECTNAME=rtxserver

IMAGENAME=kudarap/ratatxt

LDFLAGS="-X main.tag=`cat VERSION` \
		-X main.commit=`git rev-parse HEAD` \
		-X main.built=`date -u +%s`"

# Make is verbose in Linux. Make it silent.
MAKEFLAGS += --silent

all: install ui bundle

install:
	go get ./...

run: generate build
	./rtxapi

generate:
	go generate ./ratatxt

build:
	go build -v -ldflags=$(LDFLAGS) -o rtxapi ./cmd/$(PROJECTNAME)
build-linux:
	CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -v -ldflags=$(LDFLAGS) -o rtxapi_amd64 ./cmd/$(PROJECTNAME)
bundle:
	go build -v -tags ui -ldflags=$(LDFLAGS) -o $(PROJECTNAME) ./cmd/$(PROJECTNAME)
ui:
	cd ./ui && yarn run build:embedded && cd ..

docker-build:
	docker build -t $(IMAGENAME) .
docker-run:
	docker run --rm -p 7200:7200 -p 1883:1883 -p 8080:8080 $(IMAGENAME)