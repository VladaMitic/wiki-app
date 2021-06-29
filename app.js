const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

// Request targeting all articles
app.route('/articles')
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                //console.log(foundArticles);
                res.send(foundArticles);
            } else {
                console.log(err);
            }
        });
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("New article has been added!")
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("All articles has been deleted!")
            } else {
                res.send(err);
            }
        });
    });
// Request targeting specific atricle
app.route('/articles/:articleTitle')
    .get(function(req, res) {
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
            if(foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No article matching this title was found!");
            }
        });
    })
    .put(function(req, res) {
        Article.replaceOne(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content},
            function(err, result) {
                console.log(result);
                if(!err) {
                    res.send("Article has been replaced!");
                } else {
                    res.send(err);
                }
            });
    })
    .patch(function(req, res) {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err) {
                if(!err) {
                    res.send("Article has been updated!");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete(function(req, res) {
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err) {
                    res.send("Article has been deleted!");
                } else {
                    res.send(err);
                }
            }
        );
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});