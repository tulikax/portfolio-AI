# CLAUDE.md — Project Configuration & Git Workflow

---

## Branch Structure

This project uses a **2-layer branch hierarchy** before `main`:

```
main                         ← production-only, never commit directly
  └── base                   ← integration layer, staging/QA target
        ├── feature/xyz      ← feature branches
        ├── fix/xyz          ← bug fix branches
        └── chore/xyz        ← maintenance branches
```

### Rules
- **Never commit directly to `main`** — it only receives merges from `base`
- **Never commit directly to `base`** — it only receives merges from feature/fix/chore branches
- All new work branches off `base`, not `main`
- PRs/merges go: `feature/* → base → main`

### Creating a new branch
```bash
git checkout base
git pull origin base
git checkout -b feature/your-feature-name
```

---

## Worktree Rules

### Always sync before starting work

When resuming work in a worktree, **always run this first**:

```bash
# From inside the worktree
git fetch origin
git merge origin/base    # or the branch this worktree tracks
```

Worktrees do not auto-update when commits happen elsewhere. They are frozen
at the commit they were created from. You must explicitly pull/merge.

### Worktree creation

Always create worktrees branching from `base`, not `main`:

```bash
git worktree add .claude/worktrees/<name> -b feature/<name> origin/base
```

### After committing locally in main checkout

If commits were made in the main checkout that a worktree needs, run inside
the worktree:

```bash
git fetch origin
git rebase origin/base   # preferred over merge to keep history clean
```

### Worktree cleanup

When a worktree task is complete:

```bash
# From repo root
git worktree remove .claude/worktrees/<name>
git branch -d feature/<name>          # local branch
git push origin --delete feature/<name>  # remote branch (if pushed)
```

---

## Merge Conflict Resolution

### Always keep worktree version for these files

When resolving merge conflicts, **always accept the worktree (ours) version**
for these files — never accept incoming changes:

- `.claude/launch.json`
- `.claude/run-dev.sh`

Resolve them immediately when conflicts occur:

```bash
git checkout --ours .claude/launch.json
git checkout --ours .claude/run-dev.sh
git add .claude/launch.json .claude/run-dev.sh
```

These files are environment-specific and must not be overwritten by branch merges.

---

## Commit Rules

- Commit after each logical unit of work — do not batch unrelated changes
- Use conventional commit format: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- Example: `feat: add user profile endpoint`
- Never force-push to `base` or `main`

---

## Dev Environment Files

These files are local and must **never be committed**:

- `.env`, `.env.local`, `.env.development`
- `.claude/launch.json`
- `.claude/run-dev.sh`

Ensure they are in `.gitignore`. If they appear in staged changes, unstage them:

```bash
git restore --staged .claude/launch.json .claude/run-dev.sh
```

---

## Quick Reference

| Task | Command |
|------|---------|
| New feature branch | `git checkout base && git pull origin base && git checkout -b feature/name` |
| Sync worktree | `git fetch origin && git merge origin/base` |
| Resolve launch.json conflict | `git checkout --ours .claude/launch.json && git add .` |
| Resolve run-dev.sh conflict | `git checkout --ours .claude/run-dev.sh && git add .` |
| Merge feature → base | `git checkout base && git merge --no-ff feature/name` |
| Merge base → main | `git checkout main && git merge --no-ff base` |
| Clean up worktree | `git worktree remove .claude/worktrees/<name>` |
