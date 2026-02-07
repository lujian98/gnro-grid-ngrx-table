# CORS Solution for URL Content Download

## Problem
The component receives CORS errors when trying to fetch URLs directly from the browser:
```
Access to fetch at 'https://www.dormanproducts.com/...' from origin 'http://localhost:4200'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution Implemented

### How It Works
1. **Frontend** (Angular Component): Sends a POST request to your backend proxy endpoint `/api/proxy`
2. **Backend Proxy**: Fetches the actual URL content server-side (no CORS restrictions)
3. **Response**: Returns the fetched content as a blob that the browser can download

### Files Modified

#### 1. Component TypeScript (`url-content-save-file.component.ts`)
- Added `HttpClient` injection
- Changed `downloadUrl()` method to use `fetchViaProxy()`
- Added error tracking with `errorUrls` signal
- Errors are displayed with tooltips on error badges

#### 2. Component Template (`url-content-save-file.component.html`)
- Added error badge display showing download status
- Added error count to summary
- Error badges show tooltip with error message on hover

#### 3. Component Styles (`url-content-save-file.component.scss`)
- Added `.error` badge styling (red background)
- Error badges have `cursor: help` for better UX

#### 4. In-Memory Service (`mock/in-memory-service.ts`)
- Added `handleProxyRequest()` method to intercept `/api/proxy` requests
- Simulates fetching remote URLs

## Setup for Production

### Option 1: Using Express.js Backend (Recommended)
```typescript
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/api/proxy', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    res.send(buffer);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
});

app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});
```

### Option 2: Using .NET Core Backend
```csharp
[HttpPost("api/proxy")]
public async Task<IActionResult> ProxyUrl([FromBody] UrlRequest request)
{
    try
    {
        if (string.IsNullOrEmpty(request.Url))
            return BadRequest("URL is required");

        using (var httpClient = new HttpClient())
        {
            httpClient.DefaultRequestHeaders.Add("User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            var response = await httpClient.GetAsync(request.Url);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "Failed to fetch URL");

            var content = await response.Content.ReadAsByteArrayAsync();
            var contentType = response.Content.Headers.ContentType?.MediaType ??
                "application/octet-stream";

            return File(content, contentType);
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Error: {ex.Message}");
    }
}

public class UrlRequest
{
    public string Url { get; set; }
}
```

### Option 3: Using Node.js/NestJS
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import axios from 'axios';

@Controller('api')
export class ProxyController {
  @Post('proxy')
  async proxyUrl(@Body() { url }: { url: string }) {
    try {
      if (!url) {
        throw new Error('URL is required');
      }

      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });

      return {
        data: response.data,
        contentType: response.headers['content-type'] || 'application/octet-stream'
      };
    } catch (error) {
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
  }
}
```

## Configuration Changes

### Update component proxy URL
In `url-content-save-file.component.ts`, change:
```typescript
private proxyUrl = '/api/proxy'; // Update to your actual backend URL
```

To production URL:
```typescript
private proxyUrl = 'https://your-api-domain.com/api/proxy';
```

## Features

✅ **Automatic Download**: Downloads start automatically on component init
✅ **Error Handling**: Shows download status (downloading, success, error)
✅ **Error Messages**: Hover over error badge to see specific error
✅ **Progress Tracking**: Shows total, downloaded, and error counts
✅ **File Naming**: Sanitizes filenames extracted from URLs
✅ **Browser Compatibility**: Falls back to traditional download if File System API unavailable

## Browser Support

- **Modern browsers**: Use File System Access API for direct download
- **Older browsers**: Use fallback blob download mechanism

## Testing

To test locally:
1. The mock service will simulate proxy responses with HTML content
2. Files will be downloaded with sanitized names (e.g., `p_128056_ti81065rd_aspx.html`)
3. Check browser console for download progress and errors

## Security Considerations

⚠️ **Important**: When implementing the backend proxy:
1. **Validate URLs**: Whitelist allowed domains to prevent proxy abuse
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Authentication**: Require authentication if sensitive
4. **Size Limits**: Set maximum file size limits for downloads
5. **Timeout**: Set request timeouts to prevent hanging

Example with validation:
```typescript
const ALLOWED_DOMAINS = [
  'dormanproducts.com',
  // Add other trusted domains
];

function isUrlAllowed(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ALLOWED_DOMAINS.some(domain => url.hostname.includes(domain));
  } catch {
    return false;
  }
}
```

## Troubleshooting

### Error: "Failed to download"
- Check network console for actual error
- Verify backend proxy is running
- Check CORS headers from backend

### Files not downloading
- Check browser console for errors
- Verify File System API permissions
- Check file size limits

### Proxy endpoint returns 500
- Verify URL is valid and accessible
- Check backend logs for details
- Ensure proper User-Agent headers are set
