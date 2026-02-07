import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-url-content-save-file',
  templateUrl: './url-content-save-file.component.html',
  styleUrls: ['./url-content-save-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class AppUrlContentSaveFileComponent implements OnInit {
  private http = inject(HttpClient);
  private proxyUrl = '/api/proxy'; // Your backend proxy endpoint

  urllinks = [
    'https://www.dormanproducts.com/p-128056-ti81065rd.aspx?parttype=Steering%2520-%2520Tie%2520Rod%2520End&origin=keyword',
    'https://www.dormanproducts.com/p-149173-542-941.aspx?parttype=Steering%2520-%2520Tie%2520Rod%2520End&origin=keyword',
  ];

  downloadingUrls = signal<Set<string>>(new Set());
  downloadedUrls = signal<Set<string>>(new Set());
  errorUrls = signal<Map<string, string>>(new Map());

  ngOnInit() {
    this.downloadAllUrls();
  }

  async downloadAllUrls() {
    for (const url of this.urllinks) {
      await this.downloadUrl(url);
    }
  }

  async downloadUrl(url: string) {
    try {
      this.downloadingUrls.update((set) => new Set(set).add(url));
      this.errorUrls.update((map) => {
        const newMap = new Map(map);
        newMap.delete(url);
        return newMap;
      });

      // Try backend proxy first
      const blob = await this.fetchViaProxy(url);
      const urlFilename = new URL(url).pathname.split('/').pop() || 'download.html';
      const filename = this.sanitizeFilename(urlFilename) || 'download.html';

      // Use the File System Access API to save to Downloads folder
      await this.saveToDownloads(blob, filename);

      this.downloadedUrls.update((set) => new Set(set).add(url));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Failed to download ${url}:`, error);
      this.errorUrls.update((map) => new Map(map).set(url, errorMsg));
    } finally {
      this.downloadingUrls.update((set) => {
        const newSet = new Set(set);
        newSet.delete(url);
        return newSet;
      });
    }
  }

  private fetchViaProxy(url: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.http.post(this.proxyUrl, { url }, { responseType: 'blob' }).subscribe({
        next: (blob) => resolve(blob),
        error: (error) => reject(error),
      });
    });
  }

  private async saveToDownloads(blob: Blob, filename: string) {
    try {
      // Try to use File System Access API (modern approach)
      if ('showSaveFilePicker' in window) {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: 'Files', accept: { '*/*': ['.html', '.json', '.txt', '.xml'] } }],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        // Fallback: Use blob download
        this.downloadBlobAsFile(blob, filename);
      }
    } catch (error) {
      // Fallback on cancel or error
      console.warn('File System Access API error, using blob download:', error);
      this.downloadBlobAsFile(blob, filename);
    }
  }

  private downloadBlobAsFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_+/g, '_')
      .toLowerCase()
      .substring(0, 255);
  }
}
