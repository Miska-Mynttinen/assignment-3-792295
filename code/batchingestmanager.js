const { clientbatchingest } = require('./clientbatchingestapp.js')

class MySimBDPBatchIngestManager {
    constructor() {
        this._inputDirectory = null;
        this.scheduleArray = [];
        this.scheduleJobsRunning = false;
    }

    set inputDirectory(inputDirectory) {
        this._inputDirectory = inputDirectory;
    }

    get inputDirectory() {
        return this._inputDirectory;
    }

    notifyManager = (tenantId, dataId) => {
        // Gets notified by client-staging-input-directory about which client needs to read data from input-directory and ingest to mysimbdp-coredms
        // Calls scheduling to schedule the ingestion for the client
        // If scheduleJobsRunning is running add to the array and 
        if (this.scheduleJobsRunning) {
            this.scheduleArray.push([tenantId, dataId])
        } else {
            this.scheduleArray.push([tenantId, dataId])
            this.scheduleJobs()
        }
    }

    callClientIngestionApp = (tenantId, dataId) => {
        // An API call to the specifix tenants clientbatchingestionapp which is a black box.
        clientbatchingest(tenantId, dataId, this._inputDirectory);
    }
    
    scheduleJobs = () => {
        this.scheduleJobsRunning = true;
        let amountOfJobs = this.scheduleArray.length
        for (let job of this.scheduleArray) {
            // const tenant = tenantAgreements.filter((tenant) => tenant.tenantId === job[0])
            // const paymentGroup = tenant.paymentGroup
            if (amountOfJobs !== this.scheduleArray.length) {
                break
            }
            
            this.callClientIngestionApp(job[0], job[1]);
            // Remove started job from schedule
            amountOfJobs = amountOfJobs - 1;
            this.scheduleArray.shift();
        };

        this.scheduleJobsRunning = false;
    }
}

module.exports = MySimBDPBatchIngestManager;