import sys
import json
# from pyspark.sql import SparkSession
# from pyspark.sql.functions import col, avg
# spark-submit --master "spark://spark:7077" --packages  org.apache.spark:spark-streaming-kafka-0-8-assembly_2.11:2.4.6 pyspark_test.py
from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils
import logging
# from kafka import KafkaConsumer
import os
import pymongo
import datetime

logFormatter = logging.Formatter("%(asctime)s [%(threadName)-12.12s] [%(levelname)-5.5s]  %(message)s")
rootLogger = logging.getLogger("mini-batcher-application")
rootLogger.setLevel(logging.DEBUG)

consoleHandler = logging.StreamHandler()
consoleHandler.setFormatter(logFormatter)
consoleHandler.setLevel(logging.DEBUG)
rootLogger.addHandler(consoleHandler)

WINDOW_DURATION = 60
zookeeper_quorum = 'zookeeper:2181'
consumer_group_id = 'spark-streaming'
topic = os.getenv('topic', '1')

sc = SparkContext("spark://spark:7077", appName="Temperature_Humidity_Average")
sc.setLogLevel("WARN")

spark = SparkSession.builder \
        .appName("Temperature_Humidity_Average") \
        .getOrCreate()

class Ingestor:
    def __init__(self):
        db_client = pymongo.MongoClient(f"mongodb://root:password@mongo:27017/")
        mydb = db_client["test"]
        self.col = mydb["1"]
        rootLogger.info("Spark connected to MongoDB")

    def insert_data(self, data):
        result = self.col.insert_one(data)
        rootLogger.info(f"Inserted analyzed data at: {result.inserted_id}")
        return result

def calculate_average(messages, ingestor):
    # Convert JSON strings to Python dictionaries
    json_objects = messages.map(lambda message: json.loads(message.decode('utf-8')))

    # Extract temperature and humidity values and convert them to numeric types
    temperature_values = json_objects.flatMap(lambda obj: [float(x["value"]) for x in obj["sensordatavalues"] if x["value_type"] == "temperature"])
    humidity_values = json_objects.flatMap(lambda obj: [float(x["value"]) for x in obj["sensordatavalues"] if x["value_type"] == "humidity"])

    # Calculate average temperature and humidity
    avg_temperature = temperature_values.mean()
    avg_humidity = humidity_values.mean()

    # Create a dictionary with average values
    data_to_insert = {
        "tenantId": topic,
        "timestamp": datetime.datetime.now(),
        "avg_temperature": avg_temperature,
        "avg_humidity": avg_humidity
    }

    # Insert data into MongoDB
    ingestor.insert_data(data_to_insert)

# Initialize Spark Streaming Context
ssc = StreamingContext(sc, WINDOW_DURATION)

# Create Kafka stream
kafkaStream = KafkaUtils.createStream(ssc, zookeeper_quorum, consumer_group_id, {topic:1})

# Initialize Ingestor
ingestor = Ingestor()

# Process Kafka stream
parsed = kafkaStream.map(lambda v: v[1])
parsed.foreachRDD(lambda rdd: calculate_average(rdd, ingestor))

# Start Spark Streaming Context
ssc.start()
ssc.awaitTermination()