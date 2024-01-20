#!/bin/bash

read -p "Please enter the version number (e.g., 0.1.0): " version_number

if ! [[ $version_number =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version number format. Please use the format 0.0.0"
    exit 1
fi

echo "Removing dist directory..."
rm -R dist

echo "Building web project..."
npx nx build web 

echo "Building Docker image for web..."
docker build -t "aimadjaouhar/org.pdfmaster:web-$version_number" -f docker/web.Dockerfile . --no-cache

echo "Pushing Docker image web..."
docker push "aimadjaouhar/org.pdfmaster:web-$version_number"

sed "s/\${version}/$version_number/g" docker-compose.prod.example.yml > tmp && mv tmp docker-compose.prod.yml


