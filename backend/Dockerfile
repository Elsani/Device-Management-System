# -------------------------------------------------------------
# FAZA 1: Ndërtimi i Aplikacionit (Build Stage)
# -------------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# Kopjo skedarët e konfigurimit për shpejtësi në Caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Kopjo kodin burimor dhe bëj paketimin në skedar JAR
COPY src ./src
RUN mvn clean package -DskipTests

# -------------------------------------------------------------
# FAZA 2: Mjedisi i Prodhimit (Runtime Stage - Super i lehtë)
# -------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Krijo një përdorues të pasigurt (Non-root user) për arsye sigurie
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Kopjo vetëm skedarin .jar të prodhuar nga Faza 1
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
