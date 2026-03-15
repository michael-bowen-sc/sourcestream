#!/bin/bash

# Frontend Bundle Analyzer Script
# Analyzes and reports on frontend bundle size and composition

set -e

cd apps/frontend

echo "🔍 Frontend Bundle Analysis"
echo "================================"
echo ""

# Check if dist exists, build if needed
if [ ! -d "dist" ]; then
    echo "⚠️  dist directory not found. Running build..."
    npm run build
fi

echo "📦 Bundle Analysis Report:"
echo "====================="
echo ""

# Total bundle size
TOTAL_SIZE=$(du -sh dist | cut -f1)
echo "Total bundle size: $TOTAL_SIZE"
echo ""

# Show breakdown by file type
echo "By File Type:"
echo "  HTML files:"
find dist -name "*.html" -exec du -c {} + 2>/dev/null | tail -1 | awk '{printf "    %s\n", $1}' || echo "    0B"

echo "  JavaScript files:"
find dist -name "*.js" -exec du -c {} + 2>/dev/null | tail -1 | awk '{printf "    %s\n", $1}' || echo "    0B"

echo "  CSS files:"
find dist -name "*.css" -exec du -c {} + 2>/dev/null | tail -1 | awk '{printf "    %s\n", $1}' || echo "    0B"

echo ""
echo "Largest JavaScript chunks (top 10):"
echo ""
find dist -name "*.js" -type f -exec du {} \; | sort -rn | head -10 | while read size file; do
    human_size=$(numfmt --to=iec-i --suffix=B $((size * 1024)) 2>/dev/null || echo "${size}K")
    filename=$(basename "$file")
    echo "  $human_size  $filename"
done

echo ""
echo "📈 Gzipped Size Analysis:"
echo ""

# Calculate gzipped size for all JS files
if ls dist/*.js &>/dev/null 2>&1; then
    GZIP_SIZE=$(find dist -name "*.js" -exec cat {} \; | gzip -c | wc -c | awk '{printf "%.2f", $1/1024}')
    echo "  JavaScript (all chunks): ~${GZIP_SIZE}KB (gzipped)"
fi

# Per-chunk gzip analysis
echo ""
echo "Gzipped sizes by chunk:"
find dist -name "*.js" -type f | while read file; do
    filename=$(basename "$file")
    size=$(wc -c < "$file")
    gzipped=$(cat "$file" | gzip -c | wc -c)
    gzip_size=$(awk "BEGIN {printf \"%.1f\", $gzipped/1024}")
    orig_size=$(awk "BEGIN {printf \"%.1f\", $size/1024}")
    echo "  $filename: ${orig_size}KB → ${gzip_size}KB (gzipped)"
done

echo ""
echo "💡 Analysis Summary:"
echo ""

# Check for visualizer
if [ -f "dist/stats.html" ]; then
    echo "✓ Bundle visualizer available at: dist/stats.html"
    echo "  Open with: npm run build:analyze"
else
    echo "⚠️ Bundle visualizer not found. Generate with: npm run build:analyze"
fi

echo ""
echo "🎯 Optimization Recommendations:"
echo ""

# Analyze for common issues
LARGEST_JS=$(find dist -name "*.js" -exec du {} \; | sort -rn | head -1 | awk '{print $2}')
if [ -n "$LARGEST_JS" ]; then
    LARGEST_SIZE=$(du "$LARGEST_JS" | awk '{print $1}')
    if [ "$LARGEST_SIZE" -gt 200 ]; then
        echo "  1. ⚠️ Large chunk detected (${LARGEST_SIZE}KB)"
        echo "     Consider code splitting for: $(basename $LARGEST_JS)"
    fi
fi

# Check for multiple vendor chunks
VENDOR_COUNT=$(find dist -name "*vendor*" -name "*.js" | wc -l)
if [ "$VENDOR_COUNT" -gt 5 ]; then
    echo "  2. ⚠️ Multiple vendor chunks ($VENDOR_COUNT found)"
    echo "     Consider consolidating vendor dependencies"
fi

echo "  3. Review dependency tree: npm run build:analyze"
echo "  4. Check for unused dependencies: npm list --depth=0"
echo "  5. Enable CSS minification in build config"
echo ""

echo "✅ Bundle analysis complete"
echo ""
