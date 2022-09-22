import { useEffect, useState } from 'react';
import config from '../utils/config.json';

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      setDeferredPrompt(e);
    });
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
    });
  }, []);

  return (
    <div>
      {deferredPrompt && (
        <button
          className={`mx-4 font-normal border border-green-500 text-green-500 rounded-lg px-1`}
          onClick={async () => {
            if (deferredPrompt) {
              deferredPrompt.prompt();
              const { outcome } = await deferredPrompt.userChoice;
              if (outcome == 'accepted') {
                setDeferredPrompt(null);
              }
            }
          }}
        >
          Install {config.name}
        </button>
      )}
    </div>
  );
}
