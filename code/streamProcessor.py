import sys
import json
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg

def calculate_average(json_strings):
    # Initialize SparkSession
    spark = SparkSession.builder \
        .appName("Temperature_Humidity_Average") \
        .getOrCreate()

    # Convert JSON strings to Python dictionaries
    json_objects = [json.loads(json_str) for json_str in json_strings]

    # Extract temperature and humidity values and convert them to numeric types
    temperature_values = []
    humidity_values = []
    for json_obj in json_objects:
        temperature_value = float(next((x["value"] for x in json_obj["sensordatavalues"] if x["value_type"] == "temperature"), 0))
        humidity_value = float(next((x["value"] for x in json_obj["sensordatavalues"] if x["value_type"] == "humidity"), 0))
        temperature_values.append(temperature_value)
        humidity_values.append(humidity_value)

    # Create DataFrame from the extracted values
    data = [(temperature, humidity) for temperature, humidity in zip(temperature_values, humidity_values)]
    df = spark.createDataFrame(data, ["temperature", "humidity"])

    # Calculate average temperature and humidity
    avg_temperature = df.agg(avg("temperature")).collect()[0][0]
    avg_humidity = df.agg(avg("humidity")).collect()[0][0]

    return avg_temperature, avg_humidity

if __name__ == "__main__":
    # Get JSON strings from command-line arguments
    json_strings = sys.argv[1:]

    # Calculate average temperature and humidity
    avg_temp, avg_humidity = calculate_average(json_strings)

    # Print results
    print("Average Temperature:", avg_temp)
    print("Average Humidity:", avg_humidity)
