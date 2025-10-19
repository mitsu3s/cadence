package handler

import "net/http"

// Root handles the root endpoint.
func Root(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("hello"))
}

// Health handles the health check endpoint.
func Health(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok"))
}
