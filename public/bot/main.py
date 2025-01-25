from flask import Flask, request, jsonify
from pprint import pprint
from dotenv import load_dotenv
import os
import json
import requests

# Load environment variables
load_dotenv()

# Flask app
app = Flask(__name__)

# Constants
TOKEN = os.getenv("TOKEN")
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")


# Graph Management
class GraphManager:
    def __init__(self, graph_file="data.json"):
        with open(graph_file, "r") as f:
            graph_data = json.load(f)
        self.nodes = {node["id"]: node["data"] | {
            "type": node["type"]} for node in graph_data["nodes"]}
        self.edges = graph_data["edges"]
        self.adj = self._build_adjacency_list()

    def _build_adjacency_list(self):
        adj = {node_id: [] for node_id in self.nodes}
        for edge in self.edges:
            adj[edge["source"]].append(edge["target"])
        return adj

    def get_thread_nodes(self):
        return [node_id for node_id, node in self.nodes.items() if node["type"] == "flowStartNode"]

# Message Utilities


class MessageHandler:
    @staticmethod
    def get_attr(obj, t, attr):
        if t == "text" and attr == "message":
            return obj["text"]["body"]
        elif t == "reply_buttons" and attr == "id":
            return obj["interactive"]["button_reply"]["id"]
        elif t == "reply_buttons" and attr == "text":
            return obj["interactive"]["button_reply"]["title"]
        elif t == "location" and attr == "latitude":
            return obj["location"]["latitude"]
        elif t == "location" and attr == "longitude":
            return obj["location"]["longitude"]
        elif t == "contact" and attr == "first_name":
            return obj["contacts"][0]["name"]["first_name"]
        elif t == "contact" and attr == "last_name":
            return obj["contacts"][0]["name"]["last_name"]
        elif t == "contact" and attr == "phone":
            return obj["contacts"][0]["phones"][0]["phone"]
        elif t == "contact" and attr == "email":
            return obj["contacts"][0]["emails"][0]["email"]
        elif t == "media" and attr == "mime_type":
            if "video" in obj:
                return obj["video"]["mime_type"]
            return obj["image"]["mime_type"]
        else:
            return None

    @staticmethod
    def check_rules(rules, message, t):
        for rule in rules:
            operator, value, field = rule["operator"], rule["value"], rule["field"]
            m = MessageHandler.get_attr(message, t, field)
            if operator == "str-is" and m != value:
                return False
            elif operator == "str-is-not" and m == value:
                return False
            elif operator == "str-contains" and value not in m:
                return False
            elif operator == "str-not-contains" and value in m:
                return False
            elif operator == "num-greater-than" and float(str(m)) <= float(value):
                return False
            elif operator == "num-less-than" and float(str(m)) >= float(value):
                return False
            elif operator == "num-equals" and float(str(m)) != float(value):
                return False
            elif operator == "num-not-equals" and float(str(m)) == float(value):
                return False
            elif operator == "num-less-than-equals" and float(str(m)) > float(value):
                return False
            elif operator == "num-greater-than-equals" and float(str(m)) < float(value):
                return False
        return True

    @staticmethod
    def trigger_check(message, node):
        if node["trigger"]["id"] == "text" and "text" in message and \
                MessageHandler.check_rules(node["rules"], message, "text"):
            return True
        elif node["trigger"]["id"] == "reply_buttons" and "interactive" in message and \
                MessageHandler.check_rules(node["rules"], message, "reply_buttons"):
            return True
        elif node["trigger"]["id"] == "location" and "location" in message and \
                MessageHandler.check_rules(node["rules"], message, "location"):
            return True
        elif node["trigger"]["id"] == "contact" and "contacts" in message and \
                MessageHandler.check_rules(node["rules"], message, "contact"):
            return True
        elif node["trigger"]["id"] == "media" and ("image" in message or "video" in message) and \
                MessageHandler.check_rules(node["rules"], message, "media"):
            return True
        return False

# Bot Logic


