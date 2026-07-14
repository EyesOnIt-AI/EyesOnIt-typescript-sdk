import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
  EOIArchiveSearchInputs,
  EOIGetInteractionEventsInputs,
  EOIGetVideoStatusInputs,
  EOINotification,
  EOILiveSearchInputs,
  EOIProcessVideoInputs,
  EOISimilarityConfig,
  EOISimilarityImage,
  EOISocketClient,
  EOIStopVideoInputs,
  EOIUpdateLiveSearchInputs,
  EyesOnItAPI,
} from "../src";

const enabled = process.env.EOI_SDK_INTEGRATION === "1";
const server = process.env.EOI_TEST_SERVER ?? "http://127.0.0.1:8000";
const assetRoot = process.env.EOI_TEST_ASSET_ROOT ?? "/home/matt/eoi/test_files";
const backendRoot = process.env.EOI_BACKEND_ROOT ?? resolve(process.cwd(), "../eoi-aas-v5.0");
const seedFile = process.env.EOI_CLIENT_SEED_FILE;
const videoConfig = process.env.EOI_CLIENT_VIDEO_CONFIG ?? resolve(backendRoot, "tests/assets/configs/v2/forklift_scenario_5.json");
const videoPath = process.env.EOI_CLIENT_VIDEO_PATH ?? resolve(assetRoot, "videos/Forklift/Scenario_5_moving_forklift_person_stops_safe.MP4");
const seedPrefix = process.env.EOI_CLIENT_SEED_PREFIX ?? "phase4_sdk";
const similarityImagePath = process.env.EOI_CLIENT_SIMILARITY_IMAGE;
const facePersonId = process.env.EOI_CLIENT_FACE_PERSON_ID ?? "phase0_alvin_01";
const interactionConfig = process.env.EOI_CLIENT_INTERACTION_CONFIG;
const interactionVideo = process.env.EOI_CLIENT_INTERACTION_VIDEO;
const archiveSeedLocalTime = process.env.EOI_CLIENT_ARCHIVE_SEED_LOCAL_TIME;
const pollIntervalMs = 1_000;
const api = new EyesOnItAPI(server);

const archiveSeedDate = archiveSeedLocalTime?.slice(0, 10);
const archiveSeedEndDate = archiveSeedDate
  ? new Date(new Date(`${archiveSeedDate}T00:00:00.000Z`).getTime() + 24 * 60 * 60_000).toISOString().slice(0, 10)
  : undefined;

let indexedSource = "";

async function waitUntil<T>(operation: () => Promise<T>, ready: (value: T) => boolean, timeoutMs: number): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  let value = await operation();
  while (!ready(value) && Date.now() < deadline) {
    await new Promise((resolveDelay) => setTimeout(resolveDelay, pollIntervalMs));
    value = await operation();
  }
  return value;
}

async function waitForEntitlements(): Promise<void> {
  const license = await waitUntil(
    () => api.getLicenseStatus(),
    (status) =>
      status.success &&
      status.valid === true &&
      status.permissions?.archived_video === true &&
      status.permissions?.archive_search === true &&
      status.permissions?.live_search === true,
    120_000,
  );

  expect(license.success).toBe(true);
  expect(license.valid).toBe(true);
  expect(license.permissions).toMatchObject({ archived_video: true, archive_search: true, live_search: true });
}

function videoInputs(realTime = false): EOIProcessVideoInputs {
  const fixture = JSON.parse(readFileSync(videoConfig, "utf8"));
  fixture.name = `${seedPrefix}_${Date.now()}`;
  fixture.input_video_path = videoPath;
  fixture.index_for_search = true;
  fixture.search_index_types = ["person"];
  fixture.real_time = realTime;
  if (!realTime && archiveSeedLocalTime) {
    fixture.video_start_local_time = archiveSeedLocalTime;
  } else {
    // Live-search candidates must use the server's current local wall clock.
    delete fixture.video_start_local_time;
  }
  delete fixture.fixture_provenance;
  delete fixture.test_asset_id;
  return EOIProcessVideoInputs.fromJsonObj(fixture);
}

function similarityConfig(): EOISimilarityConfig {
  if (!similarityImagePath) throw new Error("EOI_CLIENT_SIMILARITY_IMAGE is required");
  const seed = new EOISimilarityImage();
  seed.image = readFileSync(similarityImagePath).toString("base64");
  seed.alert = true;
  seed.threshold = 1;
  const similarity = new EOISimilarityConfig();
  similarity.images = [seed];
  return similarity;
}

