from streamProcessor import calculate_average
import sys
import json
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg

if __name__ == "__main__":
    # Get JSON strings from command-line arguments
    topic = sys.argv[1]
    group = sys.argv[2]

    # Calculate average temperature and humidity
    avg_temp, avg_humidity = calculate_average(topic, group)

    # Print results
    print("Average Temperature:", avg_temp)
    print("Average Humidity:", avg_humidity)
