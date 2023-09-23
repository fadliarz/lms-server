#
# FOR DEVELOPMENT
# 

build-prod:
	docker-compose -f docker-compose.yaml build $(c)
up-prod:
	docker-compose -f docker-compose.yaml up -d $(c)
down-prod:
	docker-compose -f docker-compose.yaml down $(c)

#
# FOR PRODUCTION
# 

build-dev:
	docker-compose -f docker-compose.yaml -f docker-compose-dev.yaml build $(c)
up-dev:
	docker-compose -f docker-compose.yaml -f docker-compose-dev.yaml up -d $(c)
down-dev:
	docker-compose -f docker-compose.yaml -f docker-compose-dev.yaml down $(c)


