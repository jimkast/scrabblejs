var Schema = mongoose.Schema;

var Product = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    style: {
        type: String,
        unique: true
    },
    modified: {
        type: Date,
        default: Date.now
    }
});



var ProductModel = mongoose.model('Product', Product);








// ------ CRUD --------




// READ a List of Products

app.get('/api/products', function(req, res) {
    return ProductModel.find(function(err, products) {
        if (!err) {
            return res.send(products);
        } else {
            return console.log(err);
        }
    });
});



// CREATE a Single Product

app.post('/api/products', function(req, res) {
    var product;
    console.log("POST: ");
    console.log(req.body);
    product = new ProductModel({
        title: req.body.title,
        description: req.body.description,
        style: req.body.style,
    });
    product.save(function(err) {
        if (!err) {
            return console.log("created");
        } else {
            return console.log(err);
        }
    });
    return res.send(product);
});




// UPDATE a Single Product by ID

app.put('/api/products/:id', function(req, res) {
    return ProductModel.findById(req.params.id, function(err, product) {
        product.title = req.body.title;
        product.description = req.body.description;
        product.style = req.body.style;
        return product.save(function(err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            return res.send(product);
        });
    });
});



// DELETE a Single Product by ID

app.delete('/api/products/:id', function(req, res) {
    return ProductModel.findById(req.params.id, function(err, product) {
        return product.remove(function(err) {
            if (!err) {
                console.log("removed");
                return res.send('');
            } else {
                console.log(err);
            }
        });
    });
});
