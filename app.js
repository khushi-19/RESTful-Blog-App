//PACKAGES
var express = require("express");
var expressSanitizer  = require("express-sanitizer");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();


//APP CONFIG
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
mongoose.connect("mongodb://localhost:27017/blog_demo",{useNewUrlParser : true});

//creating the database collection defination: blogSchema 
// MONGOOSE/MODEL/CONFIG
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created : {type: Date , default : Date.now }
});

// creating the model from the blogSchema
var Blog  = mongoose.model("Blog",blogSchema);

//first blog created

/*
Blog.create({
    title:"Dogs As Pets",
    image:"https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313__340.jpg",
    body: "Nothing beats a long walk with your four-legged friend on a fresh, spring morning. Or seeing the joy on their faces when you pick up a ball and they know it’s playtime in the local park! Even relaxing at home feels better in each other’s company."
},function(err,blog){
    if(err){
        console.log(err);
    } else {
        console.log(blog);
    }
});
*/
/*
Blog.remove({title:"why Do We fall iLL?"},function(err,blogr){
    if(err){
        console.log(err);
    } else {
        console.log(blogr);
    }
});
Blog.remove({title:"Flowers Play Important Role"},function(err,blogr){
    if(err){
        console.log(err);
    } else {
        console.log(blogr);
    }
});
*/

//ROUTES


app.get("/",function(req,res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index",{blogs:blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,NewBlog){
        if(err){
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    var id = req.params.id;
    Blog.findById(id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show",{blog:foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog:blog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updateBlog){
      if(err){
          res.redirect("/blogs"); 
      } else {
          res.redirect("/blogs/"+ req.params.id);
      }       
    });
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});
//setting port
app.listen(8080,function(){
    console.log("entered blog app successfully");
});