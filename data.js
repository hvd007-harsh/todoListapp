exports.date = function date(){ 
var date = new Date();
var Today = date.toLocaleDateString('hi-IN',{
    weekday: "long",
    day: "numeric",
    year: "numeric",
})
return Today;
}