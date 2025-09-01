#!/bin/bash

# Master Data Seeding Script
# Usage: ./seed.sh [all|country-codes|languages|countries|genders|voices|themes] [additional-seeders...]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}🌱${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

# Check if arguments are provided
if [ $# -eq 0 ]; then
    echo "🌱 Master Data Seeding Script"
    echo ""
    echo "Usage:"
    echo "  ./seed.sh all                                    # Seed all master data"
    echo "  ./seed.sh country-codes                          # Seed only country codes"
    echo "  ./seed.sh languages voices                       # Seed languages and voices"
    echo "  ./seed.sh --help                                 # Show this help"
    echo ""
    echo "Available seeders:"
    echo "  country-codes  🌍 International dialing codes"
    echo "  languages      🗣️ Language definitions"
    echo "  countries      🌎 Country information"
    echo "  genders        👥 Gender options"
    echo "  voices         🎤 Voice options"
    echo "  themes         🎨 UI theme options"
    exit 0
fi

# Check for help flag
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "🌱 Master Data Seeding Script"
    echo ""
    echo "Usage:"
    echo "  ./seed.sh all                                    # Seed all master data"
    echo "  ./seed.sh country-codes                          # Seed only country codes"
    echo "  ./seed.sh languages voices                       # Seed languages and voices"
    echo ""
    echo "Available seeders:"
    echo "  country-codes  🌍 International dialing codes"
    echo "  languages      🗣️ Language definitions"
    echo "  countries      🌎 Country information"
    echo "  genders        👥 Gender options"
    echo "  voices         🎤 Voice options"
    echo "  themes         🎨 UI theme options"
    exit 0
fi

# Function to run a specific seeder
run_seeder() {
    local seeder=$1
    case $seeder in
        "country-codes")
            print_status "Seeding country codes..."
            node scripts/seed-country-codes.js
            ;;
        "languages")
            print_status "Seeding languages..."
            node scripts/seed-languages.js
            ;;
        "countries")
            print_status "Seeding countries..."
            node scripts/seed-countries.js
            ;;
        "genders")
            print_status "Seeding genders..."
            node scripts/seed-genders.js
            ;;
        "voices")
            print_status "Seeding voices..."
            node scripts/seed-voices.js
            ;;
        "themes")
            print_status "Seeding themes..."
            node scripts/seed-themes.js
            ;;
        *)
            print_error "Unknown seeder: $seeder"
            echo "Available seeders: country-codes, languages, countries, genders, voices, themes"
            return 1
            ;;
    esac
}

# Main execution
print_status "Starting master data seeding..."

# Check if 'all' is requested
if [[ "$1" == "all" ]]; then
    print_status "Seeding ALL master data..."
    echo ""
    
    # Run all seeders in order
    run_seeder "country-codes"
    run_seeder "languages"
    run_seeder "countries"
    run_seeder "genders"
    run_seeder "voices"
    run_seeder "themes"
    
    print_success "All master data seeding completed!"
else
    # Run specific seeders
    for seeder in "$@"; do
        if [[ "$seeder" != "all" ]]; then
            run_seeder "$seeder"
            echo ""
        fi
    done
    
    print_success "Selected master data seeding completed!"
fi

echo ""
print_status "Seeding process finished!"
