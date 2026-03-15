#!/bin/bash

# Frontend Bundle Size Analysis Script
# Analyzes and reports on frontend bundle size

set -e

cd apps/frontend

echo "📊 Frontend Bundle Size Analysis"
echo "================================"
echo ""

# Check if dist exists
if [ ! -d "dist" ]; then
    echo "⚠️  dist directory not found. Running build..."
    npm run build
fi

echo "📦 Bundle Size Report:"
echo "====================="
echo ""

# Calculate total size
TOTAL_SIZE=$(du -sh dist | cut -f1)
echo "Total bundle size: $TOTAL_SIZE"
echo ""

# Show breakdown by file type
echo "By File Type:"
echo "  HTML files:"
find dist -name "*.html" -exec du -c {} + 2>/dev/null | tail -1 | awk '{print "    " $1}' || echo "    0B"

echo "  JavaScript files:"
find dist -name "*.js" -exec du -c {} + 2>/dev/null | tail -1 | awk '{print "    " $1}' || echo "    0B"

echo "  CSS files:"
find dist -name "*.css" -exec du -c {} + 2>/dev/null | tail -1 | awk '{print "    " $1}' || echo "    0B"

echo "  Image files:"
find dist -name "*.png" -o -name "*.jpg" -o -name "*.svg" -o -name "*.webp" 2>/dev/null | xargs du -c 2>/dev/null | tail -1 | awk '{print "    " $1}' || echo "    0B"

echo ""
echo "Largest files (top 10):"
echo ""
find dist -type f -exec du {} \; | sort -rn | head -10 | while read size file; do
    human_size=$(numfmt --to=iec-i --suffix=B $((size * 1024)) 2>/dev/null || echo "${size}K")
    filename=$(basename "$file")
    echo "  $human_size  $filename"
done

echo ""
echo "📈 Gzipped Size (estimated):"
echo ""

# Calculate gzipped size for JS files
if ls dist/*.js &>/dev/null 2>&1; then
    GZIP_SIZE=$(find dist -name "*.js" -exec cat {} \; | gzip -c | wc -c | awk '{printf "%.2f", $1/1024}')
    echo "  JavaScript: ~${GZIP_SIZE}KB (gzipped)"
fi

echo ""
echo "✅ Bundle analysis complete"
echo ""
echo "🔍 Optimization Tips:"
echo "  1. Check for unused dependencies: npm run analyze"
echo "  2. Review .js files for duplicate code"
echo "  3. Consider code splitting for large components"
echo "  4. Enable compression in nginx for .gzip output"
echo "  5. Use tree-shaking in build configuration"
