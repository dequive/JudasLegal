from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if self.path == '/health':
            response = {"status": "healthy", "service": "muzaia-backend"}
        elif self.path == '/':
            response = {"message": "Muzaia Legal Assistant API", "status": "running"}
        else:
            response = {"error": "Not found", "path": self.path}
            
        self.wfile.write(json.dumps(response).encode('utf-8'))
        return

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if self.path.startswith('/api/chat'):
            response = {"message": "Chat endpoint funcionando", "status": "ok"}
        else:
            response = {"error": "Not found", "path": self.path}
            
        self.wfile.write(json.dumps(response).encode('utf-8'))
        return
        
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return