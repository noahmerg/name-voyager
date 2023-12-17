export function handleVisibilityChaange() {
  const pageTitle = document.title;
  const attentionMessage = 'Looking for you...';

  document.addEventListener('visibilitychange', function (e) {
    const isPageActive = !document.hidden;

    if (!isPageActive) {
      document.title = attentionMessage;
    } else {
      document.title = pageTitle;
    }
  });
}