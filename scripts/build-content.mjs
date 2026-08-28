import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const root = process.cwd();

async function readCollection(path, type) {
  const files = await readdir(join(root, path), { withFileTypes: true });
  const entries = await Promise.all(
    files
      .filter((file) => file.isFile() && file.name.endsWith(".json"))
      .map(async (file) => {
        const entry = JSON.parse(await readFile(join(root, path, file.name), "utf8"));
        return { ...entry, type, slug: basename(file.name, ".json") };
      }),
  );
  return entries.filter((entry) => entry.published !== false);
}

const news = (await readCollection("content/news", "news")).sort(
  (a, b) => new Date(b.date) - new Date(a.date),
);
const animals = [
  ...(await readCollection("content/animals/cats", "cat")),
  ...(await readCollection("content/animals/dogs", "dog")),
].sort((a, b) => a.name.localeCompare(b.name, "ru"));

await mkdir(join(root, "data"), { recursive: true });
await writeFile(join(root, "data/news.json"), JSON.stringify(news, null, 2) + "\n");
await writeFile(join(root, "data/animals.json"), JSON.stringify(animals, null, 2) + "\n");
