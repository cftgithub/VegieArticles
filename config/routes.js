module.exports = function(router) {
    router.get("/", function(req, res) {
        res.render("index");
    });

    router.get("/saved", function(req, res) {
        res.render("saved");
    });
}