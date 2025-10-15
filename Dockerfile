FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# First copy only the pom.xml to warm up dependency cache
COPY pom.xml ./
# Cache Maven repo between builds to speed up dependency resolution
RUN --mount=type=cache,target=/root/.m2 mvn -B -q -DskipTests dependency:go-offline

# Copy sources and build
COPY . .
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests package

# Runtime stage: deploy the WAR to Tomcat
# Use Tomcat 9 if your app uses javax.servlet.* APIs (common for legacy web.xml apps).
# If your app uses jakarta.servlet.* (Jakarta EE 9+), switch this to tomcat:10.1-jdk21-temurin.
FROM tomcat:11.0.11-jdk21-temurin

# Optional: make container timezone/locale predictable (adjust as needed)
ENV TZ=UTC \
    CATALINA_OPTS="-Xms256m -Xmx512m -Djava.security.egd=file:/dev/./urandom"

# Clean default webapps and deploy our WAR as ROOT (served at /)
RUN rm -rf /usr/local/tomcat/webapps/*
# Find the built WAR (artifactId-version.war) and copy it as ROOT.war
COPY --from=build /app/target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]