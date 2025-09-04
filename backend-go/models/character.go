
package models

import "encoding/json"

// Character represents a character in the Rick and Morty universe.
// Note: The json tags are for serialization/deserialization.
// The db tags are for mapping the struct fields to the database columns.
// The validate tags are for validating the struct fields.
type Character struct {
	ID          int             `json:"id"`
	Name        string          `json:"name"`
	Status      string          `json:"status"`
	Species     string          `json:"species"`
	Type        string          `json:"type"`
	Gender      string          `json:"gender"`
	Origin      Location        `json:"origin"`
	Location    Location        `json:"location"`
	Image       string          `json:"image"`
	Episode     []string        `json:"episode"`
	URL         string          `json:"url"`
	Created     string          `json:"created"`
}

// Location represents a location in the Rick and Morty universe.
// Note: The json tags are for serialization/deserialization.
// The db tags are for mapping the struct fields to the database columns.
// The validate tags are for validating the struct fields.
type Location struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

// implement the Scanner interface for Character
func (c *Character) Scan(src interface{}) error {
	return json.Unmarshal(src.([]byte), c)
}

// implement the Valuer interface for Character
func (c Character) Value() (interface{}, error) {
	return json.Marshal(c)
}
