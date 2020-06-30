/// <username>  <password>  <dbname>
/// db("test")
///	collection("devices")

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://db03:MJolOKemr4zdzF3E@shopping.v6trt.mongodb.net/ATN_Company?retryWrites=true&w=majority";

/// Database & Bảng dữ liệu cần Truy vấn
const NameDataBase = "ATN_Company";
const NameTable = "Product";

/// Thay ở đây !!!
MongoClient.connect(
	uri, 
	{ useNewUrlParser: true , useUnifiedTopology: true }
)
.then (client => {
  var dbo = client.db(NameDataBase);
  
  ////// Thông tin Sản phẩm mới cần CHÈN vào DB
  var newProduct = {
	Name: "máy tính Dell", 
	Price: "18000000", 
	Unit: "cái", 
	Information: "i7 8700, ram 16gb, gtx1660"
  };
  
  ////// Run - INSERT
  dbo.collection(NameTable).insertOne(newProduct)
	.then (results => {
		console.log("Insert OK !");
		client.close();
	})
	.catch(error => console.error(error));
})
.catch(error => console.error(error));