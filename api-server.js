import http from 'http';
import url from 'url';
import searchHandler from './api/search.js';
import randomHandler from './api/random.js';
import cuisinesHandler from './api/cuisines.js';
import coursesHandler from './api/courses.js';
import detailHandler from './api/detail.js';

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // Mock req and res objects for Vercel handlers
  const mockReq = {
    method: req.method,
    query: parsedUrl.query,
    body: null
  };

  // Helper to read JSON body for POST requests
  if (req.method === 'POST') {
    const buffers = [];
    try {
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const bodyText = Buffer.concat(buffers).toString();
      if (bodyText) {
        mockReq.body = JSON.parse(bodyText);
      } else {
        mockReq.body = {};
      }
    } catch (e) {
      mockReq.body = {};
    }
  }

  const mockRes = {
    statusVal: 200,
    headers: {},
    setHeader(name, val) {
      this.headers[name] = val;
    },
    status(code) {
      this.statusVal = code;
      return this;
    },
    json(data) {
      res.writeHead(this.statusVal, { 'Content-Type': 'application/json', ...this.headers });
      res.end(JSON.stringify(data));
    },
    end(data) {
      res.writeHead(this.statusVal, this.headers);
      res.end(data);
    }
  };

  try {
    if (path === '/api/search') {
      await searchHandler(mockReq, mockRes);
    } else if (path === '/api/random') {
      await randomHandler(mockReq, mockRes);
    } else if (path === '/api/cuisines') {
      await cuisinesHandler(mockReq, mockRes);
    } else if (path === '/api/courses') {
      await coursesHandler(mockReq, mockRes);
    } else if (path === '/api/detail') {
      await detailHandler(mockReq, mockRes);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  } catch (error) {
    console.error("Local dev server error:", error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

const PORT = process.env.PORT || 7860;
server.listen(PORT, () => {
  console.log(`Local API Server running at http://localhost:${PORT}`);
});
