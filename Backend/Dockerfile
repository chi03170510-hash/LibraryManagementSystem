FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

COPY mvnw ./
COPY .mvn .mvn
RUN chmod +x mvnw

COPY pom.xml .
RUN ./mvnw -B dependency:go-offline

COPY src src
RUN ./mvnw -B -DskipTests clean package \
    && JAR_FILE=$(ls target/*.jar | head -n 1) \
    && mv "$JAR_FILE" app.jar

FROM eclipse-temurin:21-jre
WORKDIR /app

ENV PORT=8080

COPY --from=builder /app/app.jar ./app.jar

EXPOSE 8080

CMD ["sh","-c","java -jar app.jar --server.port=${PORT:-8080}"]
 