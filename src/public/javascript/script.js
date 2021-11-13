$(document).ready(()=>{

    // hide-show header effect
    $("header").hide();
    $(".menu-icon").click(()=>{
        $("header").show(500);
    });

    $(".close-icon").click(()=>{
        $("header").hide(500);
    });

    //Toggle signin-signup effect
    $(".btn-signin").click(()=>{
        $(".btn-toggle").css("left","0");
        $(".form-signin").css("left","50px");
        $(".form-signup").css("left","450px")
    });

    $(".btn-signup").click(()=>{
        $(".btn-toggle").css("left","50%");
        $(".form-signin").css("left","-400px");
        $(".form-signup").css("left","50px")
    });
});