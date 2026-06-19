export function baixar(data: Blob, name?: string) {

  const blob = new Blob([data], { type: data.type || 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  const defaultName = `resource_${new Date().getTime()}`;

  a.download = name ? name.replace(/[/\\?%*:|"<>]/g, '-') : defaultName;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(2)} ${sizes[i]}`;
}
