from flask import Flask, request, jsonify
from pprint import pprint
import requests


last_id = {}
user_cart = dict()

TOKEN = "EAAHuyPXTFdIBO0eu1ICPCyLMBU3YjRUavvSFvU3UBvl9ajJqUQZBzEY0ZAlt0iN9m85DZAci0YLwAenliqemo26xd75Yef3qyLDUZBB7t5tNeDAZC3ATQPK7AySZB1rgLsrCPSoZA7yJIIvRBjFT83f05ubvytsZBXnCeWBiFgmejZBntRfTjYCJNgAu5VJoe9ooDqIsomAiEnPTbxLgEytJy6FO2wgZDZD"


def send_menu(to, ph_id):
    url = f"https://graph.facebook.com/v21.0/{ph_id}/messages"
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }

    """payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "interactive",
        "interactive": {
            "type": "list",
            "header": {
                "type": "text",
                "text": "Welcome to Our Store"
            },
            "body": {
                "text": "Select an item to add to your cart:"
            },
            "footer": {
                "text": "Choose an item to proceed."
            },
            "action": {
                "button": "Select Item",
                "sections": [
                    {
                        "title": "Menu",
                        "rows": [
                            {
                                "id": "item1",
                                "title": "Item 1",
                                "description": "$10 each"
                            },
                            {
                                "id": "item2",
                                "title": "Item 2",
                                "description": "$15 each"
                            },
                            {
                                "id": "item3",
                                "title": "Item 3",
                                "description": "$20 each"
                            }
                        ]
                    }
                ]
            }
        }
    }"""

    payload = {
        "messaging_product": "whatsapp",
        "to": to,  # User's WhatsApp number
        "type": "interactive",
        # "interactive": {
        #     "type": "button",
        #     "body": {
        #         "text": "BUTTON_TEXT"
        #     },
        #     "action": {
        #         "buttons": [
        #             {
        #                 "type": "reply",
        #                 "reply": {
        #                     "id": "1",
        #                     "title": "BUTTON_TITLE_1"
        #                 }
        #             },
        #             {
        #                 "type": "reply",
        #                 "reply": {
        #                     "id": "2",
        #                     "title": "BUTTON_TITLE_2"
        #                 }
        #             }
        #         ]
        #     }
        # }
        "interactive": {
            "type": "product",
            "body": {
                "text": "optional body text"
            },
            "footer": {
                "text": "optional footer text"
            },
            "action": {
                "catalog_id": "28654478784150869",
                "product_retailer_id": "9162644453754478"
            }
        },
        # "interactive": {
        #     "type": "list",
        #     "header": {
        #         "type": "text",
        #         "text": "Menu Options"
        #     },
        #     "body": {
        #         "text": "Please choose an option:"
        #     },
        #     "footer": {
        #         "text": "Powered by Your App"
        #     },
        #     "action": {
        #         "button": "Show Options",
        #         "sections": [
        #             {
        #                 "title": "Main Menu",
        #                 "rows": [
        #                     {
        #                         "id": "option1",
        #                         "title": "Option 1",
        #                         "description": "Learn about Option 1"
        #                     },
        #                     {
        #                         "id": "option2",
        #                         "title": "Option 2",
        #                         "description": "Learn about Option 2"
        #                     },
        #                     {
        #                         "id": "option3",
        #                         "title": "Option 3",
        #                         "description": "Learn about Option 3"
        #                     }
        #                 ]
        #             }
        #         ]
        #     }
        # }
    }

    response = requests.post(url, json=payload, headers=headers)
    print("Menu sent:", response.status_code, response.json())
    return jsonify({"status": "success", "message": "Response sent"})


app = Flask(__name__)
VERIFY_TOKEN = "HELLO"


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

    pprint(data)
    # Check if the webhook contains a message
    if "entry" in data:
        for entry in data["entry"]:
            for change in entry.get("changes", []):
                messages = change.get("value", {}).get("messages", [])

                # Check if the webhook contains a message
                if not messages:
                    continue
                for message in messages:
                    ph_id = change.get("value", {}).get(
                        "metadata", {}).get("phone_number_id", 0)
                    # Handle List Message reply
                    return handle_user_selection(message, ph_id), 200

    return "Event received", 200


def checkout_summary(user_cart, from_number):
    summary = "Your cart:\n"
    for item_id, quantity in user_cart[from_number].items():
        summary += f"- {item_id}: {quantity} pcs\n"
    summary += "\nReply 'confirm' to place your order or 'menu' to add more items."
    return summary


def handle_user_selection(message, ph_id):
    """
    Handle the response from the user after they select an item.
    """
    from_number = message["from"]
    if "text" in message and message["text"]["body"] == "menu":
        send_menu(from_number, ph_id)
    elif "text" in message and message["text"]["body"] == "checkout":
        send_response(from_number, checkout_summary(
            user_cart, from_number), ph_id)
    elif "interactive" in message and message["interactive"]["type"] == "list_reply":
        selected_item_id = message["interactive"]["list_reply"]["id"]
        selected_item_title = message["interactive"]["list_reply"]["title"]
        last_id[from_number] = selected_item_id

        # Respond asking for quantity
        send_response(
            from_number,
            f"You selected {
                selected_item_title}. Please reply with the quantity you'd like to order.",
            ph_id
        )

    elif "text" in message and from_number in last_id:
        user_response = message["text"]["body"]
        if user_response.isdigit():
            quantity = int(user_response)
            if from_number not in user_cart:
                user_cart[from_number] = {}
            user_cart[from_number][last_id[from_number]] = quantity
            send_response(
                from_number,
                f"Got it! You've added {
                    quantity} of the selected item to your cart. Type 'menu' to add more items or 'checkout' to complete your order.",
                ph_id
            )
            del last_id[from_number]
        else:
            send_response(
                from_number, "Invalid quantity. Please enter a number.", ph_id)
    else:
        send_response(
            from_number, "I didn’t understand that. Type 'menu' to see the options.", ph_id)

    return jsonify({"status": "success", "message": "Response sent"})


"""def handle_user_selection(user_id, selected_id, ph_id):
    # Respond based on the user's choice
    if selected_id == "option1":
        message_body = "You selected Option 1! Here's some information about it."
    elif selected_id == "option2":
        message_body = "You selected Option 2! Here's some details about Option 2."
    elif selected_id == "option3":
        message_body = "You selected Option 3! Learn more about Option 3 here."
    else:
        message_body = "Invalid selection. Please try again."

    # Send response back to the user
    send_response(user_id, message_body, ph_id)
    return jsonify({"status": "success", "message": "Response sent"})"""


def send_response(to, body, ph_id):
    url = f"https://graph.facebook.com/v21.0/{ph_id}/messages"
    headers = {
        "Authorization": f"Bearer {TOKEN}",
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


if __name__ == "__main__":
    app.run(port=4000)
