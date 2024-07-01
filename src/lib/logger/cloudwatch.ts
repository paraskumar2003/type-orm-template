import winston from 'winston'; // Importing the Winston logging library
const WinstonCloudWatch = require('winston-aws-cloudwatch'); // Requiring the Winston AWS CloudWatch transport library
import AWS from 'aws-sdk'; // Importing the AWS SDK for Node.js
import dotenv from 'dotenv'; // Importing the dotenv library to load environment variables from a .env file
dotenv.config(); // Loading environment variables from the .env file

// Interface for the log formatter
interface LogFormatter {
    message: string; // The log message
    level: "emerg" | "alert" | "crit" | "error" | "warning" | "notice" | "info" | "debug"; // The log level (e.g., info, error, debug)
    meta: any; // Additional metadata for the log
}

interface LoggerOptions {
    logGroupName?: string;
    logStreamName?: string;
}

// Custom log levels
var levels = {
    emerg: 0, // Emergency: system is unusable
    alert: 1, // Alert: action must be taken immediately
    crit: 2, // Critical: critical conditions
    error: 3, // Error: error conditions
    warning: 4, // Warning: warning conditions
    notice: 5, // Notice: normal but significant condition
    info: 6, // Informational: informational messages
    debug: 7 // Debug: debug-level messages
};

// Creating a Winston logger instance with custom levels and CloudWatch transport
const logger = ({ logStreamName, logGroupName }: LoggerOptions) => winston.createLogger({
    levels: levels, // Setting the custom log levels
    transports: [
        new WinstonCloudWatch({
            cloudWatchLogs: new AWS.CloudWatchLogs(), // Creating a new CloudWatchLogs instance
            logGroupName: logGroupName || (process.env.NODE_ENV == 'development' ? 'PROJECT_DEV' : 'PROJECT_PROD'), // Log group name based on the environment
            logStreamName: logStreamName || (process.env.NODE_ENV == 'development' ? 'PROJECT_DEV' : 'PROJECT_PROD'), // Log stream name based on the environment
            createLogGroup: true, // Option to create the log group if it doesn't exist
            createLogStream: true, // Option to create the log stream if it doesn't exist
            submissionInterval: 2000, // Interval in milliseconds for submitting logs
            submissionRetryCount: 1, // Number of retry attempts for submitting logs
            batchSize: 20, // Maximum number of log events to send in a single batch
            awsConfig: {
                accessKeyId: process.env.CLOUDWATCH_ACCESS_KEY, // AWS access key ID from environment variables
                secretAccessKey: process.env.CLOUDWATCH_SECRET_ACESS_KEY, // AWS secret access key from environment variables
                region: 'ap-south-1', // AWS region
            },
            formatLog: function (item: LogFormatter) {
                // Function to format the log message before sending to CloudWatch
                return item.level + ': ' + item.message + ' ' + JSON.stringify(item.meta);
            }
        }),
    ],
});

export { logger }; // Exporting the logger instance for use in other parts of the application


// Example Usage

// 1. For Creating different streams.

// Approach 1

// logger({ logGroupName: "testing", logStreamName: "testing_stream_1" }).info("testing", {
//     tag: "just_a_testing_log", data: {
//         name: "Paras",
//         age: 20,
//         company: "almonds.ai"
//     }
// })

// logger({ logGroupName: "testing", logStreamName: "testing_stream_2" }).info("testing", {
//     tag: "just_a_testing_log", data: {
//         name: "Paras",
//         age: 20,
//         company: "almonds.ai"
//     }
// })


// Approach 2

// let myLogger = logger({ logGroupName: "testing", logStreamName: "testing_stream_3" })

// myLogger.info("testing", {
//     tag: "just_a_testing_log", data: {
//         name: "Paras",
//         age: 20,
//         company: "almonds.ai"
//     }
// })


