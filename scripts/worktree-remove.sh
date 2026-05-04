#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# worktree-remove.sh
# Claude Code WorktreeRemove hook
#
# Receives JSON on stdin:  { "worktree_path": "/abs/path/to/worktree" }
# Kills the dev server on the worktree's port, removes the git worktree,
# and deletes the branch.
#
# node_modules and .env are symlinks → originals in the main repo are safe.
# ---------------------------------------------------------------------------

INPUT=$(cat)
WORKTREE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin)['worktree_path'])")

echo "▶ Removing worktree at $WORKTREE_PATH" >/dev/tty

# 1. Kill any process on the worktree's dev port
if [ -f "$WORKTREE_PATH/.env.local" ]; then
  PORT=$(grep '^PORT=' "$WORKTREE_PATH/.env.local" | cut -d= -f2 | tr -d '[:space:]')
  if [ -n "$PORT" ]; then
    echo "  Killing process on port $PORT..." >/dev/tty
    lsof -ti tcp:"$PORT" 2>/dev/null | xargs kill -9 2>/dev/null || true
    echo "  ✓ port $PORT cleared" >/dev/tty
  fi
fi

# 2. Capture branch name before the worktree is removed
BRANCH=$(git -C "$WORKTREE_PATH" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

# 3. Remove the git worktree
#    node_modules and .env* are symlinks — the targets in the main repo are untouched.
git worktree remove "$WORKTREE_PATH" --force >/dev/tty 2>&1
echo "  ✓ git worktree removed" >/dev/tty

# 4. Delete the local branch
if [ -n "$BRANCH" ]; then
  git branch -d "$BRANCH" 2>/dev/null \
    || git branch -D "$BRANCH" 2>/dev/null \
    || echo "  – could not delete branch '$BRANCH' (may not exist locally)" >/dev/tty
  echo "  ✓ branch '$BRANCH' deleted" >/dev/tty
fi

echo "▶ Done." >/dev/tty
