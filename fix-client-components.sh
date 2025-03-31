#!/bin/bash

# List of files that need the 'use client' directive
files=(
  "app/payment/page.js"
  "app/search/page.js"
  "app/products/page.js"
  "app/products/[id]/page.js"
  "app/products/add/page.js"
  "app/page.js"
  "app/orders/page.js"
  "app/checkout/page.js"
  "app/components/ProductForm.js"
  "app/category/home-living/page.js"
  "app/category/electronics/page.js"
  "app/category/fashion/page.js"
  "app/categories/[category]/page.js"
  "app/(components)/NavBar.js"
  "app/(auth)/signup/page.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    if ! grep -q "^\"use client\"" "$file"; then
      echo "\"use client\";" | cat - "$file" > temp && mv temp "$file"
      echo "Added 'use client' to $file"
    else
      echo "'use client' already exists in $file"
    fi
  else
    echo "File $file does not exist"
  fi
done 