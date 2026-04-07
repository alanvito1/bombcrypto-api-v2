#!/bin/bash

# Script to check the health of RPC endpoints listed in data/bsc_rpc.txt and data/polygon_rpc.txt
# Requires: curl, jq

BSC_FILE="data/bsc_rpc.txt"
POLYGON_FILE="data/polygon_rpc.txt"

# Check for jq
if ! command -v jq &> /dev/null; then
  echo "Error: jq is not installed. Please install jq to use this script."
  exit 1
fi

# Function to test a single RPC endpoint
# Arguments: $1 = URL, $2 = Chain name
check_rpc() {
  local url="$1"
  local chain="$2"
  # Remove trailing comma if present
  url="${url%,}"
  # Send a simple eth_blockNumber request
  response=$(curl -s -m 8 -H 'Content-Type: application/json' \
    --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' "$url")
  http_code=$?
  if [[ $http_code -ne 0 ]]; then
    echo "[$chain] BROKEN: $url (curl error $http_code)"
    return
  fi
  # Check if response contains a result field
  result=$(echo "$response" | jq -r '.result // empty')
  if [[ -n "$result" && "$result" != "null" ]]; then
    echo "[$chain] OK: $url"
  else
    echo "[$chain] BROKEN: $url (no valid result)"
  fi
}

echo "Checking BSC RPC endpoints..."
while IFS= read -r line || [[ -n "$line" ]]; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  check_rpc "$line" "BSC"
done < "$BSC_FILE"

echo "\nChecking Polygon RPC endpoints..."
while IFS= read -r line || [[ -n "$line" ]]; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  check_rpc "$line" "Polygon"
done < "$POLYGON_FILE"

echo "\nCheck complete."

