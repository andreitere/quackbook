import { useEventBus, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMetaStore = defineStore('metaStore', () => {
    const showToolbar = useStorage('showToolbar', false);
    const showImportFiles = ref(false);
    const showMountFileSystem = ref(false);
    const cmdMenu = ref(false);
    const shareLink = ref('');
    const quackMode = ref(false);

    const startFilesImport = () => {
        showImportFiles.value = true;
        cmdMenu.value = false;
    };

    const startMountFileSystem = () => {
        showMountFileSystem.value = true;
        cmdMenu.value = false;
    };

    return {
        cmdMenu,
        showToolbar,
        shareLink,
        startFilesImport,
        showImportFiles,
        showMountFileSystem,
        startMountFileSystem,
        quackMode,
    };
});

export const db_events = useEventBus('db_events');
