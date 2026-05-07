#!/usr/bin/env node

import { execFileSync } from 'node:child_process'

function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim()
}

function getStagedFiles() {
  const output = runGit(['diff', '--cached', '--name-only', '--diff-filter=ACMR'])
  return output ? output.split('\n').filter(Boolean) : []
}

function getStagedFileContent(filePath) {
  return runGit(['show', `:${filePath}`])
}

const protectedFiles = new Set([
  '.claude/launch.json',
  '.claude/run-dev.sh',
  '.env',
  '.env.local',
  '.env.development',
])

const codeFileRegex = /\.(?:js|jsx|ts|tsx)$/
const blockedPatterns = [
  {
    name: 'placeholder project description',
    regex: /\[Full description of this project/i,
  },
  {
    name: 'unused import suppression via void identifier',
    regex: /^\s*void\s+[A-Za-z_$][\w$]*\b/m,
  },
]

const stagedFiles = getStagedFiles()
const errors = []

for (const filePath of stagedFiles) {
  if (protectedFiles.has(filePath)) {
    errors.push(`Protected file cannot be committed: ${filePath}`)
    continue
  }

  if (!codeFileRegex.test(filePath)) {
    continue
  }

  const content = getStagedFileContent(filePath)
  for (const pattern of blockedPatterns) {
    if (pattern.regex.test(content)) {
      errors.push(`Blocked ${pattern.name} found in staged file: ${filePath}`)
    }
  }
}

if (errors.length > 0) {
  console.error('\npre-commit quality checks failed:\n')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  console.error('\nFix the issues or unstage the offending files.\n')
  process.exit(1)
}

