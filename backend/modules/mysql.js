// Import MySql
const mySql = require("mysql2/promise");

/**
 * MySql object with configuration data.
 */
const SQL_CONFIGURATION_DATA =	
{
	host: "10.1.5.205", // Private IP
	//host: "181.47.29.35", // Public IP
	user: "2024-5BINF-G07",
	password: "tdkus2024",
	database: "2024-5BINF-G07",		
	port: 3306,
	charset: 'UTF8_GENERAL_CI'
}		

/**
 * Query to MySql Server.
 * @param {String} queryString Query to-do. Exactly as if it was in MySql Workbench.
 * @returns DB Response, array of objects.
 */
exports.makeQuery = async function (queryString)
{
	let returnObject;
	let connection;
	try
	{
		connection = await mySql.createConnection(SQL_CONFIGURATION_DATA);
		returnObject = await connection.execute(queryString);
	}
	catch(err)
	{
		console.log(err);
	}
	finally
	{
		if(connection && connection.end) connection.end();
	}
	return returnObject[0];
}