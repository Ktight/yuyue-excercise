export async function registerServiceWorker(): Promise<void> {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('/sw.js');
  } catch (error) {
    console.warn('[pwa] service worker registration failed', error);
  }
}
