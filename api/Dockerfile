# Step 1: build
FROM golang:1.24 AS builder

WORKDIR /app
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Step 2: run
FROM gcr.io/distroless/base-debian12

WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/static ./static
CMD ["./main"]
