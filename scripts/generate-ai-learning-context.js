#!/usr/bin/env node

/**
 * AI Learning Context Generator
 * 
 * This script analyzes project history to identify patterns in AI-human collaboration
 * and generates a learning context document that can be used to improve future interactions.
 * 
 * Usage: node generate-ai-learning-context.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const REPO_ROOT = path.resolve(__dirname, '..');
const DEVLOG_PATH = path.join(REPO_ROOT, 'DEVLOG.md');
const AI_PATTERNS_DIR = path.join(REPO_ROOT, 'docs', 'ai-patterns');
const OUTPUT_PATH = path.join(REPO_ROOT, 'docs', 'ai-patterns', 'learning-context.md');
const DAYS_TO_ANALYZE = 30;

// Helper to run git commands
function runGit(command) {
  return execSync(`git ${command}`, { cwd: REPO_ROOT, encoding: 'utf8' });
}

// Extract patterns from DEVLOG entries
function extractPatternsFromDevlog() {
  console.log('Extracting patterns from DEVLOG.md...');
  const content = fs.readFileSync(DEVLOG_PATH, 'utf8');
  
  // Parse DEVLOG entries
  const entries = content.split('---').filter(entry => entry.trim());
  
  // Extract insights from entries
  const insights = [];
  for (const entry of entries) {
    if (entry.includes('**Insights:**')) {
      const insightSection = entry.split('**Insights:**')[1].split('*')[1];
      if (insightSection && insightSection.trim()) {
        insights.push(insightSection.trim());
      }
    }
  }
  
  return insights;
}

// Analyze commit messages for AI collaboration indicators
function analyzeCommits() {
  console.log('Analyzing recent commits...');
  const since = new Date();
  since.setDate(since.getDate() - DAYS_TO_ANALYZE);
  const sinceStr = since.toISOString().split('T')[0];
  
  // Get commits since the target date
  const commits = runGit(`log --since="${sinceStr}" --pretty=format:"%h|%s|%b"`).split('\n');
  
  // Look for AI collaboration indicators
  const aiCommits = commits.filter(commit => {
    const parts = commit.split('|');
    const message = parts[1] || '';
    const body = parts[2] || '';
    
    return (
      message.includes('AI') ||
      message.includes('Copilot') ||
      message.includes('pair') ||
      body.includes('AI') ||
      body.includes('Copilot') ||
      body.includes('pair')
    );
  });
  
  return aiCommits.length;
}

// Generate learning context document
function generateLearningContext() {
  console.log('Generating AI learning context...');
  
  const insights = extractPatternsFromDevlog();
  const aiCommitCount = analyzeCommits();
  
  // Generate the content
  const content = `# AI Learning Context
  
## Project Overview

This document is automatically generated to provide learning context for AI assistants working on this project.

## Recent Activity

In the last ${DAYS_TO_ANALYZE} days, there have been approximately ${aiCommitCount} commits involving AI collaboration.

## Key Insights from Development History

${insights.map(insight => `- ${insight}`).join('\n')}

## Effective Collaboration Patterns

The following patterns have been effective in this project:

1. **Clear Context Provision**: Providing complete context about the problem domain
2. **Incremental Development**: Breaking down complex tasks into smaller steps
3. **Code Review Collaboration**: Using AI to review code and suggest improvements
4. **Documentation Assistance**: Collaborating on maintaining project documentation

## Project-Specific Knowledge

This section contains project-specific knowledge that has been identified as valuable for AI assistants:

- The project uses a monorepo structure with Go backend and React frontend
- Protocol Buffers are used for API definitions
- Kubernetes is used for deployment
- Tilt is used for local development

## Learning Recommendations

Based on project history, here are recommendations for improving AI-human collaboration:

1. Focus on providing clear context when starting new features
2. Document successful patterns in the ai-patterns directory
3. Update DEVLOG.md with insights from each development session
4. Review and refine this learning context regularly

`;

  fs.writeFileSync(OUTPUT_PATH, content);
  console.log(`Learning context generated at: ${OUTPUT_PATH}`);
}

// Main execution
try {
  if (!fs.existsSync(AI_PATTERNS_DIR)) {
    fs.mkdirSync(AI_PATTERNS_DIR, { recursive: true });
  }
  generateLearningContext();
} catch (error) {
  console.error('Error generating learning context:', error);
  process.exit(1);
}
