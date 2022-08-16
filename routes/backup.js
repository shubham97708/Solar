const mysqlDump = require('./backupms.js');
const router = require('express').Router();


router.get('/get', (req, res) => {
	if (req.session.adminId) {
		res.download('./datas.sql')
	} else {

	}

})


router.get('/', (req, res) => {

	if (req.session.adminId) {

		mysqlDump({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_PROJECT,
			//tables: [], // only these tables
			//@todo where: {'players': 'id < 1000'}, // Only test players with id < 1000
			extendedInsert: true, // use one insert for many rows
			addDropTable: true, // add "DROP TABLE IF EXISTS" before "CREATE TABLE"
			addLocks: true, // add lock before inserting data
			disableKeys: true, //adds /*!40000 ALTER TABLE table DISABLE KEYS */; before insert
			dest: './datas.sql' // destination file

			// destination file

		}, function (err) {
			if (err) throw err;

			// data.sql file created;
		})
		//res.xls(`Available Stock - ${(new Date()).toLocaleDateString()}.xlsx`);
		//res.send("Data Bakedup Succesfully");
		// call the rest of the code and have it execute after 3 seconds
		res.render("backup/backup")
		//res.download('./datas.sql')
	} else {
		res.send('Invalid')
	}
})


module.exports = router;