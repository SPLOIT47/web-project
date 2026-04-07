#!/bin/sh
set -eu

# Deploy fingerprint (override via WEB_BUILD_REF / WEB_BUILD_TIME at runtime or Docker build).
printf '%s\n' "{\"service\":\"web\",\"ref\":\"${WEB_BUILD_REF:-unknown}\",\"builtAt\":\"${WEB_BUILD_TIME:-unknown}\"}" \
  > /usr/share/nginx/html/version.json

# Runtime config for the browser. This lets you change API URL without rebuilding the Vite bundle.
# If apiBaseUrl is empty, frontend will call `/api/...` (same-origin).
cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = {
  apiBaseUrl: "${VITE_API_BASE_URL:-}"
};
EOF

exec nginx -g "daemon off;"

