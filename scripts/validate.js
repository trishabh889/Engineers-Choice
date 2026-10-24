/**
 * CI/CD Pre-flight Validation Script
 * Verifies HTML documents, JavaScript syntax, stylesheet links, and internal navigation.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const REQUIRED_FILES = [
  'index.html',
  'about.html',
  'services.html',
  'products.html',
  'contact.html',
  'css/style.css',
  'js/script.js',
  'server.js'
];

let errors = [];
let passed = 0;

console.log('🔍 Starting CI/CD Pre-deployment Validation Checks...\n');

// 1. Check all required files exist
console.log('1️⃣ Checking Required Files Integrity:');
REQUIRED_FILES.forEach(file => {
  const fullPath = path.join(ROOT_DIR, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ Found: ${file}`);
    passed++;
  } else {
    console.error(`  ❌ Missing: ${file}`);
    errors.push(`Missing essential file: ${file}`);
  }
});

// 2. JavaScript Syntax Verification (node --check)
console.log('\n2️⃣ Checking JavaScript Syntax:');
const jsFiles = ['js/script.js', 'server.js'];
jsFiles.forEach(file => {
  const fullPath = path.join(ROOT_DIR, file);
  try {
    execSync(`node --check "${fullPath}"`, { stdio: 'pipe' });
    console.log(`  ✅ Syntax valid: ${file}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ Syntax error in ${file}:`, err.message);
    errors.push(`JavaScript syntax error in ${file}`);
  }
});

// 3. HTML Standards & Internal Links Validation
console.log('\n3️⃣ Verifying HTML Standards & Asset Links:');
const htmlFiles = ['index.html', 'about.html', 'services.html', 'products.html', 'contact.html'];
htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf-8');

  // Verify basic tags
  const checks = [
    { regex: /<!DOCTYPE\s+html>/i, name: 'Valid <!DOCTYPE html>' },
    { regex: /<meta\s+name=["']viewport["']/i, name: 'Viewport meta tag' },
    { regex: /<meta\s+charset=["']UTF-8["']/i, name: 'UTF-8 charset' },
    { regex: /<title>.*<\/title>/i, name: 'Document <title>' },
    { regex: /href=["']css\/style\.css["']/, name: 'CSS stylesheet link' },
    { regex: /src=["']js\/script\.js["']/, name: 'JS script link' }
  ];

  checks.forEach(check => {
    if (check.regex.test(content)) {
      passed++;
    } else {
      errors.push(`In ${file}: Missing ${check.name}`);
    }
  });

  // Verify internal HTML href links resolve
  const linkMatches = content.matchAll(/href=["']([a-zA-Z0-9_\-]+\.html)["']/g);
  for (const match of linkMatches) {
    const linkedFile = match[1];
    const targetPath = path.join(ROOT_DIR, linkedFile);
    if (!fs.existsSync(targetPath)) {
      errors.push(`In ${file}: Broken internal link to "${linkedFile}"`);
    }
  }

  console.log(`  ✅ Verified HTML structure & links for: ${file}`);
});

// Final Report
console.log('\n' + '='.repeat(50));
if (errors.length === 0) {
  console.log(`🎉 ALL CHECKS PASSED (${passed} assertions)! Ready for deployment.`);
  console.log('='.repeat(50));
  process.exit(0);
} else {
  console.error(`❌ VALIDATION FAILED with ${errors.length} error(s):`);
  errors.forEach(err => console.error(`  - ${err}`));
  console.log('='.repeat(50));
  process.exit(1);
}

