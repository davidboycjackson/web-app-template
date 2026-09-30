const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dirName = path.basename(root);

const words = dirName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());

if (words.length === 0) {
    console.error(`Cannot derive a project name from directory "${dirName}".`);
    process.exit(1);
}

const kebab = words.join('-');
const snake = words.join('_');
const title = words.map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

// The clone URL in the README must keep pointing at the template repository.
const notInRepoUrl = '(?<!github\\.com/[^/\\s]+/)';
const replacements = [
    [new RegExp(`${notInRepoUrl}web-app-template`, 'g'), kebab],
    [/Web App Template/g, title],
    [/web_app_template/g, snake],
];

const skipDirs = new Set([
    '.git',
    'node_modules',
    '.venv',
    'venv',
    'dist',
    'build',
    'coverage',
    '__pycache__',
    '.pytest_cache',
    '.mypy_cache',
    '.ruff_cache',
]);
const selfPath = path.resolve(__filename);

function* walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (!skipDirs.has(entry.name) && !entry.name.endsWith('.egg-info')) {
                yield* walk(fullPath);
            }
        } else if (entry.isFile() && fullPath !== selfPath) {
            yield fullPath;
        }
    }
}

const changed = [];
for (const file of walk(root)) {
    const buffer = fs.readFileSync(file);
    if (buffer.includes(0)) continue;

    const original = buffer.toString('utf8');
    const updated = replacements.reduce((text, [pattern, value]) => text.replace(pattern, value), original);
    if (updated !== original) {
        fs.writeFileSync(file, updated);
        changed.push(path.relative(root, file));
    }
}

if (changed.length === 0) {
    console.log('No template names found; nothing to rename.');
} else {
    console.log(`Renamed project to "${kebab}" / "${title}" / "${snake}" in:`);
    for (const file of changed) console.log(`  ${file}`);
    console.log('\nReinstall the backend package: cd apps/backend && pip install -e ".[dev]"');
}
