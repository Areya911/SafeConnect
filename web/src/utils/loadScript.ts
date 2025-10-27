// web/src/utils/loadScript.ts
export function loadScript(src: string, id?: string): Promise<Event | null> {
  return new Promise((resolve, reject) => {
    // if already loaded, resolve immediately
    if (id && document.getElementById(id)) return resolve(null);

    const s = document.createElement('script');
    s.src = src;
    if (id) s.id = id;
    s.async = true;
    s.onload = (e) => resolve(e);
    s.onerror = (e) => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(s);
  });
}
