# Vercel Cron Job with MongoDB and API Key

This project contains a cron job implemented on Vercel, located in the `api/cron.js` file. The cron job connects to a MongoDB database and requires an Alchemy API key for operation.

## Setup Instructions

### Prerequisites

- A MongoDB database URI.
- An API key.

### Steps to Set Up

1. **Clone the Repository**

   Clone this repository to your local machine:

   ```bash
   git clone https://github.com/prithvikr66/cc-scheduler
   cd cc-scheduler

   npm install
   ```

# or

yarn install

2.**Replace ALCHEMY Api Key & Mongo URI**
Mongo uri on LINE 27
ALCHEMY API KEY on LINE 27

3.**Deploy to Vercel by linking the github repo**
this script is intended to run every day once to populate the db. the schedule time can be modified in the vercel.json file by changing the schedule variable.
