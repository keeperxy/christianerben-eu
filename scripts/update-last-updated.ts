import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const CONTENT_FILE = path.join(ROOT_DIR, "src", "content", "content.ts");

// Monatsnamen in Deutsch und Englisch
const MONTHS_DE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"
];

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

async function updateLastUpdated() {
  try {
    // Aktuelles Datum ermitteln
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const year = now.getFullYear();

    const monthNameDE = MONTHS_DE[month];
    const monthNameEN = MONTHS_EN[month];

    // Datei lesen
    const content = await readFile(CONTENT_FILE, "utf-8");

    // Regulärer Ausdruck zum Finden und Ersetzen des lastUpdated Feldes
    // Sucht nach: lastUpdated: { en: "Last updated: [MONTH YEAR]", de: "Letzte Aktualisierung: [MONTH YEAR]" }
    const lastUpdatedRegex = /(lastUpdated:\s*{\s*en:\s*"Last updated:\s*)[^"]+(",\s*de:\s*"Letzte Aktualisierung:\s*)[^"]+(",\s*})/s;

    if (!lastUpdatedRegex.test(content)) {
      console.error("❌ Could not find lastUpdated field in content.ts");
      console.error("Looking for pattern: lastUpdated: { en: \"Last updated: ...\", de: \"Letzte Aktualisierung: ...\" }");
      process.exit(1);
    }

    // Ersetzen
    const updatedContent = content.replace(
      lastUpdatedRegex,
      `$1${monthNameEN} ${year}$2${monthNameDE} ${year}$3`
    );

    // Datei schreiben
    await writeFile(CONTENT_FILE, updatedContent, "utf-8");

    console.log(`✅ Updated lastUpdated to: ${monthNameEN} ${year} / ${monthNameDE} ${year}`);
  } catch (error) {
    console.error("❌ Failed to update lastUpdated:", error);
    process.exit(1);
  }
}

updateLastUpdated();

