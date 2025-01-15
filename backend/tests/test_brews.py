import pytest
from fastapi.testclient import TestClient
from app.models.brew import Brew
from datetime import datetime, timezone

def test_create_brew(client: TestClient, mock_db):
    brew_data = {
        "bean_type": "Ethiopian Yirgacheffe",
        "brew_type": "V60",
        "water_temp": 94.5,
        "weight_in": 18,
        "weight_out": 270,
        "brew_time": "03:00",
        "bloom_time": 30,
        "details": "Medium-fine grind"
    }
    
    # Configure mock to store the created brew
    created_brew = None
    def mock_add(brew):
        nonlocal created_brew
        created_brew = brew
        return None
    mock_db.add.side_effect = mock_add
    
    response = client.post("/api/v1/brews/", json=brew_data)
    assert response.status_code == 200
    data = response.json()
    
    assert data["bean_type"] == brew_data["bean_type"]
    assert data["brew_type"] == brew_data["brew_type"]
    assert data["water_temp"] == brew_data["water_temp"]
    assert data["weight_in"] == brew_data["weight_in"]
    assert data["weight_out"] == brew_data["weight_out"]
    assert data["brew_time"] == brew_data["brew_time"]
    assert data["bloom_time"] == brew_data["bloom_time"]
    assert data["details"] == brew_data["details"]
    assert data["id"] == 1
    assert "created_at" in data
    
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()

def test_read_brews(client: TestClient, mock_db):
    brews = [
        Brew(
            id=1,
            bean_type="Colombian",
            brew_type="Espresso", 
            water_temp=93.0,
            weight_in=18,
            weight_out=36,
            brew_time="00:25",
            bloom_time=0,
            details="Fine grind",
            created_at=datetime.now(timezone.utc)
        ),
        Brew(
            id=2,
            bean_type="Ethiopian",
            brew_type="V60",
            water_temp=94.5,
            weight_in=20,
            weight_out=300,
            brew_time="03:00",
            bloom_time=30,
            details="Medium grind",
            created_at=datetime.now(timezone.utc)
        ),
        Brew(
            id=3,
            bean_type="Brazilian",
            brew_type="French Press",
            water_temp=95.0,
            weight_in=30,
            weight_out=500,
            brew_time="04:00",
            bloom_time=0,
            details="Coarse grind",
            created_at=datetime.now(timezone.utc)
        )
    ]
    # Mock the chained query methods
    mock_query = mock_db.query.return_value
    mock_query.offset.return_value = mock_query
    mock_query.limit.return_value = mock_query
    mock_query.all.return_value = brews
    
    response = client.get("/api/v1/brews/")
    assert response.status_code == 200
    data = response.json()
    
    assert len(data) == 3
    assert isinstance(data, list)
    
    # Validate all brews
    for i, brew in enumerate(brews):
        assert data[i]["id"] == brew.id
        assert data[i]["bean_type"] == brew.bean_type
        assert data[i]["brew_type"] == brew.brew_type
        assert data[i]["water_temp"] == brew.water_temp
        assert data[i]["weight_in"] == brew.weight_in
        assert data[i]["weight_out"] == brew.weight_out
        assert data[i]["brew_time"] == brew.brew_time
        assert data[i]["bloom_time"] == brew.bloom_time
        assert data[i]["details"] == brew.details
        assert "created_at" in data[i]

def test_read_brew(client: TestClient, mock_db):
    brew = Brew(
        id=1,
        bean_type="Colombian",
        brew_type="Espresso",
        water_temp=93.0,
        weight_in=18,
        weight_out=36,
        brew_time="00:25",
        bloom_time=0,
        details="Fine grind",
        created_at=datetime.now(timezone.utc)
    )
    mock_db.query.return_value.filter.return_value.first.return_value = brew
    
    response = client.get("/api/v1/brews/1")
    assert response.status_code == 200
    data = response.json()
    
    assert data["bean_type"] == brew.bean_type
    assert data["brew_type"] == brew.brew_type
    assert data["water_temp"] == brew.water_temp
    assert data["weight_in"] == brew.weight_in
    assert data["weight_out"] == brew.weight_out
    assert data["brew_time"] == brew.brew_time
    assert data["bloom_time"] == brew.bloom_time
    assert data["details"] == brew.details

def test_read_nonexistent_brew(client: TestClient, mock_db):
    mock_db.query.return_value.filter.return_value.first.return_value = None
    
    response = client.get("/api/v1/brews/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Brew not found"

def test_update_brew(client: TestClient, mock_db):
    existing_brew = Brew(
        id=1,
        bean_type="Colombian",
        brew_type="Espresso",
        water_temp=93.0,
        weight_in=18,
        weight_out=36,
        brew_time="00:25",
        bloom_time=0,
        details="Fine grind",
        created_at=datetime.now(timezone.utc)
    )
    mock_db.query.return_value.filter.return_value.first.return_value = existing_brew
    
    update_data = {
        "bean_type": "Ethiopian",
        "brew_type": "Espresso",
        "water_temp": 94.0,
        "weight_in": 18,
        "weight_out": 36,
        "brew_time": "00:25",
        "bloom_time": 0,
        "details": "Updated grind size"
    }
    
    response = client.put("/api/v1/brews/1", json=update_data)
    assert response.status_code == 200
    data = response.json()
    
    assert data["bean_type"] == update_data["bean_type"]
    assert data["water_temp"] == update_data["water_temp"]
    assert data["details"] == update_data["details"]
    # Unchanged fields should remain the same
    assert data["brew_type"] == existing_brew.brew_type
    assert data["weight_in"] == existing_brew.weight_in
    assert data["weight_out"] == existing_brew.weight_out
    assert data["brew_time"] == existing_brew.brew_time
    assert data["bloom_time"] == existing_brew.bloom_time
    
    mock_db.commit.assert_called_once()

def test_delete_brew(client: TestClient, mock_db):
    existing_brew = Brew(
        id=1,
        created_at=datetime.now(timezone.utc)
    )
    mock_db.query.return_value.filter.return_value.first.return_value = existing_brew
    
    response = client.delete("/api/v1/brews/1")
    assert response.status_code == 200
    assert response.json() == {"message": "Brew deleted successfully"}
    
    mock_db.delete.assert_called_once_with(existing_brew)
    mock_db.commit.assert_called_once()

def test_create_brew_invalid_data(client: TestClient, mock_db):
    brew_data = {
        "bean_type": "Ethiopian Yirgacheffe",
        "brew_type": "V60",
        "water_temp": -5.0,  # Invalid temperature
        "weight_in": 18,
        "weight_out": 270,
        "brew_time": "03:00",
        "bloom_time": 30,
        "details": "Medium-fine grind"
    }
    
    response = client.post("/api/v1/brews/", json=brew_data)
    assert response.status_code == 422
    
    mock_db.add.assert_not_called()
    mock_db.commit.assert_not_called() 