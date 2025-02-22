export function documentReadyPromise<T>(creator: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      creator().then(resolve).catch(reject);
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        creator().then(resolve).catch(reject);
      });
    }
  });
}
