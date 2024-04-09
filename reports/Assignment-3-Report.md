# Report for assignment 3

## Part 1

### 1. Tenant data and data analytics
- Data samples based on: Open data about air quality monitoring from Germany (https://github.com/opendata-stuttgart/meta/wiki/EN-APIs)

```json
{
  "id": "String",
  "sampling_rate": "String",
  "timestamp": "String",
  "location": {
    "id": "String",
    "latitude": "String",
    "longitude": "String",
    "altitude": "String",
    "country": "String",
    "exact_location": "String",
    "indoor": "String"
  },
  "sensor": {
    "id": "String",
    "pin": "String",
    "sensor_type": {
      "id": "String",
      "name": "String",
      "manufacturer": "String"
    }
  },
  "sensordatavalues": [
    {
      "id": "String",
      "value": "String",
      "value_type": "String"
    },
    {
      "id": "String",
      "value": "String",
      "value_type": "String"
    }
  ]
}
```

- (i): Streaming analytics calculate the averages from the multiple sensor values like temperature and humidity in order to analyze current messages going throught the stream.

- (ii): Batch analytics is performed on the tenant sensor data in mysimbdp-coredms (MongoDB) every month, based on the metadata timestamp, to get the monthly averages for the temperature and humidity from all tenat sensors.


### 2. Data streams
- (i): Streaming analytics should only handle keyed data streams which have metadata that identifies the tenant the data belongs to. The keys in the data streams allow for the identification of tenant data and without the key we cannot be sure the correct tenants data is analyzed at every point.

- (ii): Suitable message delivery guarantees are at-most-once and exactly-once. At-most-once allows for a fast system and with the large amounts of data being processed the loss of a couple data points won't affect the analysis outcome as much. Exactly-once would be ideal for data integrity, but implementing it adds a lot of checks to the systems and delays which decreases performance by notable amounts. At-least-once is not suitable for these analytics due having a large chance of interfering with the outcome if there are too many duplicate datapoints.


### 3. Stream Processing Considerations: Time, Windows, Out-of-Order Data, and Watermarks

- (i): Types of time to consider with stream data sources for the analytics are event time, ingestion time and processing time. Event time is the time when the event actually occurred and is usually embedded in the data record itself. Ingestion time is the time taken when the data is ingested into the stream processing system. Processing time is the time when the event is processed by the stream processor. If the data sources have no timestamps associated with records, a solution could be to attach a timestamp at the point of ingestion into the stream processing system. If the data sources have no timestamps associated with records, we could use the arrival time of the data record at the stream processor as a proxy for event time.

- (ii): Types of windows should developed for the analytics should be tumbling windows and sliding windows. Tumbling windows are fixed-size, non-overlapping and gap-less windows that “tumble” forward in time. They are suitable for analytics where we want to provide updates at regular intervals and each update should only consider the latest batch of data. Sliding windows are also fixed-size but they slide forward in time by a certain slide interval, which can be less than the window size, hence they can overlap. They are suitable for analytics where we want to provide smoother and more timely updates, and each update should consider all the data in the window.

- (iii): Out-of-order data/records could be caused by the mycoresimbdp input-stream Kafk producer problems, tenants consumer problems, network delays, buffering or sensor issues. For example, in our running example of air quality monitoring, if the sensor data is being transmitted over a network, then network congestion or failures could cause some data records to arrive late at the stream processor, resulting in out-of-order data.

- (iv): Watermarks are needed for the system to function, because without them creating a window for the stream processor is difficult and inaccurate. They allow for the handling of out-of-order and delayed data.


### 4. Collect logging metrics
- Store tenant logs in individual tenant database paths. At logs/tenantId.

#### Metrics stored:
- dataSizeBytes, Measured by: The size of the data packet received for processing. Relevance: Understand the volume of data being processed
- ingestionStartTime, Measured by: The timestamp when the data ingestion process starts. Relevance: Track the time taken for data ingestion.
- ingestionEndTime, Measured by: The timestamp when the data ingestion process ends., Relevance: Calculate the total time taken for data ingestion.
- ingestionResult, Measured by: The outcome of the data ingestion process (success or failure). Relevance: Success rate of data ingestion and error logging.
- timestamp, Measured by: The timestamp for the metric log creation. Relevance: General logging.


### 5. 
- Figure of system and explanations of how it works and why the tehcnologies and methods were chosen (kafka and RestAPI).






## Part 2

### 1. 

### 2. 

### 3. 

### 4. 

### 5. 






## Part 3

### 1. 

### 2. 

### 3. 

### 4. 

### 5. 