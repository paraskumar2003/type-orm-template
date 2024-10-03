import Queue, { Job } from 'bull';
import { Queue as TypeQueue } from "bull";
const dotenv = require("dotenv");
dotenv.config();


// Create a Bull queue instance
export const listProcess_Guest: TypeQueue = new Queue('listProcess_Guest', {
    limiter: { max: 1000000, duration: 10000 }, // optional rate limiter
    redis: {
        host: process.env.NODE_ENV == "production" ? process.env.REDIS_HOST : process.env.REDIS_TESTING_HOST,
        port: 6379
    },
    prefix: "{BULLMQ}"
});



const processJob = async (job: Job, done: any) => {
    try {

        console.log(job.data);

        done();

    } catch (err: any) {

        done(err);
        console.log("error while exiting from the process", err.message);
        return err.message;
    }
};

listProcess_Guest.process(processJob);

listProcess_Guest.on('error', (error) => {
    console.error('Queue error:', error);
});

listProcess_Guest.on('connect', () => {
    console.log('Connected to Redis');
})

listProcess_Guest.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error: `, err);
});

listProcess_Guest.clean(60000, 'completed'); // Clean up completed and failed jobs every hour

process.on('SIGTERM', async () => {
    await listProcess_Guest.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    await listProcess_Guest.close();
    process.exit(0);
});
