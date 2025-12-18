from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import urllib.request
import urllib.parse
import subprocess

PORT = 3000
BOT_TOKEN = "8208572285:AAFc852ARPC8WPLgjYQLq8Y8JmBY7QdOd1o"
CHAT_ID = "1957565921"

class APIHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        # Handle the Telegram endpoint
        if self.path == '/api/send-telegram':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                name = data.get('name')
                email = data.get('email')
                message = data.get('message')

                print("\n" + "="*50)
                print(f" [BACKEND] PROCESSING TELEGRAM REQUEST")
                print(f" FROM: {name} ({email})")
                print(f" MSG : {message}")
                
                # Construct Payload
                text = f"🍎 Freshly Order\n\nName: {name}\nEmail: {email}\n\n{message}"
                payload = json.dumps({
                    "chat_id": CHAT_ID,
                    "text": text
                })
                
                # USE SYSTEM CURL (Bypasses Python SSL/Firewall issues)
                # This is the "Nuclear Option" for reliability on Windows
                curl_command = [
                    'curl',
                    '-X', 'POST',
                    '-H', 'Content-Type: application/json',
                    '-d', payload,
                    f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
                ]
                
                print(" > Dispatching via System CURL...")
                
                # Run curl and capture output
                result = subprocess.run(
                    curl_command, 
                    capture_output=True, 
                    text=True,
                    encoding='utf-8' # Force UTF-8
                )
                
                print(f" > CURL Exit Code: {result.returncode}")
                # print(f" > CURL Output: {result.stdout}") # Uncomment for deeper debug if needed
                
                if result.returncode == 0:
                    # Success
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*') 
                    self.end_headers()
                    response = {"success": True}
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                else:
                    # Failure case
                    raise Exception(f"CURL Failed: {result.stderr}")
                
            except Exception as e:
                print(f"Error: {e}")
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*') 
                self.end_headers()
                error_resp = {"error": str(e)}
                self.wfile.write(json.dumps(error_resp).encode('utf-8'))
        else:
            self.send_error(404, "Endpoint not found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

print(f"✅ SERVER UPDATED (CURL VERSION) - Ready on port {PORT}...")
print(f"Bot Token: ...{BOT_TOKEN[-5:]}")
print(f"Chat ID: {CHAT_ID}")
server = HTTPServer(('localhost', PORT), APIHandler)
server.serve_forever()
