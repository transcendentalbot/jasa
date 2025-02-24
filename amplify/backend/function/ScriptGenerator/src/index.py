import json

def lambda_handler(event, context):
    try:
        # Parse the request body
        body = json.loads(event['body']) if 'body' in event and event['body'] else {}

        print(f"Received request: {body.get('story', 'Test Story')}")

        # Extract story details from the request
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
        # Print input for debugging
        print("Received Story Input:", json.dumps(story_details, indent=2))

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Required for CORS
                'Access-Control-Allow-Methods': 'OPTIONS, POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({
                "message": "Story received successfully",
                "storyDetails": story_details
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({"error": str(e)})
        }
