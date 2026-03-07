export class PWAService {
  private static instance: PWAService;
  private swRegistration: ServiceWorkerRegistration | null = null;

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  async init(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');

        this.swRegistration.addEventListener('updatefound', () => {
          const newWorker = this.swRegistration?.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdatePrompt();
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;

    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    return permission === 'granted';
  }

  async showNotification(title: string, options: NotificationOptions): Promise<void> {
    if (this.swRegistration && Notification.permission === 'granted') {
      await this.swRegistration.showNotification(title, {
        ...options,
        requireInteraction: true,
        tag: 'order-notification-' + Date.now(),
      });
    }
  }

  private showUpdatePrompt(): void {
    if (confirm('A new version is available. Would you like to update?')) {
      window.location.reload();
    }
  }

  async installApp(): Promise<void> {
    const event = (window as any).deferredPrompt;
    if (event) {
      event.prompt();
      await event.userChoice;
      (window as any).deferredPrompt = null;
    }
  }
}

export const pwaService = PWAService.getInstance();

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  (window as any).deferredPrompt = e;
});

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    pwaService.init();
  });
}
