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
      "value_type": "String" // temperature
    },
    {
      "id": "String",
      "value": "String",
      "value_type": "String" // humidity
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
- Figure of system and explanations of how it works and why the tehcnologies and methods were chosen (Kafka and RESTAPI).

FIGURE:

Tenant data sources: Tenants input data into mysimbdp stream-input as messages 

Mysimbdp messaging system: If the message aligns with the tenant agreement, mysimbdp gets data from stream-input by using Kafka to create a producer for that message if it aligns with the tenant agreement. Stream-input calls mysimbdp ingest-manager to inform that it has messages for a specific tenant through REST API call notifyManager().

Tenant streaming analytics app: Client-stream-app creates a consumer (using Kafka or some other MQTT) that consumes the messages from mysimbdp stream-input topic specific for the tenant after the mysimbdp ingest-manager has scheduled and called the Client-stream-app through REST API call callClientStreamApp().

Mysimbdp streaming computing service: Stream-processor in mysimbdp that uses Spark to create consumer that get the data from tenants messages in message ques at mysimbdp stream-input. Calculates the average temperature and humidity from the tenant data for the specific window. Client-stream-app informs the stream-processor that the stream-input has a specific message queue topic that it needs to consume to get the correct data to consume. Stream-processor returns the processed to the client-stream-app through a REST API call returnProcessedData().

Ingesting data to mysimbdp-coredms: Client-stream-app can ingest raw data and the processed data, retrieved from the stream-processor, by calling mysimbdp-daas API which ingest the data into mysimbdp-coredms (MongoDB).

Batch analysis: Mysimbdp batch-processor does batch analysis on the tenant data stored in mysimbdp-coredms by calculating the average monthly temperature and monthly humidity every month based the timestamps on the specific tenants data and then stores the analyzed data to mysimbdp-coredms.

- EXPLAIN TECHNOLOGY CHOICES AND DECISIONS. ALSO WHAT WAS REUSED FROM PREVIOUS ASSIGNMENTS.





## Part 2
### 1. Data schema and analytics output
##### (i):
Data schema for sensor data:
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
      "value_type": "String" // temperature
    },
    {
      "id": "String",
      "value": "String",
      "value_type": "String" // humidity
    }
  ]
}
```

- This type of data format with the temperature and humidity needs to be mandated in order for the data analytics to be possible.

Stream-processor calculates the average temperature and humidity (avg_temp, avg_humidity).
Batch-processor calculates the average monthly temperature and humidity (avg_monthly_temp, avg_monthly_humidity).

{
  "tenant_id": "String",
  "window_start_time": "String",
  "window_end_time": "String",
  "average_temperature": "Float",
  "average_humidity": "Float"
}

##### (ii):
- Data is deserialized by the client-stream-app consumer from a message back to JSON data (using Kafka in example). Data stays as JSON as long as possible due to the ease of creating a document-model database using MondoDB and utilizing it fully.


### 2. Tenant-stream-app
- Client-stream-app creates a consumer (using Kafka or some other MQTT) that consumes the messages from mysimbdp stream-input topic specific for the tenant after the mysimbdp ingest-manager has scheduled and called the Client-stream-app through REST API call callClientStreamApp().

- Stream-processor in mysimbdp that uses Spark to create consumer that get the data from tenants messages in message ques at mysimbdp stream-input. Calculates the average temperature and humidity from the tenant data for the specific window. Client-stream-app informs the stream-processor that the stream-input has a specific message queue topic that it needs to consume to get the correct data to consume. Stream-processor returns the processed to the client-stream-app through a REST API call returnProcessedData().

- Client-stream-app wrangles data by adding a tenant id and timestamp to all data before sending it through a REST API in mysimbdp-daas to ingest it to mysimbdp-coredms.

- Client-stream-app can ingest raw data and the processed data, retrieved from the stream-processor, by calling mysimbdp-daas API which ingest the data into mysimbdp-coredms (MongoDB).

### 3. Testing client-stream-app
- Test data is generated based on the schema given earlier using a randomized generator utility function in the tests themselves.

- Basic test results:

- Performance test results:

- Discuss the analytics and its performance observations when you increase/vary the speed of streaming data:


### 4. 
- Show test configuration/results.

- Send wrong data to the system and see the result.

- Data with the wrong schema is generated withing the tests using a generator utility function.

- How does the system deal with exceptions, failures, and decreasing performance. With different error rates.


### 5. 
- Explain parallelism in the system and show performance test with atleast 2 tenants.

- Performance issues found:

- Does parallelism cause performance problems?





## Part 3

### 1. RESTful service
- Tenants client-stream-app can just send the processed data retrieved from mysimbdp-coredms or stream-processor to the RESTful API using the defined API call and then ingest the returned analyzed data to mysimbdp-coredms.

- API endpoint defining, get data to send, transform data to fit the requirements and finally handle return data (ingest to mysimbdp-coredms).

### 2. Batch analytics
Batch analysis: Mysimbdp batch-processor does batch analysis on the tenant data stored in mysimbdp-coredms by calculating the average monthly temperature and monthly humidity every month based the timestamps on the specific tenants data and then stores the analyzed data to mysimbdp-coredms.

- Get tenant data from mysimbdp-coredms through a REST API with filtering for datapoints that have a timestamp for a specific month.
- Use Spark to get the average monthly temperature and average monthly humidity from the retrieved data. Also add tenant id and timestamp.
- Ingest the processed data to mysimbdp-coredms by calling the REST API defined in mysimbdp-daas.

### 3. Analysis with connected workflow
+---------------------+
                                      | Streaming Analytics |
                                      +----------+----------+
                                                 |
                                                 v
                                      +----------+----------+
                                      |      Detect        |
                                      | Critical Condition |
                                      +----------+----------+
                                                 |
                                    Critical Condition Detected
                                                 |
                                                 v
                                      +----------+----------+
                                      |   Workflow Orchestrator   |
                                      +----------+----------+
                                                 |
                                    Triggers Batch Analytics
                                                 |
                                                 v
                                      +----------+----------+
                                      |   Batch Analytics   |
                                      +----------+----------+
                                                 |
                                        Analyze Historical Data
                                                 |
                                                 v
                                      +----------+----------+
                                      |  Share Result to   |
                                      |   Cloud Storage    |
                                      +----------+----------+
                                                 |
                                      +----------v----------+
                                      |   Notify User      |
                                      |   within Tenant    |
                                      +---------------------+
Workflow Explanation:
Streaming Analytics: The streaming analytics component continuously monitors the incoming data streams and detects critical conditions, such as a very high rate of alerts.

Detect Critical Condition: When a critical condition is detected by the streaming analytics, it triggers an event indicating the need for further analysis.

Workflow Orchestrator: The workflow orchestrator receives the event triggered by the critical condition detection and coordinates the execution of subsequent tasks.

Batch Analytics: Upon receiving the trigger from the workflow orchestrator, the batch analytics process is initiated to analyze historical data stored in the database.

Share Result to Cloud Storage: Once the batch analytics is completed, the results are shared with a cloud storage service for storage and accessibility.

Notify User within Tenant: After the results are stored in the cloud storage, a notification is sent to the user within the tenant to inform them about the availability of the analyzed data.

Using Workflow Technologies:
Workflow Orchestrator: The workflow orchestrator, such as Apache Airflow or Apache NiFi, manages the sequence of tasks and coordinates the interactions between streaming analytics, batch analytics, cloud storage, and user notification.

Task Dependencies: Workflow technologies enable defining dependencies between tasks, ensuring that the batch analytics is triggered only when a critical condition is detected by the streaming analytics.

Event-Based Triggers: Events triggered by the streaming analytics component serve as triggers for initiating the batch analytics process, allowing for seamless integration and coordination between the two.

Monitoring and Error Handling: Workflow technologies provide monitoring capabilities to track the progress of tasks and handle errors or failures gracefully, ensuring reliable execution of the entire workflow.                



### 4. Schema evolution
Versioning in the schema and data. Always show schema version as a property.

- Schema registry.

- Schema detection.

- Schema change notification for whole system.


### 5. 
- Yes if a lot of checks are implemented in many places. This would reduce performance notably.