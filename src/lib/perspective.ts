import perspective from "@finos/perspective";
import perspective_viewer from "@finos/perspective-viewer";
import SERVER_WASM from "@finos/perspective/dist/wasm/perspective-server.wasm?url";
import CLIENT_WASM from "@finos/perspective-viewer/dist/wasm/perspective-viewer.wasm?url";

let initialized = false;
let worker: Awaited<ReturnType<typeof perspective.worker>> | null = null;

export async function initPerspective() {
    if (initialized) return;
    
    await Promise.all([
        perspective.init_server(fetch(SERVER_WASM)),
        perspective_viewer.init_client(fetch(CLIENT_WASM))
    ]);
    
    worker = await perspective.worker();
    initialized = true;
    
    return worker;
}

export function getPerspectiveWorker(): Awaited<ReturnType<typeof perspective.worker>> {
    if (!initialized || !worker) {
        throw new Error("Perspective not initialized. Call initPerspective() first.");
    }
    return worker;
} 