import json
import traceback

def lambda_handler(event, context):
    try:
        if 'body' in event and event['body']:
            if isinstance(event['body'], str):
                body = json.loads(event['body'])
            else:
                body = event['body']
        else:
            body = event

        print(f"Received request: {body.get('story', 'Test Story')}")
        print(json.dumps(body, indent=2))

        story_details = {
            "story": body.get("story"),
            "character": body.get("character"),
            "name": body.get("name"),
            "description": body.get("description"),
            "gender": body.get("gender"),
            "age": body.get("age"),
            "genre": body.get("genre"),
            "hasAnimals": body.get("hasAnimals")
        }
        print("Received Story Input:", json.dumps(story_details, indent=2))

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({
                "message": "Story received successfully",
                "storyDetails": story_details
            })
        }
    except Exception as e:
        detailed_error = traceback.format_exc()
        print("Error encountered:", detailed_error)
        # WARNING: Exposing detailed error information is insecure for production!
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({"error": str(e), "traceback": detailed_error})
        }
