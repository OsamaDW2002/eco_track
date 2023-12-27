const {PubSub} = require('@google-cloud/pubsub');

require('dotenv').config()
process.env.GOOGLE_APPLICATION_CREDENTIALS="./project_connections/gcp.json"
const pubsub = new PubSub({projectId: process.env.GCP});

async function publishToPub(data) {
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const topic = pubsub.topic(process.env.GCP_TOPIC);

    await topic.publishMessage({data: dataBuffer})

}

module.exports = publishToPub