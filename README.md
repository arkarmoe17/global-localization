# Country, Region, and Township Data

This project contains JSON data for countries, regions, and townships. The data is organized in a hierarchical structure, with countries at the top level, followed by regions and townships.

## File Structure

- `country.json`: Contains the data for countries, regions, and townships.

## JSON Structure

### Country

Each country object contains:
- `key`: Unique identifier for the country.
- `EN`: Country name in English.
- `MM`: Country name in Myanmar.

### Region

Each region object contains:
- `countryRefKey`: Reference key to the country it belongs to.
- `data`: Array of region objects, each containing:
    - `key`: Unique identifier for the region.
    - `EN`: Region name in English.
    - `MM`: Region name in Myanmar.

### Township

Each township object contains:
- `countryRefKey`: Reference key to the country it belongs to.
- `data`: Array of region objects, each containing:
    - `regionRefKey`: Reference key to the region it belongs to.
    - `data`: Array of township objects, each containing:
        - `key`: Unique identifier for the township.
        - `EN`: Township name in English.
        - `MM`: Township name in Myanmar.

## Example

Here is an example of the JSON structure:

```json
{
    "country": [
        {
            "key": "1",
            "EN": "Myanmar",
            "MM": "မြန်မာ"
        }
    ],
    "region": [
        {
            "countryRefKey": "1",
            "data": [
                {
                    "key": "1",
                    "EN": "Yangon Region",
                    "MM": "ရန်ကုန်တိုင်းဒေသကြီး"
                }
            ]
        }
    ],
    "township": [
        {
            "countryRefKey": "1",
            "data": [
                {
                    "regionRefKey": "1",
                    "data": [
                        {
                            "key": "1",
                            "EN": "Ahlon",
                            "MM": "အလုံ"
                        }
                    ]
                }
            ]
        }
    ]
} 
```

### API Endpoints

#### Common API
- **URL**: `/data`
- **Method**: `GET`
- **Description**: Returns country and region data based on query parameters.
- **Query Parameters**:
  - `countryKey` (optional): The key of the country.
  - `regionKey` (optional): The key of the region.
- **Examples**:
  - Get all country information:
    ```sh
    curl -X GET http://localhost:3000/data
    ```
  - Get country and its regions:
    ```sh
    curl -X GET "http://localhost:3000/data?countryKey=1"
    ```
  - Get country, its regions, and townships:
    ```sh
    curl -X GET "http://localhost:3000/data?countryKey=1&regionKey=2"
    ```