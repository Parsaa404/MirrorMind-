from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}

def test_reflect():
    response = client.post("/reflect?text=I%20am%20so%20happy")
    assert response.status_code == 200
    # This is not a real test, since we are using a placeholder API key.
    # In a real application, we would mock the OpenAI API and test the
    # response from our own application.
    assert "emotion" in response.json()
    assert "reflection" in response.json()
    assert "image_url" in response.json()
