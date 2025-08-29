#!/bin/bash

# Script to search for characters in the database
# Usage: ./scripts/search-character.sh [search_term]
# Examples:
#   ./scripts/search-character.sh "Rick"
#   ./scripts/search-character.sh "Alive"
#   ./scripts/search-character.sh "Human"

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DB_PATH="$PROJECT_ROOT/data/characters.db"

# Check if search term is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: No search term provided${NC}"
    echo ""
    echo -e "${YELLOW}Usage: $0 [search_term]${NC}"
    echo ""
    echo -e "${GREEN}Examples:${NC}"
    echo "  $0 \"Rick\"          # Search by name"
    echo "  $0 \"Alive\"         # Search by status"
    echo "  $0 \"Human\"         # Search by species"
    echo "  $0 \"Male\"          # Search by gender"
    echo "  $0 \"Earth\"         # Search by origin or location"
    exit 1
fi

SEARCH_TERM="$1"

echo -e "${BLUE}=== Character Search ===${NC}"
echo -e "${YELLOW}Searching for: \"$SEARCH_TERM\"${NC}"
echo -e "${YELLOW}Database path: $DB_PATH${NC}"
echo ""

# Check if database file exists
if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}Error: Database file not found at $DB_PATH${NC}"
    echo -e "${YELLOW}Make sure the backend has been started at least once to create the database.${NC}"
    exit 1
fi

# Check if sqlite3 is installed
if ! command -v sqlite3 &> /dev/null; then
    echo -e "${RED}Error: sqlite3 is not installed${NC}"
    echo -e "${YELLOW}Please install sqlite3 to use this script:${NC}"
    echo "  macOS: brew install sqlite3"
    echo "  Ubuntu/Debian: sudo apt-get install sqlite3"
    echo "  CentOS/RHEL: sudo yum install sqlite3"
    exit 1
fi

# Search across multiple columns
echo -e "${GREEN}Searching for characters matching \"$SEARCH_TERM\":${NC}"
echo ""

sqlite3 "$DB_PATH" ".mode column" ".headers on" "
SELECT 
    id,
    name,
    status,
    species,
    gender,
    origin_name,
    location_name,
    created
FROM characters 
WHERE 
    name LIKE '%$SEARCH_TERM%' OR
    status LIKE '%$SEARCH_TERM%' OR
    species LIKE '%$SEARCH_TERM%' OR
    type LIKE '%$SEARCH_TERM%' OR
    gender LIKE '%$SEARCH_TERM%' OR
    origin_name LIKE '%$SEARCH_TERM%' OR
    location_name LIKE '%$SEARCH_TERM%'
ORDER BY name;
"

echo ""
echo -e "${GREEN}Search complete!${NC}"
echo -e "${BLUE}=== End of Search ===${NC}"
