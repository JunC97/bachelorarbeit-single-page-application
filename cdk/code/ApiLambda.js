const AWS = require('aws-sdk');
const RDS = new AWS.RDSDataService();
const s3 = new AWS.S3();

exports.handler = async (event, context) => {
    const parsed_event = JSON.parse(JSON.stringify(event));
    const path = await parsed_event["path"];
    const eventRows = await parsed_event["rows"];
    const eventValues = await parsed_event["values"];
    var eventCondition = "";
    eventCondition = await parsed_event["condition"];
    const sliced_path = await path.slice(1);
    const split_path = await sliced_path.split('/');
    console.log("extracted path: " + path);
    //console.log("extracted path split: " + sliced_path);
    console.log("extracted path split: " + split_path);

    var sqlStatement = '';
    var rows = "";
    var values = "";
    var update = "";

    

    //IMPLEMENT WAY TO DISTINGUISH (JOINED) TABLES
    //SET TABLES THEN WRITE QUERIES SPECIFICLY AS NEEDED

    try {
        /*######################*\
        |#      EXECUTION       #|
        \*######################*/
        const params = {
            secretArn: process.env.serverlessClusterSecretArn,
            resourceArn: process.env.dbClusterArn,
            sql: sqlStatement,
            database: 'auroraDbVwDpp',
        }
        console.log("SQL-Statement to be executed: " + sqlStatement)
        let dbRespo = await RDS.executeStatement(params).promise();
        (!dbRespo) ? console.log("execution failed!") : console.log("execution successfull!");

        //----------------------------------------------------------------------

        /*######################*\
        |#      RESPONSE        #|
        \*######################*/

        //ONLY SEND DATA IN BODY WHEN SELECT QUERY WAS EXECUTED
       
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin" : "*",
                    "Access-Control-Allow-Credentials" : true
                },
                body: JSON.stringify(dbRespo, null, 2),
            };
            console.log("SUCCESS! Following query was successfully sent and executed: " + sqlStatement + ". Called API: " + path)
            return response


            //const response = {
            //statusCode: 200,
            //headers: {
            //    "Access-Control-Allow-Origin" : "*",
            //    "Access-Control-Allow-Credentials" : true
            //},
            //body: "SUCCESS! Following query was successfully sent and executed: " + sqlStatement + ". Called API: " + path,
            //};
            //return response
        


    } catch (err) {
        console.log(err)
        return err
    }
};
