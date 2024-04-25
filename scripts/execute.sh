#!/bin/bash

# Define timeout duration in seconds
timeout_duration=30

# Execute the code based on the language
case $1 in
    javascript|typescript) timeout $timeout_duration node /app/language_templates/script."$1" "$2" ;;
    python) timeout $timeout_duration python3 "$2";;
    php) timeout $timeout_duration php "$2" ;;
    c) timeout $timeout_duration gcc -o "$2".exec "$2" && "$2".exec ;;
    c++) timeout $timeout_duration g++ -o "$2".exec "$2" && "$2".exec ;;
    # pascal) timeout $timeout_duration fpc /app/temp/script."$1" && /app/script ;;
    *) echo "Unsupported language" ;;
esac

# Check if the command has timed out
if [[ $? -eq 143 ]]; then
    echo "That code takes longer than expected" >&2
fi