function archivePersonSearch(): EOIArchiveSearchInputs {
  const inputs = new EOIArchiveSearchInputs();
  inputs.search_type = "natural_language";
  inputs.class_name = "person";
  inputs.object_description = "person";
  if (archiveSeedDate && archiveSeedEndDate) {
    inputs.start_date_time = `${archiveSeedDate}T00:00:00.000Z`;
    inputs.end_date_time = `${archiveSeedEndDate}T00:00:00.000Z`;
  } else {
    const now = Date.now();
    inputs.start_date_time = new Date(now - 5 * 60_000).toISOString();
    inputs.end_date_time = new Date(now + 5 * 60_000).toISOString();
  }
  return inputs;
}

function livePersonSearch(): EOILiveSearchInputs {
  const inputs = new EOILiveSearchInputs();
  inputs.search_type = "natural_language";
  inputs.class_name = "person";
  inputs.object_description = "person";
  inputs.alert_threshold = 1;
  inputs.duration_seconds = 180;
  inputs.notification = new EOINotification(null, false);
  return inputs;
}

function archiveFaceSearch(): EOIArchiveSearchInputs {
  const inputs = archivePersonSearch();
  inputs.search_type = "face_recognition";
  inputs.face_match_type = "person";
  inputs.face_person_id = facePersonId;
  inputs.object_description = undefined as unknown as string;
  return inputs;
}

function archiveSimilaritySearch(): EOIArchiveSearchInputs {
  const inputs = archivePersonSearch();
  inputs.search_type = "similarity";
  inputs.similarity = similarityConfig();
  inputs.object_description = undefined as unknown as string;
  return inputs;
}

function liveFaceSearch(): EOILiveSearchInputs {
  const inputs = livePersonSearch();
  inputs.search_type = "face_recognition";
  inputs.face_match_type = "person";
  inputs.face_person_id = facePersonId;
  inputs.object_description = undefined as unknown as string;
  inputs.alert_threshold = 1;
  return inputs;
}

function liveSimilaritySearch(): EOILiveSearchInputs {
  const inputs = livePersonSearch();
  inputs.search_type = "similarity";
  inputs.similarity = similarityConfig();
  inputs.object_description = undefined as unknown as string;
  inputs.alert_threshold = 1;
  return inputs;
}

