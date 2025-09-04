package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

func TestRouter(t *testing.T) {
	

	tests := []struct {
		method       string
		path         string
		expectedCode int
	}{
		{method: http.MethodGet, path: "/characters", expectedCode: http.StatusOK},
		{method: http.MethodGet, path: "/characters/1", expectedCode: http.StatusOK},
		{method: http.MethodPost, path: "/characters", expectedCode: http.StatusCreated},
		{method: http.MethodPut, path: "/characters/1", expectedCode: http.StatusOK},
		{method: http.MethodDelete, path: "/characters/1", expectedCode: http.StatusNoContent},
	}

	for _, test := range tests {
		t.Run(test.method+" "+test.path, func(t *testing.T) {
			req, _ := http.NewRequest(test.method, test.path, nil)
			rr := httptest.NewRecorder()

			// create a new router and replace the handlers with mock handlers
			router := mux.NewRouter()
			router.HandleFunc("/characters", func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
			}).Methods(http.MethodGet)
			router.HandleFunc("/characters/{id}", func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
			}).Methods(http.MethodGet)
			router.HandleFunc("/characters", func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusCreated)
			}).Methods(http.MethodPost)
			router.HandleFunc("/characters/{id}", func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
			}).Methods(http.MethodPut)
			router.HandleFunc("/characters/{id}", func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusNoContent)
			}).Methods(http.MethodDelete)

			router.ServeHTTP(rr, req)

			if rr.Code != test.expectedCode {
				t.Errorf("expected code %d, got %d", test.expectedCode, rr.Code)
			}
		})
	}
}