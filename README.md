# EyesOnIt Typescript SDK

EyesOnIt makes advanced computer vision accessible to anyone without data science or computer programming skills. Through the EyesOnIt configuration user interface, you can use English text to describe the objects and events that you want to detect. You can monitor your video streams and start receiving alerts by text message in just a few minutes. If you have basic programming skills, you can use our SDK or REST API to quickly enable endless scenarios like these:

- Motion-based detection: trigger computer vision after motion is detected
- Event recording: capture and store your own data about detections
- Object tracking: track objects to alert on object count or line cross detection
- Image categorization: categorize a collection of images according to the contents

Traditional computer vision involves a complex process to train and tune a computer vision model. This process typically requires weeks or months of time from experts with an advanced and specialized skillset. The cost for this process is often $50,000 to $100,000 USD or more. EyesOnIt is different. With EyesOnIt, you describe what you want to detect with English text. EyesOnIt compares your text to your image or video and tells you if it detected what you described.

See this guide to learn how to download and run the EyesOnIt Docker container:
https://developer.eyesonit.us/documentation

### Installation ###

The TypeScript SDK can be installed from this repository by running:

```
npm install
```

The package now builds both formats:

- ESM for browser bundlers like Vite
- CommonJS for existing Node.js consumers

If you are working in the SDK repo directly, build artifacts can be regenerated with:

```
npm run build
```

If you need a distributable tarball (for example to publish or to use with a file: dependency), run:

```
npm pack
```

This will create `eyesonit-typescript-sdk-5.0.0.tgz` in the project root.

### Usage ###

```

```

### Startup model optimization ###

EyesOnIt starts its GPU TensorRT optimization asynchronously. Before submitting a
model-backed request, call `getModelOptimizationStatus()` once. Then configure
`EOISocketClient` with `handleModelOptimizationStatus` to receive state changes
without polling. The payload reports the current model and `completed_models` /
`total_models`; only `state === "ready"` permits model operations. A terminal
`failed` state can be restarted with `retryModelOptimization()` after the server
issue has been corrected.

### API Documentation ###

Generate markdown API reference docs from TypeScript comments:

```
npm run docs:api
```

Generated output:

```
generated/docs/sdk-api
```

See [docs/DOCUMENTATION_WORKFLOW.md](docs/DOCUMENTATION_WORKFLOW.md) for the recommended process to keep docs updated and publish them in Docusaurus.

### Questions? ###

email us at support@eyesonit.us
