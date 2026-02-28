#!/usr/bin/env bash
set -euo pipefail

UPSTREAM_REMOTE="${UPSTREAM_REMOTE:-upstream}"
UPSTREAM_URL="${UPSTREAM_URL:-https://github.com/imputnet/helium.git}"
MAIN_BRANCH="${MAIN_BRANCH:-main}"
MODE="rebase"
NO_PUSH=0
ALLOW_DIRTY=0
STAY_ON_MAIN=0
DIRTY=0

usage() {
  cat <<'EOF'
Sync this repository's main branch with Helium upstream.

Usage:
  scripts/sync-upstream.sh [--merge|--rebase] [--no-push] [--allow-dirty] [--stay-on-main]

Options:
  --rebase       Rebase local main onto upstream/main (default)
  --merge        Merge upstream/main into local main
  --no-push      Do not push to origin/main
  --allow-dirty  Skip working tree cleanliness checks
  --stay-on-main Leave you on main after syncing
  -h, --help     Show this help message

Environment overrides:
  UPSTREAM_REMOTE (default: upstream)
  UPSTREAM_URL    (default: https://github.com/imputnet/helium.git)
  MAIN_BRANCH     (default: main)
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --merge)
      MODE="merge"
      shift
      ;;
    --rebase)
      MODE="rebase"
      shift
      ;;
    --no-push)
      NO_PUSH=1
      shift
      ;;
    --allow-dirty)
      ALLOW_DIRTY=1
      shift
      ;;
    --stay-on-main)
      STAY_ON_MAIN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Not inside a git repository." >&2
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  DIRTY=1
fi

if [[ $DIRTY -eq 1 && $ALLOW_DIRTY -eq 0 ]]; then
  echo "Working tree is dirty. Commit/stash first, or rerun with --allow-dirty." >&2
  exit 1
fi

if [[ $DIRTY -eq 1 && "$MODE" == "merge" ]]; then
  echo "--allow-dirty is only supported with rebase mode." >&2
  echo "Use --rebase (default), or stash/commit first." >&2
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Missing required remote: origin" >&2
  exit 1
fi

if ! git remote get-url "$UPSTREAM_REMOTE" >/dev/null 2>&1; then
  echo "Adding upstream remote '$UPSTREAM_REMOTE' -> $UPSTREAM_URL"
  git remote add "$UPSTREAM_REMOTE" "$UPSTREAM_URL"
fi

# Keep upstream fetch-only to prevent accidental pushes.
git remote set-url --push "$UPSTREAM_REMOTE" DISABLED

START_BRANCH="$(git symbolic-ref --quiet --short HEAD || true)"
SWITCHED=0
if [[ "$START_BRANCH" != "$MAIN_BRANCH" ]]; then
  git checkout "$MAIN_BRANCH"
  SWITCHED=1
fi

if ! git rev-parse --verify "refs/heads/$MAIN_BRANCH" >/dev/null 2>&1; then
  echo "Local branch '$MAIN_BRANCH' does not exist." >&2
  exit 1
fi

if ! git rev-parse --verify "refs/remotes/origin/$MAIN_BRANCH" >/dev/null 2>&1; then
  echo "Remote branch 'origin/$MAIN_BRANCH' does not exist." >&2
  exit 1
fi

# Ensure local main tracks origin/main.
git branch --set-upstream-to "origin/$MAIN_BRANCH" "$MAIN_BRANCH" >/dev/null

echo "Fetching origin and $UPSTREAM_REMOTE..."
git fetch origin "$MAIN_BRANCH"
git fetch "$UPSTREAM_REMOTE" "$MAIN_BRANCH"

echo "Updating local $MAIN_BRANCH from origin/$MAIN_BRANCH..."
if [[ $DIRTY -eq 1 ]]; then
  git pull --rebase --autostash origin "$MAIN_BRANCH"
else
  git pull --rebase origin "$MAIN_BRANCH"
fi

if [[ "$MODE" == "rebase" ]]; then
  echo "Rebasing $MAIN_BRANCH onto $UPSTREAM_REMOTE/$MAIN_BRANCH..."
  if [[ $DIRTY -eq 1 ]]; then
    git rebase --autostash "$UPSTREAM_REMOTE/$MAIN_BRANCH"
  else
    git rebase "$UPSTREAM_REMOTE/$MAIN_BRANCH"
  fi
else
  echo "Merging $UPSTREAM_REMOTE/$MAIN_BRANCH into $MAIN_BRANCH..."
  git merge --no-edit "$UPSTREAM_REMOTE/$MAIN_BRANCH"
fi

if [[ $NO_PUSH -eq 0 ]]; then
  echo "Pushing $MAIN_BRANCH to origin..."
  git push origin "$MAIN_BRANCH"
else
  echo "Skipping push (--no-push)."
fi

if [[ $SWITCHED -eq 1 && $STAY_ON_MAIN -eq 0 && -n "$START_BRANCH" ]]; then
  git checkout "$START_BRANCH"
fi

echo "Sync complete."
