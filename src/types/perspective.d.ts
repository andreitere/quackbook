declare namespace JSX {
    interface IntrinsicElements {
        'perspective-viewer': any;
    }
}

declare module '@finos/perspective-viewer' {
    class PerspectiveElement extends HTMLElement {
        load(table: unknown): Promise<void>;
    }
    
    const perspectiveViewer: {
        init_client(wasm: Response | ArrayBuffer | Promise<Response | ArrayBuffer>): Promise<void>;
    };
    
    export { PerspectiveElement as PerspectiveViewer };
    export default perspectiveViewer;
}

declare module '@finos/perspective' {
    interface PerspectiveWorker {
        table(data: Record<string, unknown>[] | Record<string, unknown>): Promise<unknown>;
    }
    
    const perspective: {
        worker(): Promise<PerspectiveWorker>;
        init_server(wasm: Response | ArrayBuffer | Promise<Response | ArrayBuffer>): Promise<void>;
    };
    
    export default perspective;
}

// Declare the custom element
declare global {
    interface HTMLElementTagNameMap {
        'perspective-viewer': import('@finos/perspective-viewer').PerspectiveElement;
    }
} 