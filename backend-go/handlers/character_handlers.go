
package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"rick-and-morty-show/backend-go/database"
	"rick-and-morty-show/backend-go/models"
)

func GetCharacters(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, name, status, species, type, gender, origin_name, origin_url, location_name, location_url, image, episode_urls, url, created FROM characters")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	characters := []models.Character{}
	for rows.Next() {
		var c models.Character
		var originName, originURL, locationName, locationURL string
		var episodeURLs string

		if err := rows.Scan(&c.ID, &c.Name, &c.Status, &c.Species, &c.Type, &c.Gender, &originName, &originURL, &locationName, &locationURL, &c.Image, &episodeURLs, &c.URL, &c.Created); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		c.Origin = models.Location{Name: originName, URL: originURL}
		c.Location = models.Location{Name: locationName, URL: locationURL}
		json.Unmarshal([]byte(episodeURLs), &c.Episode)

		characters = append(characters, c)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(characters)
}

func GetCharacter(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	row := database.DB.QueryRow("SELECT id, name, status, species, type, gender, origin_name, origin_url, location_name, location_url, image, episode_urls, url, created FROM characters WHERE id = ?", id)

	var c models.Character
	var originName, originURL, locationName, locationURL string
	var episodeURLs string

	if err := row.Scan(&c.ID, &c.Name, &c.Status, &c.Species, &c.Type, &c.Gender, &originName, &originURL, &locationName, &locationURL, &c.Image, &episodeURLs, &c.URL, &c.Created); err != nil {
		if err == sql.ErrNoRows {
			http.NotFound(w, r)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	c.Origin = models.Location{Name: originName, URL: originURL}
	c.Location = models.Location{Name: locationName, URL: locationURL}
	json.Unmarshal([]byte(episodeURLs), &c.Episode)

	json.NewEncoder(w).Encode(c)
}

func CreateCharacter(w http.ResponseWriter, r *http.Request) {
	var c models.Character
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	episodeURLs, _ := json.Marshal(c.Episode)

	result, err := database.DB.Exec("INSERT INTO characters (name, status, species, type, gender, origin_name, origin_url, location_name, location_url, image, episode_urls, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", c.Name, c.Status, c.Species, c.Type, c.Gender, c.Origin.Name, c.Origin.URL, c.Location.Name, c.Location.URL, c.Image, string(episodeURLs), c.URL)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	c.ID = int(id)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(c)
}

func UpdateCharacter(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var c models.Character
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	episodeURLs, _ := json.Marshal(c.Episode)

	_, err := database.DB.Exec("UPDATE characters SET name = ?, status = ?, species = ?, type = ?, gender = ?, origin_name = ?, origin_url = ?, location_name = ?, location_url = ?, image = ?, episode_urls = ?, url = ? WHERE id = ?", c.Name, c.Status, c.Species, c.Type, c.Gender, c.Origin.Name, c.Origin.URL, c.Location.Name, c.Location.URL, c.Image, string(episodeURLs), c.URL, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	c.ID = id

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func DeleteCharacter(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	_, err := database.DB.Exec("DELETE FROM characters WHERE id = ?", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
