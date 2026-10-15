import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
function command(binary, args, cwd = root) {
  return execFileSync(binary, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
}

if (command('git', ['status', '--porcelain'])) {
  throw new Error('Commit source changes before deploying so version.json identifies the exact build.');
}
const sourceCommit = command('git', ['rev-parse', 'HEAD']);
const remote = command('git', ['remote', 'get-url', 'origin']);
console.log(command('npm', ['test']));
console.log(command('npm', ['run', 'build']));
const publishDirectory = await mkdtemp(join(tmpdir(), 'plot-twist-pages-'));

try {
  command('git', ['init', '-b', 'gh-pages'], publishDirectory);
  command('git', ['remote', 'add', 'origin', remote], publishDirectory);
  const branch = command('git', ['ls-remote', '--heads', 'origin', 'gh-pages'], publishDirectory);
  if (branch) {
    command('git', ['fetch', '--depth=1', 'origin', 'gh-pages'], publishDirectory);
    command('git', ['checkout', '-B', 'gh-pages', 'FETCH_HEAD'], publishDirectory);
  }
  for (const name of await readdir(publishDirectory)) {
    if (name !== '.git') await rm(join(publishDirectory, name), { recursive: true, force: true });
  }
  await cp(join(root, 'dist'), publishDirectory, { recursive: true });
  await writeFile(join(publishDirectory, '.nojekyll'), '');
  await writeFile(join(publishDirectory, 'version.json'), JSON.stringify({ sourceCommit }, null, 2) + '\n');
  command('git', ['add', '.'], publishDirectory);
  command('git', ['commit', '-m', `Deploy source ${sourceCommit.slice(0, 7)}`], publishDirectory);
  command('git', ['push', 'origin', 'gh-pages'], publishDirectory);
  console.log(`Published source ${sourceCommit} to gh-pages.`);
} finally {
  await rm(publishDirectory, { recursive: true, force: true });
}
