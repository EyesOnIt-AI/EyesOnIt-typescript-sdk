import { beforeEach, describe, expect, it, vi } from "vitest";

const axiosMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  isAxiosError: vi.fn((error: unknown) => Boolean((error as { isAxiosError?: boolean } | null)?.isAxiosError)),
}));

vi.mock("axios", () => ({
  default: axiosMock,
  ...axiosMock,
}));

import { EOIAxiosRESTHandler } from "../src";

const ENDPOINT = "https://api.example.test/process_image";

function createLogger() {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

function axiosError(
  message: string,
  init: {
    code?: string;
    response?: { status: number; data: unknown };
    config?: { url?: string };
  } = {},
): Error & {
  isAxiosError: true;
  code?: string;
  response?: { status: number; data: unknown };
  config?: { url?: string };
} {
  return Object.assign(new Error(message), {
    isAxiosError: true as const,
    ...init,
  });
}

describe("EOIAxiosRESTHandler", () => {
  beforeEach(() => {
    axiosMock.get.mockReset();
    axiosMock.post.mockReset();
    axiosMock.isAxiosError.mockClear();
  });

  it("maps successful GET and POST responses and passes configured timeout", async () => {
    const logger = createLogger();
    const handler = new EOIAxiosRESTHandler(logger, { timeoutMs: 2500, maxAttempts: 1 });
    const body = { file: "image-base64" };
    const headers = { "Content-Type": "application/json", Accept: "*/*" };

    axiosMock.get.mockResolvedValueOnce({
      data: { success: true, message: "healthy", data: { status: "ok" } },
    });
    axiosMock.post.mockResolvedValueOnce({
      data: { success: true, message: "processed", data: { detections: [] } },
    });

    const getResponse = await handler.get(ENDPOINT);
    const postResponse = await handler.post(ENDPOINT, body, headers);

    expect(axiosMock.get).toHaveBeenCalledWith(ENDPOINT, { timeout: 2500 });
    expect(axiosMock.post).toHaveBeenCalledWith(ENDPOINT, body, { headers, timeout: 2500 });
    expect(getResponse).toMatchObject({ success: true, message: "healthy", data: { status: "ok" } });
    expect(postResponse).toMatchObject({ success: true, message: "processed", data: { detections: [] } });
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("logs Axios response payloads without writing directly to console", async () => {
    const logger = createLogger();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const handler = new EOIAxiosRESTHandler(logger, { maxAttempts: 3 });
    const error = axiosError("Request failed with status code 400", {
      response: {
        status: 400,
        data: { success: false, message: "invalid request", details: ["missing file"] },
      },
      config: { url: ENDPOINT },
    });
    axiosMock.post.mockRejectedValueOnce(error);

    const response = await handler.post(ENDPOINT, { file: "" }, { "Content-Type": "application/json" });

    expect(response).toMatchObject({ success: false, message: "Request failed with status code 400" });
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('"details":["missing file"]'));
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("retries retryable connection errors up to the configured attempt count", async () => {
    const logger = createLogger();
    const handler = new EOIAxiosRESTHandler(logger, { timeoutMs: 1000, maxAttempts: 3 });
    const retryableError = axiosError("socket hang up", {
      code: "ECONNRESET",
      config: { url: ENDPOINT },
    });

    axiosMock.get
      .mockRejectedValueOnce(retryableError)
      .mockRejectedValueOnce(retryableError)
      .mockResolvedValueOnce({
        data: { success: true, message: "ok", data: { attempt: 3 } },
      });

    const response = await handler.get(ENDPOINT);

    expect(response).toMatchObject({ success: true, message: "ok", data: { attempt: 3 } });
    expect(axiosMock.get).toHaveBeenCalledTimes(3);
    expect(axiosMock.get).toHaveBeenNthCalledWith(1, ENDPOINT, { timeout: 1000 });
    expect(logger.warn).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("retryable request failure on attempt 1"));
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("maps network error details when retries are disabled", async () => {
    const logger = createLogger();
    const handler = new EOIAxiosRESTHandler(logger, { maxAttempts: 1 });
    axiosMock.get.mockRejectedValueOnce(axiosError("timeout exceeded", {
      code: "ECONNABORTED",
      config: { url: ENDPOINT },
    }));

    const response = await handler.get(ENDPOINT);

    expect(response).toMatchObject({ success: false, message: "timeout exceeded" });
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('"code":"ECONNABORTED"'));
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`"url":"${ENDPOINT}"`));
  });
});
