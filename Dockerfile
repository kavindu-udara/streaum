FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 mvn -B -q -DskipTests dependency:go-offline
COPY . .
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests package

FROM tomcat:11.0.11-jdk21-temurin
ENV TZ=UTC CATALINA_OPTS="-Xms256m -Xmx512m -Djava.security.egd=file:/dev/./urandom"
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /app/target/*.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080
CMD ["catalina.sh", "run"]
