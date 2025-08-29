#!/bin/bash

# Script to print all characters from the database
# Usage: ./scripts/print-all-characters.sh

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

echo -e "${BLUE}=== Rick and Morty Characters Database Viewer ===${NC}"
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

echo -e "${GREEN}Total number of characters:${NC}"
sqlite3 "$DB_PATH" "SELECT COUNT(*) as total_characters FROM characters;"

echo ""
echo -e "${GREEN}All characters in the database:${NC}"
echo ""

# Print all characters in a nicely formatted table
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
ORDER BY id;
"

echo ""
echo -e "${BLUE}=== End of Database Report ===${NC}"
