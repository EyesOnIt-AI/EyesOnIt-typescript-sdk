export const EOISocketRoomNames = {
    allStreamUpdates: "all_stream_updates",
    allStreamDetections: "all_stream_detections",
    allPerformanceUpdates: "all_performance_updates",
    allLiveSearchUpdates: "all_live_search_updates",
    liveSearchDetections: "live_search_detections",
    allCountUpdates: "all_count_updates",
    allVideoProcessingUpdates: "all_video_processing_updates",
} as const;

export type EOISocketStaticRoomName = typeof EOISocketRoomNames[keyof typeof EOISocketRoomNames];

export const EOISocketRooms = {
    ...EOISocketRoomNames,
    liveSearchDetectionsForSearch(searchId: string | number): string {
        return `${EOISocketRoomNames.liveSearchDetections}_${searchId}`;
    },
} as const;
