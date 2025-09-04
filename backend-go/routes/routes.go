
package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"rick-and-morty-show/backend-go/handlers"
)

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func NewRouter() *mux.Router {
	router := mux.NewRouter()

	// Add CORS middleware
	router.Use(corsMiddleware)

	router.HandleFunc("/characters", handlers.GetCharacters).Methods(http.MethodGet, http.MethodOptions)
	router.HandleFunc("/characters/{id}", handlers.GetCharacter).Methods(http.MethodGet, http.MethodOptions)
	router.HandleFunc("/characters", handlers.CreateCharacter).Methods(http.MethodPost, http.MethodOptions)
	router.HandleFunc("/characters/{id}", handlers.UpdateCharacter).Methods(http.MethodPut, http.MethodOptions)
	router.HandleFunc("/characters/{id}", handlers.DeleteCharacter).Methods(http.MethodDelete, http.MethodOptions)

	return router
}
