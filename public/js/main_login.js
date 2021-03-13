(function ($) {
    "use strict";
    var email;
    var pwd;
    var username;
    var gender;

    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
		
	/*==================================================================
	Carousel slide show effect  */
	
	$('.carousel').carousel({
		interval: 2000
	})
		
	/*==================================================================
		tooltip text */
	
	$(document).ready(function(){
		$('[data-toggle="tooltip"]').tooltip();
    });
        
     /*==================================================================
	    Display next part of login form */
	/*$(function() {
	    $(".next100-form-btn").on("click",function(e) { 

            /*==================================================================
             [ Validate email ID]*/
           /* var input = $('.validate-input .input100');
               
            email =  $("#email").val();
            pwd = $("#pass").val();

            var check_email = true;

            for(var i=0; i<input.length; i++) {
                if(validate(input[i]) == false){
                    showValidate(input[i]);
                    check_email=false;
                }
            }
        });
    }); */
    
   
    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
      
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
            else {
                if($(input).val().trim().match('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}') == null) {
                    return false;
                }
            }
        }
      
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    } 
    
    /*==================================================================
    [Validate login form] */

    $('.validate-form').on('submit',function(e) {
        var check = true;
        email =  $('#email').val();
        pwd = $('#pass').val();
        username = $("#username").val();
        document.getElementById("email-hidden").value = email;
        
        var jsondata = JSON.stringify({'email':email,'password':pwd,'name':username});
       
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/api/user/signin",
            data: jsondata,
            async: false,
 
            success: function (data) {
            },
            
            error: function (request, status, error) {
                $("#ajax_alert").addClass('alert alert-danger alert-dismissible'); 
                $("#ajax_alert").css("display", "block");
                $('#alert_close').css("display", "block");
                $("#alert_text").css("display", "block");
                $("#alert_text").html(request.responseText);
                $('#retry_login').css("display", "block");
                check = false;               
            }
                 
        });
         
          return check;
    });

    /*=====================================================================
        validate signup form */
        $('.register100-form').on('submit',function(e) {
           
            var check = true;
            email =  $('#email').val();
            pwd = $('#password').val();
            username = $("#name").val();
            gender=$("#gender").val();
            
            var jsondata = JSON.stringify({'email':email,'password':pwd,'name':username,'gender':gender});
           
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/api/user/signup",
                data: jsondata,
                async: false,
     
                success: function (data) {
                    $("#ajax_alert").addClass('alert alert-success'); 
                    $("#ajax_alert").css({"display": "block", "width": "50%", "margin-left": "auto", "margin-right": "auto", "text-align": "center"});
                    $("#alert_text").css("display", "block");
                    $("#alert_text").html(data);
                    
                    setTimeout(() => {
                        $("#ajax_alert").removeClass('alert alert-success');
                        $("#ajax_alert").addClass('alert alert-info'); 
                        $("#alert_text").html('Redirecting to login page.......');   
                    }, 3000);
                    
                    setTimeout(() => {
                        window.location.href = "/users/login";
                    }, 6000);
                },
                
                error: function (request, status, error) {
                    $("#ajax_alert").addClass('alert alert-danger'); 
                    $("#ajax_alert").css({"display": "block", "width": "50%", "margin-left": "auto", "margin-right": "auto", "text-align": "center"});
                    $("#alert_text").css("display", "block");
                    $("#alert_text").html(request.responseText);
                    check = false;               
                }
                     
            });
                return check;
        });
    

        /*=====================================================================
        validate password reset form */
        $('.password_reset100-form').on('submit',function(e) {
           
            var check = true;
            email =  $('#email').val();
            pwd = $('#password').val();
            
            var jsondata = JSON.stringify({'email':email,'password':pwd});
           
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/api/user/passwordreset",
                data: jsondata,
                async: false,
     
                success: function (data) {
                    $("#ajax_alert").addClass('alert alert-success'); 
                    $("#ajax_alert").css({"display": "block", "width": "50%", "margin-left": "auto", "margin-right": "auto", "text-align": "center"});
                    $("#alert_text").css("display", "block");
                    $("#alert_text").html(data);
                    
                    setTimeout(() => {
                        $("#ajax_alert").removeClass('alert alert-success');
                        $("#ajax_alert").addClass('alert alert-info'); 
                        $("#alert_text").html('Redirecting to login page.......');   
                    }, 3000);
                    
                    setTimeout(() => {
                        window.location.href = "/users/login";
                    }, 6000);
                },  
                                
                error: function (request, status, error) {
                    $("#ajax_alert").addClass('alert alert-danger'); 
                    $("#ajax_alert").css({"display": "block", "width": "50%", "margin-left": "auto", "margin-right": "auto", "text-align": "center"});
                    $("#alert_text").css({"display": "block", "font-weight": "bold"});
                    $("#alert_text").html(request.responseText);
                    check = false;               
                }
                     
            });
                return check;
        });
    

    /*======================================================================
        Validate password and confirm password field */
    $('#password, #confirm_password').on('keyup', function () {
        if ($('#password').val() == $('#confirm_password').val()) {
              $('#message').html('Matching').css('color', 'green');
        } 
        else 
              $('#message').html('Not Matching').css('color', 'red');
    });
                     
})(jQuery);
