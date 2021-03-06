SHELL = /bin/bash

Dockerfile:
	@find . -maxdepth 2 -type f -name 'Dockerfile.template' -exec bash -c 'npx dockerfile-template -d BALENA_MACHINE_NAME="intel-nuc" -f {} > `dirname {}`/Dockerfile' \;

local: Dockerfile
	@ln -sf ./compose/generic-x86.yml ./docker-compose.yml
ifndef DRY
	@docker-compose build $(SERVICES)
	@docker-compose up $(SERVICES)
endif

balena:
	@ln -sf ./compose/balena.yml ./docker-compose.yml
ifndef DRY
ifdef PUSH
	@balena push $(PUSH)
else
	$(error To push to balena one needs to set PUSH=applicationName)
endif
endif

clean:
	@docker-compose down
	@find . -maxdepth 2 -type f -name 'Dockerfile' -exec rm {} +
	@rm docker-compose.yml


.PHONY: build-docker-image test enter code-check clean

.DEFAULT_GOAL = balena
