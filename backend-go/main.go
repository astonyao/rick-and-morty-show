package main

import (
	"log"
	"net/http"

	"rick-and-morty-show/backend-go/database"
	"rick-and-morty-show/backend-go/routes"
)

func main() {
	database.InitDB("./database.db")

	router := routes.NewRouter()

	log.Println("Server starting on port 8081...")
	if err := http.ListenAndServe(":8081", router); err != nil {
		log.Fatal(err)
	}
}