describe.runIf(enabled)("EyesOnItAPI live integration", () => {
  beforeAll(waitForEntitlements, 125_000);

  it("processes and indexes a deterministic video through typed routes", async () => {
    const alive = await api.isEoiAlive();
    const modelStatus = await api.getModelOptimizationStatus();

    expect(alive.success).toBe(true);
    expect(modelStatus.success).toBe(true);
    expect(modelStatus.state).toBe("ready");

    const started = await api.processVideo(videoInputs());
    expect(started.success).toBe(true);
    expect(started.video_id).toBeTruthy();

    const completed = await waitUntil(
      () => api.getVideoStatus(new EOIGetVideoStatusInputs(started.video_id)),
      (status) => ["completed", "failed"].includes(status.video?.status),
      300_000,
    );
    expect(completed.success).toBe(true);
    expect(completed.video?.status).toBe("completed");
    indexedSource = completed.video?.input_video_name;
    expect(indexedSource.startsWith(`${seedPrefix}_`)).toBe(true);

    if (seedFile) {
      writeFileSync(seedFile, JSON.stringify({ indexed_source: indexedSource, video_id: started.video_id }, null, 2));
    }
  }, 310_000);

  it("finds the freshly indexed source through typed archive search", async () => {
    expect(indexedSource).toBeTruthy();
    const archive = await api.searchArchive(archivePersonSearch());
    expect(archive.success).toBe(true);
    expect(archive.results.some((result) => result.file === indexedSource)).toBe(true);
  }, 120_000);

  it("runs typed face and similarity archive searches against the isolated source", async () => {
    expect(indexedSource).toBeTruthy();
    for (const search of [archiveFaceSearch(), archiveSimilaritySearch()]) {
      const response = await api.searchArchive(search);
      expect(response.success).toBe(true);
      expect(response.results.some((result) => result.file === indexedSource)).toBe(true);
    }
  }, 180_000);

  it("serializes zero-dwell v2 interaction rules and queries events by job stream id", async () => {
    if (!interactionConfig || !interactionVideo) throw new Error("Interaction fixture environment is required");
    const fixture = JSON.parse(readFileSync(interactionConfig, "utf8"));
    fixture.name = `${seedPrefix}_interaction_${Date.now()}`;
    fixture.input_video_path = interactionVideo;
    fixture.real_time = false;
    delete fixture.fixture_provenance;
    delete fixture.test_asset_id;
    const inputs = EOIProcessVideoInputs.fromJsonObj(fixture);
    const serialized = JSON.parse(inputs.stringify());
    const fastRule = serialized.regions[0].rules.find((rule: any) =>
      String(rule.rule_id).endsWith("fast_primary_alert"),
    );
    expect(fastRule.condition.type).toBe("interaction.close_approach");
    expect(fastRule.condition.dwell_seconds).toBe(0);

    const started = await api.processVideo(inputs);
    expect(started.success).toBe(true);
    const completed = await waitUntil(
      () => api.getVideoStatus(new EOIGetVideoStatusInputs(started.video_id)),
      (status) => ["completed", "failed"].includes(status.video?.status),
      180_000,
    );
    expect(completed.video?.status).toBe("completed");
    const events = await api.getInteractionEvents(new EOIGetInteractionEventsInputs({
      stream_id: started.video_id,
      rule_type: "close_approach",
      limit: 100,
    }));
    expect(events.success).toBe(true);
    expect(Array.isArray(events.events)).toBe(true);
  }, 200_000);

  it("creates, pauses, resumes, and cancels a typed live search", async () => {
    const searches = [livePersonSearch(), liveFaceSearch(), liveSimilaritySearch()];
    for (const [index, search] of searches.entries()) {
      const response = await api.searchLive(search);
      expect(response.success).toBe(true);
      expect(response.search_id).toBeGreaterThan(0);
      const room = `live_search_detections_${response.search_id}`;
      let resolveSubscription!: () => void;
      let resolveDetection!: () => void;
      let rejectDetection!: (error: Error) => void;
      const subscribed = new Promise<void>((resolve) => { resolveSubscription = resolve; });
      const detected = new Promise<void>((resolve, reject) => {
        resolveDetection = resolve;
        rejectDetection = reject;
      });
      const client = new EOISocketClient({
        apiBaseUrl: server,
        clientId: `${seedPrefix}-${index}-${Date.now()}`,
        handlers: {
          handleSubscribed(message) {
            if (message.room === room) resolveSubscription();
          },
          handleLiveSearchDetection(message) {
            if (message.detections.length > 0) resolveDetection();
          },
          handleSubscriptionError(message) {
            rejectDetection(new Error(`Socket subscription failed: ${message.message}`));
          },
        },
      });
      let liveVideoId: string | undefined;
      let primaryError: unknown;
      let cancellationFailed = false;
      try {
        client.joinLiveSearchDetections(response.search_id);
        await client.connect();
        await Promise.race([
          subscribed,
          new Promise((_, rejectTimeout) => setTimeout(() => rejectTimeout(new Error(`Timed out subscribing to ${room}`)), 10_000)),
        ]);
        const update = new EOIUpdateLiveSearchInputs(response.search_id);
        expect((await api.pauseLiveSearch(update)).success).toBe(true);
        expect((await api.resumeLiveSearch(update)).success).toBe(true);
        const liveInputs = videoInputs(true);
        liveInputs.name = `${seedPrefix}_live_${index}_${Date.now()}`;
        const started = await api.processVideo(liveInputs);
        expect(started.success).toBe(true);
        liveVideoId = started.video_id;
        await Promise.race([
          detected,
          new Promise((_, rejectTimeout) => setTimeout(() => rejectTimeout(new Error(`Timed out waiting for SDK live detection type=${search.search_type}`)), 90_000)),
        ]);
      } catch (error) {
        primaryError = error;
      } finally {
        if (liveVideoId) await api.stopVideo(new EOIStopVideoInputs(liveVideoId));
        cancellationFailed = !(await api.cancelLiveSearch(new EOIUpdateLiveSearchInputs(response.search_id))).success;
        client.disconnect();
      }
      if (primaryError) throw primaryError;
      expect(cancellationFailed, `live search ${response.search_id} should remain cancellable`).toBe(false);
    }
  }, 330_000);
});
