package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

const (
	defaultPort = "4000"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "hello")
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	log.Printf("starting server on :%s ...", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
