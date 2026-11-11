import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import * as liveCheck from "./check-live-no-grok-extension.mjs";

// Kept apart from check-live-no-grok-extension.test.mjs so that file only needs scripts/.
test("REL-02 live check: CHỈNAM marker is the title of the app root route", () => {
  assert.equal(liveCheck.CHINAM_APP_MARKER, "<title>CHỈNAM — Bàn vận hành</title>");
  const route = readFileSync(new URL("../src/routes/index.tsx", import.meta.url), "utf8");
  assert.ok(
    route.includes('title: "CHỈNAM — Bàn vận hành"'),
    "src/routes/index.tsx no longer sets the title the live check relies on",
  );
});
