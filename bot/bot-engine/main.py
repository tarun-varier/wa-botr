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
    def check_rules(rules, message):
        for rule in rules:
            operator, value = rule["operator"], rule["value"]
            if operator == "is" and message != value:
                return False
            elif operator == "is-not" and message == value:
                return False
            elif operator == "contains" and value not in message:
                return False
            elif operator == "not-contains" and value in message:
                return False
        return True

    @staticmethod
    def trigger_check(message, node):
        if node["trigger"]["id"] == "text" and "text" in message and \
                MessageHandler.check_rules(node["rules"], message["text"]["body"]):
            return True
        elif "interactive" in message and message["interactive"]["type"] == "list_reply":
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
                    response = node["properties"][0]["value"]
                    self.send_response(phone_number, response, phone_id)

    def send_response(self, to, body, phone_id):
        url = f"https://graph.facebook.com/v21.0/{phone_id}/messages"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "text",
            "text": {
                "body": body
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