class BotService:
    def __init__(self, token, graph_manager):
        self.token = token
        self.graph_manager = graph_manager
        self.state = {}
        self.threads = self.graph_manager.get_thread_nodes()

    def check_threads(self, message, phone_number, phone_id):
        if phone_number not in self.state:
            self.state[phone_number] = [None] * len(self.threads)

        for i, thread in enumerate(self.threads):
            current_nodes = self.graph_manager.adj[self.state[phone_number][i]] \
                if self.state[phone_number][i] else [thread]

            for node_id in current_nodes:
                node = self.graph_manager.nodes[node_id]
                if MessageHandler.trigger_check(message, node):
                    self.state[phone_number][i] = node_id
                    d = {n["id"]: n["value"] for n in node["properties"]}
                    self.send_response(
                        phone_number, node["response"]["id"],  d, phone_id)

    def send_response(self, to, t, data, phone_id):
        url = f"https://graph.facebook.com/v21.0/{phone_id}/messages"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

        if t == "location":
            payload = {
                "messaging_product": "whatsapp",
                "to": to,
                "type": "location",
                "location": {
                        "latitude": data["latitude"],
                        "longitude": data["longitude"]
                }
            }
        elif t == "contact":
            payload = {
                "messaging_product": "whatsapp",
                "to": to,
                "type": "contacts",
                "contacts": [{
                    "name": {
                        "first_name": data["first_name"],
                        "last_name": data["last_name"],
                        "formatted_name": data["first_name"] + " " + data["last_name"]
                    },
                    "phones": [{
                        "phone": data["phone"],
                        "wa_id": data["phone"][1:]
                    }],
                    "emails": [{
                        "email": data["email"]
                    }]
                }]
            }
        elif t == "media":
            url_t = f"https://graph.facebook.com/v21.0/{phone_id}/media"
            payload_t = {'type': 'image/jpeg',
                         'messaging_product': 'whatsapp'}
            files = [
                ('file', (data["file"]["name"], open(f'media/{data["file"]["name"]}', 'rb'), data["file"]["type"]))
            ]
            headers_t = {
                "Authorization": headers["Authorization"],
            }

            response = requests.request(
                "POST", url_t, headers=headers_t, data=payload_t, files=files).json()
            pprint(response)

            payload = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": to,
                "type": "image",
                "image": {
                    "id": response["id"]
                }
            }

        elif t == "reply_buttons":
            payload = {
                "messaging_product": "whatsapp",
                "to": to,
                "type": "interactive",
                "interactive": {
                    "type": "button",
                    "body": {
                        "text": data["text"]
                    },
                    "action": {
                        "buttons": [
                            {
                                "type": "reply",
                                "reply": {
                                    "id": b["id"],
                                    "title": b["text"]
                                }
                            } for b in data["buttons"]
                        ]
                    }
                }
            }
        else:
            payload = {
                "messaging_product": "whatsapp",
                "to": to,
                "type": "text",
                "text": {
                    "body": data["message"]
                }
            }
        response = requests.post(url, json=payload, headers=headers)
        print("Response sent:", response.status_code, response.json())


# Flask Routes
graph_manager = GraphManager()
bot_service = BotService(TOKEN, graph_manager)


@app.route("/bot", methods=["GET"])
def verify_webhook():
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        print("WEBHOOK_VERIFIED")
        return challenge, 200
    else:
        return "Verification failed", 403


@app.route("/bot", methods=["POST"])
def webhook():
    data = request.json

    if "entry" in data:
        for entry in data["entry"]:
            for change in entry.get("changes", []):
                messages = change.get("value", {}).get("messages", [])
                if not messages:
                    continue
                for message in messages:
                    pprint(message)
                    phone_id = change.get("value", {}).get(
                        "metadata", {}).get("phone_number_id", 0)
                    bot_service.check_threads(
                        message, message["from"], phone_id)
                    return jsonify({"status": "success", "message": "Response sent"}), 200

    return "Event received", 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)

