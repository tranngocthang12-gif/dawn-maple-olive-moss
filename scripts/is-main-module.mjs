import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * True when the module at `metaUrl` is the script Node was started with.
 *
 * Node sets `import.meta.url` of the entry module from its realpath, while
 * `process.argv[1]` is only resolved, so a plain string comparison is false when
 * the script is invoked through a symlink — and a guarded `main()` then silently
 * never runs (exit 0). Comparing the realpath of both sides avoids that.
 *
 * @param {string} metaUrl `import.meta.url` of the calling module
 * @param {string | undefined} [argv1]
 */
export function isMainModule(metaUrl, argv1 = process.argv[1]) {
  if (!argv1) return false;
  try {
    const self = realpathSync(fileURLToPath(metaUrl));
    const entry = realpathSync(argv1);
    return process.platform === "win32"
      ? self.toLowerCase() === entry.toLowerCase()
      : self === entry;
  } catch {
    return false;
  }
}
