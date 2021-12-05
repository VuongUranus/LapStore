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

    //Show bubble and change link user-profile
    $.post("/checkLogin",(data)=>{
        if(data){
            $(".wrapper-bubble").css("display","block");
            $("header .nav li:last-child a").attr("href","/me");
        }
    });


    //Message effect
    setTimeout(()=>{
        $(".message-wrapper").css("transform","scale(0)");
    },5000);

    //Scroll to
    $("p button.scroll").click(()=>{
        $('html,body').animate({scrollTop: $(".homeHeading").offset().top},500);
    });

    //Do not enter negative number and special characters
    $("input[type='number']").keydown((e)=>{
        if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58) 
        || e.keyCode == 8
        || e.keyCode == 13)) {
          return false;
        }
    })


    //Cart page
    $(".wrapper-cart input[type='number']").change(e=>{
        let value = Number($(e.target).closest('td').siblings('.product').find('div p strong').html()) * Number($(e.target).val());
        $(e.target).closest("td").siblings('.subtotal').html(value);
        grossTotal();

        $(e.target).closest('form').submit();

    });

    function grossTotal(){
        let grossTotal = 0;
        $(".wrapper-cart td.subtotal").each((index,value)=>{
            grossTotal += Number($(value).text());
        })
        $(".wrapper-cart .grossTotal").html(grossTotal);
    }

    grossTotal();


});
