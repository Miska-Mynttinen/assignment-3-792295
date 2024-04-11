const { clientstreamingest } = require('./client-stream-app')

class IngestManager {
    constructor() {
        this._streamInput = null;
        this.scheduleArray = [];
        this.scheduleJobsRunning = false;
    }

    set streamInput(streamInput) {
        this._streamInput = streamInput;
    }

    get streamInput() {
        return this._streamInput;
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

    callClientStreamApp = (tenantId, dataId) => {
        // An API call to the specifix tenants clientbatchingestionapp which is a black box.
        clientstreamingest(tenantId, dataId, this._streamInput);
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
            
            this.callClientStreamApp(job[0], job[1]);
            // Remove started job from schedule
            amountOfJobs = amountOfJobs - 1;
            this.scheduleArray.shift();
        };

        this.scheduleJobsRunning = false;
    }
}

module.exports = IngestManager;