package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gorilla/mux"
	"rick-and-morty-show/backend-go/database"
)

func TestGetCharacters(t *testing.T) {
	db, mock := database.NewMock()
	defer db.Close()

	rows := sqlmock.NewRows([]string{"id", "name", "status", "species", "type", "gender", "origin_name", "origin_url", "location_name", "location_url", "image", "episode_urls", "url", "created"}).
		AddRow(568, "Slut Dragon", "Alive", "Mythological Creature", "Dragon", "Male", "Draygon", "https://rickandmortyapi.com/api/location/94", "Draygon", "https://rickandmortyapi.com/api/location/94", "https://rickandmortyapi.com/api/character/avatar/568.jpeg", `["https://rickandmortyapi.com/api/episode/35"]`, "https://rickandmortyapi.com/api/character/568", "2020-05-07T11:37:05.857Z")

	mock.ExpectQuery("SELECT id, name, status, species, type, gender, origin_name, origin_url, location_name, location_url, image, episode_urls, url, created FROM characters").WillReturnRows(rows)

	req, err := http.NewRequest("GET", "/characters", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(GetCharacters)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check the response body is what we expect.
	expected := `[{"id":568,"name":"Slut Dragon","status":"Alive","species":"Mythological Creature","type":"Dragon","gender":"Male","origin":{"name":"Draygon","url":"https://rickandmortyapi.com/api/location/94"},"location":{"name":"Draygon","url":"https://rickandmortyapi.com/api/location/94"},"image":"https://rickandmortyapi.com/api/character/avatar/568.jpeg","episode":["https://rickandmortyapi.com/api/episode/35"],"url":"https://rickandmortyapi.com/api/character/568","created":"2020-05-07T11:37:05.857Z"}]`
	
	// Parse both JSON strings for comparison
	var expectedJSON, actualJSON interface{}
	if err := json.Unmarshal([]byte(expected), &expectedJSON); err != nil {
		t.Errorf("Failed to unmarshal expected JSON: %v", err)
	}
	if err := json.Unmarshal(rr.Body.Bytes(), &actualJSON); err != nil {
		t.Errorf("Failed to unmarshal actual JSON: %v", err)
	}
	
	// Compare the parsed JSON
	expectedStr, _ := json.Marshal(expectedJSON)
	actualStr, _ := json.Marshal(actualJSON)
	if string(expectedStr) != string(actualStr) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetCharacter(t *testing.T) {
	db, mock := database.NewMock()
	defer db.Close()

	rows := sqlmock.NewRows([]string{"id", "name", "status", "species", "type", "gender", "origin_name", "origin_url", "location_name", "location_url", "image", "episode_urls", "url", "created"}).
		AddRow(568, "Slut Dragon", "Alive", "Mythological Creature", "Dragon", "Male", "Draygon", "https://rickandmortyapi.com/api/location/94", "Draygon", "https://rickandmortyapi.com/api/location/94", "https://rickandmortyapi.com/api/character/avatar/568.jpeg", `["https://rickandmortyapi.com/api/episode/35"]`, "https://rickandmortyapi.com/api/character/568", "2020-05-07T11:37:05.857Z")

	mock.ExpectQuery("SELECT id, name, status, species, type, gender, origin_name, origin_url, location_name, location_url, image, episode_urls, url, created FROM characters WHERE id = ?").WithArgs(568).WillReturnRows(rows)

	req, err := http.NewRequest("GET", "/characters/568", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	// Need to use a router that supports vars
	router := mux.NewRouter()
	router.HandleFunc("/characters/{id}", GetCharacter)
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check the response body is what we expect.
	expected := `{"id":568,"name":"Slut Dragon","status":"Alive","species":"Mythological Creature","type":"Dragon","gender":"Male","origin":{"name":"Draygon","url":"https://rickandmortyapi.com/api/location/94"},"location":{"name":"Draygon","url":"https://rickandmortyapi.com/api/location/94"},"image":"https://rickandmortyapi.com/api/character/avatar/568.jpeg","episode":["https://rickandmortyapi.com/api/episode/35"],"url":"https://rickandmortyapi.com/api/character/568","created":"2020-05-07T11:37:05.857Z"}`
	
	// Parse both JSON strings for comparison
	var expectedJSON, actualJSON interface{}
	if err := json.Unmarshal([]byte(expected), &expectedJSON); err != nil {
		t.Errorf("Failed to unmarshal expected JSON: %v", err)
	}
	if err := json.Unmarshal(rr.Body.Bytes(), &actualJSON); err != nil {
		t.Errorf("Failed to unmarshal actual JSON: %v", err)
	}
	
	// Compare the parsed JSON
	expectedStr, _ := json.Marshal(expectedJSON)
	actualStr, _ := json.Marshal(actualJSON)
	if string(expectedStr) != string(actualStr) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestCreateCharacter(t *testing.T) {
	db, mock := database.NewMock()
	defer db.Close()

	mock.ExpectExec("INSERT INTO characters").WillReturnResult(sqlmock.NewResult(1, 1))

	body := `{"name":"Test Character","status":"Alive","species":"Human","gender":"Male","origin":{"name":"Earth (C-137)","url":""},"location":{"name":"Citadel of Ricks","url":""},"image":"","episode":[],"url":""}`
	req, err := http.NewRequest("POST", "/characters", strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(CreateCharacter)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusCreated)
	}

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestUpdateCharacter(t *testing.T) {
	db, mock := database.NewMock()
	defer db.Close()

	mock.ExpectExec("UPDATE characters").WillReturnResult(sqlmock.NewResult(1, 1))

	body := `{"name":"Test Character","status":"Alive","species":"Human","gender":"Male","origin":{"name":"Earth (C-137)","url":""},"location":{"name":"Citadel of Ricks","url":""},"image":"","episode":[],"url":""}`
	req, err := http.NewRequest("PUT", "/characters/1", strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	router := mux.NewRouter()
	router.HandleFunc("/characters/{id}", UpdateCharacter)
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestDeleteCharacter(t *testing.T) {
	db, mock := database.NewMock()
	defer db.Close()

	mock.ExpectExec("DELETE FROM characters").WillReturnResult(sqlmock.NewResult(1, 1))

	req, err := http.NewRequest("DELETE", "/characters/1", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	router := mux.NewRouter()
	router.HandleFunc("/characters/{id}", DeleteCharacter)
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusNoContent {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusNoContent)
	}

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}