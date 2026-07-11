import { describe, expect, it } from "vitest";
import {
  EOIArchiveSearchInputs,
  EOINotification,
  EOILiveSearchInputs,
  EOIUpdateLiveSearchInputs,
  EyesOnItAPI,
} from "../src";

const enabled = process.env.EOI_SDK_INTEGRATION === "1";
const server = process.env.EOI_TEST_SERVER ?? "http://127.0.0.1:8000";

function archivePersonSearch(): EOIArchiveSearchInputs {
  const inputs = new EOIArchiveSearchInputs();
  inputs.search_type = "natural_language";
  inputs.class_name = "person";
  inputs.object_description = "person";
  return inputs;
}

function livePersonSearch(): EOILiveSearchInputs {
  const inputs = new EOILiveSearchInputs();
  inputs.search_type = "natural_language";
  inputs.class_name = "person";
  inputs.object_description = "person";
  inputs.alert_threshold = 75;
  inputs.duration_seconds = 30;
  inputs.notification = new EOINotification(null, false);
  return inputs;
}

describe.runIf(enabled)("EyesOnItAPI live integration", () => {
  const api = new EyesOnItAPI(server);

  it("uses typed health, readiness, and archive-search routes", async () => {
    const alive = await api.isEoiAlive();
    const modelStatus = await api.getModelOptimizationStatus();
    const archive = await api.searchArchive(archivePersonSearch());

    expect(alive.success).toBe(true);
    expect(modelStatus.success).toBe(true);
    expect(archive.success).toBe(true);
    expect(archive.results.length).toBeGreaterThan(0);
  }, 120_000);

  it("creates, pauses, resumes, and cancels a typed live search", async () => {
    const created = await api.searchLive(livePersonSearch());
    expect(created.success).toBe(true);
    expect(created.search_id).toBeGreaterThan(0);

    const update = new EOIUpdateLiveSearchInputs(created.search_id);
    try {
      expect((await api.pauseLiveSearch(update)).success).toBe(true);
      expect((await api.resumeLiveSearch(update)).success).toBe(true);
    } finally {
      expect((await api.cancelLiveSearch(update)).success).toBe(true);
    }
  }, 120_000);
});
