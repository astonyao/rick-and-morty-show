
package models

import (
	"encoding/json"
	"testing"
)

func TestCharacter(t *testing.T) {
	t.Run("Test Character JSON serialization", func(t *testing.T) {
		character := Character{
			ID:      1,
			Name:    "Rick Sanchez",
			Status:  "Alive",
			Species: "Human",
			Type:    "",
			Gender:  "Male",
			Origin: Location{
				Name: "Earth (C-137)",
				URL:  "https://rickandmortyapi.com/api/location/1",
			},
			Location: Location{
				Name: "Citadel of Ricks",
				URL:  "https://rickandmortyapi.com/api/location/3",
			},
			Image:   "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
			Episode: []string{"https://rickandmortyapi.com/api/episode/1"},
			URL:     "https://rickandmortyapi.com/api/character/1",
			Created: "2017-11-04T18:48:46.250Z",
		}

		jsonData, err := json.Marshal(character)
		if err != nil {
			t.Errorf("Error marshalling character: %v", err)
		}

		var newCharacter Character
		err = json.Unmarshal(jsonData, &newCharacter)
		if err != nil {
			t.Errorf("Error unmarshalling character: %v", err)
		}

		if newCharacter.Name != character.Name {
			t.Errorf("Expected character name %s, got %s", character.Name, newCharacter.Name)
		}
	})
}
