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

#
# FOR TEST
#

test-course:
	jest -- --watchAll --verbose --runInBand --coverage src/modules/course/course.test.ts

test-course-authorization:
	jest -- --watchAll --verbose --runInBand --coverage src/modules/course/authorization/course.authorization.test.ts

test-category:
	jest -- --watchAll --verbose --runInBand --coverage src/modules/category/category.test.ts

test-category-authorization:
	jest -- --watchAll --verbose --runInBand --coverage src/modules/category/authorization/category.authorization.test.ts

test-lesson:
	jest -- --watchAll --verbose --runInBand --coverage src/modules/lesson/lesson.test.ts

test-lesson-authorization:
	jest -- --watchAll --verbose --runInBand --coverage src/modules/lesson/authorization/lesson.authorization.test.ts

#
# MIGRATION
#
prisma-migrate-dev:
	prisma migrate dev --name $(MIGRATION_NAME)

prisma-migrate-reset:
	prisma migrate reset

prisma-db-pull:
	prisma db pull

prisma-db-push:
	prisma db push

#
# DOCKER
#
docker-run--lms-mysql:
	docker run --name lms-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=lms -d mysql:latest

docker-run--lms-redis:
	docker run --name lms-redis -p 6379:6379 -d redis:latest

docker-run-lms_postgres:
	docker run --name $(CONTAINER_NAME) -p $(PORT) -e POSTGRES_DB=$(POSTGRES_DB) -e POSTGRES_USER=$(POSTGRES_USER) -e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) -d postgres:16.1-alpine3.19

#
#	PLAYGROUND
#
playground:
	ts-node ./src/playground.ts

.PHONY: dockerrun

#
# GIT
#
count-line:
	git ls-files src/ prisma/ Makefile docker-compose.yaml docker-compose-dev.yaml Dockerfile | xargs wc -l
