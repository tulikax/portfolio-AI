#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# worktree-create.sh
# Claude Code WorktreeCreate hook
#
# Receives JSON on stdin:  { "worktree_name": "<name>" }
# Prints worktree path to stdout so Claude Code knows where it landed.
# All progress is written to /dev/tty (visible in the terminal, not captured).
# ---------------------------------------------------------------------------

INPUT=$(cat)
WORKTREE_NAME=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin)['worktree_name'])")

REPO_ROOT=$(git rev-parse --show-toplevel)
BRANCH="worktree-$WORKTREE_NAME"
WORKTREE_PATH="$REPO_ROOT/.claude/worktrees/$WORKTREE_NAME"

echo "▶ Creating worktree '$WORKTREE_NAME'" >/dev/tty
echo "  branch : $BRANCH"               >/dev/tty
echo "  path   : $WORKTREE_PATH"        >/dev/tty

# 1. Create git worktree + branch
git worktree add "$WORKTREE_PATH" -b "$BRANCH" HEAD >/dev/tty 2>&1
echo "  ✓ git worktree created" >/dev/tty

# 2. Symlink node_modules from main repo (avoids a full reinstall)
ln -s "$REPO_ROOT/node_modules" "$WORKTREE_PATH/node_modules"
echo "  ✓ node_modules symlinked" >/dev/tty

# 3. Symlink .env from main repo if it exists
if [ -f "$REPO_ROOT/.env" ]; then
  ln -s "$REPO_ROOT/.env" "$WORKTREE_PATH/.env"
  echo "  ✓ .env symlinked" >/dev/tty
else
  echo "  – .env not found in main repo, skipping" >/dev/tty
fi

# 4. Generate a worktree-specific .env.local with a deterministic PORT (3100–9999)
#    Vite reads PORT and enforces strictPort when it is set (see vite.config.ts).
PORT=$(BRANCH="$BRANCH" python3 -c "
import hashlib, os
h = int(hashlib.sha256(os.environ['BRANCH'].encode()).hexdigest(), 16)
print(3100 + h % 6900)
")
printf 'PORT=%s\n' "$PORT" > "$WORKTREE_PATH/.env.local"
echo "  ✓ .env.local generated  (PORT=$PORT)" >/dev/tty

# Dependency install is NOT needed — node_modules is symlinked from the main repo.
# Uncomment below only if you need a fully isolated install instead:
# cd "$WORKTREE_PATH" && npm install >/dev/tty 2>&1

echo "▶ Done." >/dev/tty

# Print worktree path to stdout (required by Claude Code)
echo "$WORKTREE_PATH"
