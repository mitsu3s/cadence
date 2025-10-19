package handler

import "net/http"

func Root(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("hello"))
}

func Health(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok"))
}
