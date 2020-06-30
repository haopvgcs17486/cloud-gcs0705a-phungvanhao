const express = require('express')
const app = express()
const port = 8080
var path = require('path');
var router = express.Router();  


/// ***************** ***************** *****************
/// ***************** ***************** SET

app.use(express.static('public'));          
app.set('view engine', 'ejs');              ///***** */


/// ***************** ***************** *****************
/// ***************** ***************** Config DB CONNECTION
const MongoClient = require('mongodb').MongoClient;
const mongosee = require('mongoose');

/// ***************** 
const Product = require('./models/product');
const Staff = require('./models/staff');

/// ***************** 
const uri = 'mongodb://localhost:27017/ATN_Company';
const urirem = "mongodb+srv://db03:MJolOKemr4zdzF3E@shopping.v6trt.mongodb.net/ATN_Company?retryWrites=true&w=majority";


/// ***************** ***************** *****************
/// ***************** Database & Bảng dữ liệu cần Truy vấn
const NameDataBase =  "atnshop"; // "CloudDB";
var xflag = 0;
var vResult = [];
var accLogin = null;


/// ***************** ***************** *****************
async function runQuery(NameTable , vQuery) {
	
	const xdbo = await MongoClient.connect(
		uri, 
		{ useNewUrlParser: true , useUnifiedTopology: true }
    );    
	const dbo = xdbo.db(NameDataBase);
	////// Run - Query
	const results = await dbo.collection(NameTable).find(vQuery).toArray();

    ///
    vResult = results;
    console.log(results);
    xflag = 1;

	return results;
}

/// *****************
async function readDB() {
    const inf = await runQuery( "Products" , {} );
    vResult = inf;
    xflag = 1;
}


/// ***************** 
async function responseDB(response, xview, xModel, xQuery, xparams, xtag) {

    const xdb = await mongosee.connect(
        uri, 
        { useNewUrlParser: true , useUnifiedTopology: true }
    );
    
    if (xdb) 
    {
        //xQuery = { Password : "" , _id : ""};
        const kq = await xModel.find(xQuery).exec();

        if (kq) {
            xparams[xtag] = kq;            
            console.log(xview + "\t THanh cong !");
            response.render(xview, xparams);
            //response.redirect("/home");
        }
    } else {
        response.send("ko thanh cong !");
        //response.redirect('/login');
    }

}


/// ***************** ***************** *****************
app.get('/', viewHome);
function viewHome(request, response) {
    response.sendFile(path.join(__dirname + '/views/home.html'));  ///***** */
}


/// ***************** ***************** *****************
app.get('/login', viewLogin);
function viewLogin(request, response) {
    if (request.query.username > "" && request.query.password > "") {
        //response.send("Login " + request.query.username  + "//" + request.query.password);
        response.redirect('/');
    } else {
        response.sendFile(path.join(__dirname + '/views/login.html'));  ///***** */
    }
}


/// ***************** ***************** *****************
app.get('/products', viewProducts);
async function viewProducts(request, response) {
    responseDB(response, "productlist",
				Product, {}, {}, "productlist");
}


/// ***************** ***************** *****************
app.get('/staffs', viewStaffs);
async function viewStaffs(request, response) {
    responseDB(response, "stafflist",
				Staff, {}, {}, "stafflist");
}


/// ***************** ***************** *****************
app.get('/product/:stt', viewProduct);
function viewProduct(request, response) {
	// request.params.stt;
    var stt = Number(request.params.stt);

    // const inf = await runQuery( "Products" , {} );
    if (xflag == 0) {
        readDB();
        response.send("Web - Product Catalog page !" + stt);
    } else {
        console.log(vResult[stt]);
        response.render("productdetail", vResult[stt]);
    }

}


/// ***************** ***************** *****************
app.get('/order', viewOrder);
function viewOrder(request, response) {
    responseDB(response, "order",
				Product, {}, {}, "productlist");
}



/// /payment
/// ***************** ***************** *****************
app.get('/payment', viewPayment);
function viewPayment(request, response) {
    //response.send("Web - PAYMENT page !" + request.query.dssp);
    var dssp = request.query.dssp;
    var listkq = dssp.split("_");

    listsp = [];
    for (i=0; i< listkq.length / 2; i++) {
        listsp.push(
            { Name : "Tivi " + listkq[i*2], Price : 30000, Num: listkq[i*2+1]},
        );
    }
    

    response.render("payment", { productlist : listsp });
}



/// ***************** ***************** *****************
app.get('/report', viewReport);
function viewReport(request, response) {
    response.send("Web - REPORT page !");
}


/// ***************** ***************** *****************
app.get('/profile/:msnv', viewProfile);
function viewProfile(request, response) {
    var strMS = "" + request.params.msnv;
 
    responseDB(response, "staffdetail",
    Staff, { MSNV : strMS}, {}, "stafflist");
}


/// ***************** ***************** *****************
app.get(/.*\.nntu$/, viewSecret);
function viewSecret(request, response) {
    response.send("Web - Secret page ! " + request.url);
}




/// ***************** ***************** *****************
app.get('/review', viewReview);
function viewReview(request, response) {
    response.send("<H1> REVIEW ASSIGNMENT 2 ! </h1>");
}


/// ***************** ***************** *****************
/// ***************** ***************** *****************
/// ***************** ***************** *****************
app.listen(port, () => console.log(`\n\tWeb app listening at http://localhost:${port}`));