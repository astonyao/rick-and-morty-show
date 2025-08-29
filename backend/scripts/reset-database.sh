#!/bin/bash

# Script to reset the database (empty content and recreate)
# Usage: ./scripts/reset-database.sh

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
DATA_DIR="$(dirname "$DB_PATH")"

echo -e "${BLUE}=== Database Reset Script ===${NC}"
echo -e "${YELLOW}Database path: $DB_PATH${NC}"
echo ""

# Check if database file exists
if [ -f "$DB_PATH" ]; then
    echo -e "${YELLOW}Found existing database file.${NC}"
    echo -e "${YELLOW}This will empty all data and recreate the database with sample data.${NC}"
    echo ""
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Database reset cancelled.${NC}"
        exit 0
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
    
    echo -e "${YELLOW}Emptying database content...${NC}"
    
    # Get current character count
    CURRENT_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM characters;")
    echo -e "${YELLOW}Current characters in database: $CURRENT_COUNT${NC}"
    
    # Delete all data from the characters table
    sqlite3 "$DB_PATH" "DELETE FROM characters;"
    echo -e "${GREEN}All characters removed from database.${NC}"
    
    # Reset the auto-increment counter
    sqlite3 "$DB_PATH" "DELETE FROM sqlite_sequence WHERE name='characters';"
    echo -e "${GREEN}Auto-increment counter reset.${NC}"
    
    # Verify the table is empty
    NEW_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM characters;")
    echo -e "${GREEN}Characters remaining: $NEW_COUNT${NC}"
    
else
    echo -e "${YELLOW}No existing database found. Will create a new one.${NC}"
    # Ensure data directory exists
    if [ ! -d "$DATA_DIR" ]; then
        echo -e "${YELLOW}Creating data directory...${NC}"
        mkdir -p "$DATA_DIR"
    fi
fi

echo ""
echo -e "${YELLOW}To recreate the database with sample data, start the backend server:${NC}"
echo "  cd $PROJECT_ROOT"
echo "  npm run dev"
echo ""
echo -e "${GREEN}The database will be automatically populated with sample data when the server starts.${NC}"
echo ""
echo -e "${BLUE}=== Database Reset Complete ===${NC}"
