const zlib=require("zlib");
const crypto = require("crypto");

// fonction li kat9ra la liste dyal les produits
const { readProducts } = require("../services/productService");


// fonction li katrd ga3 les produits
function getProducts(req, res, logger) {
  const products = readProducts(); // kat9ra les produits mn service
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" }); // kat3ti reponse type dyal contenu JSON
  res.end(JSON.stringify(products)); //stringify : kat7wel array/object l txt JSON
  logger.log({ event: "response:sent", statusCode: 200, route: "/api/products" }); // katlogi f logger had event

}
// fonctioon katred lik les produit bl'ID
function getProductById(req, res, logger) {
  const id = req.url.split("/").pop();
  const products = readProducts();
  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" }); // kired error 404 ila ma l9ahch
    res.end(JSON.stringify({ error: "Product not found" }));
    logger.log({ event: "response:sent", statusCode: 404, route: req.url }); //kisejl l'error f'logger
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" }); 
  res.end(JSON.stringify(product)); //kay afficher le produit bl'ID
  logger.log({ event: "response:sent", statusCode: 200, route: req.url }); // kisejl l'event f'logger
 
}

// fonction katred les produits filtré
function getFilteredProducts(req, res, parsedUrl, logger) {
  try {
    const products = readProducts();
    const params = parsedUrl.searchParams;
    if(!params){getProducts()}

    // Récupération des critères
    const id = params.get("id");
    const name = params.get("name");
    const category = params.get("category");
    const price = params.get("price");

    // lanfiltriw 3la hsab critères
    let filtered = products;

    if (id) filtered = filtered.filter(p => p.id === Number(id));
    if (name)
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    if (category)
      filtered = filtered.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
    if (price) filtered = filtered.filter(p => p.price == Number(price));

    // jawab 
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(filtered, null, 2));
    logger.log(`GET /products - filters: ${params.toString()} - ${filtered.length} result(s)`);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Erreur interne: " + error.message }));
    logger.log("Erreur dans getFilteredProducts: " + error.message);
  }
}

// fonction katexporti les produits f format gz
function exportgz(req,res,logger){
  try{
    const products = readProducts();
    const products_json = JSON.stringify(products);
    zlib.gzip(products_json,(err,compressed)=>{
      if(err){
         res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "compression failed" }));
  
      }
      const secretKey=process.env.SIGN_KEY|| "default_secret"; // kandiro clé secrète l'signature HMAC
      const signature= crypto
      .createHmac("sha256",secretKey)
      .update(products_json)
      .digest("hex");
      res.writeHead(200, { "Content-Type": "application/gzip","Content_Disposition": 'attachment; filename="products.json.gz"',"X_Signature":signature});
      res.end(compressed);
    })
  }catch(error){
     res.writeHead(500, { "Content-Type": "application/json"});
     res.end(JSON.stringify({error}));
  }
return ;
}
//exportation dyal had les fonctions
module.exports = { getProducts, getProductById ,getFilteredProducts,exportgz};
