import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

const OUTPUT_SUBDIR = 'design';

/**
 * Builds the Storybook catalog into the site's dist tree as part of
 * `astro build`, so the design system ships at `/design/` alongside the
 * rendered pages — same artifact, same deploy, one command.
 *
 * Only `astro:build:done` is wired: `astro dev` stays untouched, and
 * `pnpm storybook` remains the way to iterate on stories locally.
 */
export function storybook(): AstroIntegration {
  return {
    name: 'storybook',
    hooks: {
      // `dir` is the client output URL (dist/client/ for the cloudflare adapter).
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(new URL(`./${OUTPUT_SUBDIR}/`, dir));
        logger.info('Building Storybook…');
        await run('pnpm', ['exec', 'storybook', 'build', '--output-dir', outDir, '--quiet']);
        logger.info(`Wrote Storybook to /${OUTPUT_SUBDIR}/`);
      },
    },
  };
}

function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}
