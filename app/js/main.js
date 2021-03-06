$(document).ready(function() {

    var $wnd = $(window);
    var $top = $(".page-top");
    var $html = $("html, body");
    var $header = $(".header");
    var $menu = $(".main-menu");
    var utms = parseGET();
    var headerHeight = 146;
    var $hamburger = $(".hamburger");
    var thanks = $('[data-remodal-id="thanks-modal"]').remodal();

    if(utms && Object.keys(utms).length > 0) {
        window.sessionStorage.setItem('utms', JSON.stringify(utms));
    } else {
        utms = JSON.parse(window.sessionStorage.getItem('utms') || "[]");
    }

    if($wnd.width() < 992) {
        headerHeight = 94;
    }

    $wnd.scroll(function() { onscroll(); });

    var onscroll = function() {
        if($wnd.scrollTop() > $wnd.height()) {
            $top.addClass('active');
        } else {
            $top.removeClass('active');
        }

        if($wnd.scrollTop() > 0) {
            $header.addClass('scrolled');
        } else {
            $header.removeClass('scrolled');
        }

        var scrollPos = $wnd.scrollTop() + headerHeight;

        $menu.find(".link").each(function() {
            var link = $(this);
            var id = link.attr('href');
            
            if(id.length > 1 && id.charAt(0) == '#' && $(id).length > 0) {
                var section = $(id);
                var sectionTop = section.offset().top;

                if(sectionTop <= scrollPos + 1 && (sectionTop + section.height()) >= scrollPos) {
                    link.addClass('active');
                } else {
                    link.removeClass('active');
                }
            }
        });
    }

   onscroll();

   $(".main-menu .link").click(function(e) {
      var $href = $(this).attr('href');
      if($href.length > 1 && $href.charAt(0) == '#' && $($href).length > 0) {
         e.preventDefault();
         var top = $($href).offset().top - headerHeight;
         $html.stop().animate({ scrollTop: top }, "slow", "swing");
      }

      if($wnd.width() <= 991) {
         toggleHamburger();
      }
   });

    $top.click(function() {
        $html.stop().animate({ scrollTop: 0 }, 'slow', 'swing');
    });

    $("input[type=tel]").mask("+7 (999) 999 99 99", {
        completed: function() {
            $(this).removeClass('error');
        }
    }); 

    $("input:required, textarea:required").keyup(function() {
        var $this = $(this);
        if($this.attr('type') != 'tel') {
            checkInput($this);
        }
    });

    $hamburger.click(function() {
        toggleHamburger();
        return false;
     });  
  
     function toggleHamburger() {
        $this = $hamburger;
        if(!$this.hasClass("is-active")) {
           $this.addClass('is-active');
           $menu.slideDown('700');
        } else {
           $this.removeClass('is-active');
           $menu.slideUp('700');
        }
     }

    $(document).on('closing', '.remodal', function (e) {
      $(this).find(".input, .textarea").removeClass("error");
      var form = $(this).find("form");
      if(form.length > 0) {
        form[0].reset();
      }
    });

   $(".ajax-submit").click(function(e) {        
      e.preventDefault();
      var $form = $(this).closest('form');
      var $requireds = $form.find(':required');
      var formValid = true;

      $requireds.each(function() {
         $elem = $(this);

         if(!$elem.val() || !checkInput($elem)) {
            $elem.addClass('error');
            formValid = false;
         }
      });

      var data = $form.serialize();

      if(Object.keys(utms).length > 0) {
         for(var key in utms) {
               data += '&' + key + '=' + utms[key];
         }
      } else {
         data += '&utm=Прямой переход'
      } 

      if(formValid) {
         $.ajax({
               type: "POST",
               url: "/mail.html",
               data: data
         }).done(function() {                
         });

         $requireds.removeClass('error');
         $form[0].reset();
         thanks.open();
      }
   });

   $(".review-link").click(function(e) {
      e.preventDefault();      
      $(this).prev().toggleClass("active");      
   });

   $(".contact-address").click(function() {
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
      
      var id = $(this).data("id");
      $(".contact [data-target]").removeClass("active").filter("[data-target=" + id + "]").addClass("active");
   });

   $(".video-thumb").click(function() {
       var id = $(this).data("id");
       $(".video-main > iframe").attr("src", "https://www.youtube.com/embed/" + id);
       $(".video-text").html($(this).data("title"));
   });

   $(".certificate-carousel").on('init', function(event, slick){
      slick.$slider.find(".slick-center").prev().addClass("slick-center-prev");
   });

   $(".certificate-carousel").on('beforeChange', function(event, slick, currentSlide, nextSlide){
      slick.$slider.find(".slick-slide").removeClass("slick-center-prev");
      if ((currentSlide > nextSlide && (nextSlide !== 0 || currentSlide === 1)) || (currentSlide === 0 && nextSlide === slick.slideCount - 1)) {
         slick.$slider.find(".slick-center").prev().prev().addClass("slick-center-prev");
      }
      else {
         slick.$slider.find(".slick-center").addClass("slick-center-prev");
      }
   });

   $('.certificate-carousel').slick({
      prevArrow: '<button type="button" class="slick-prev"></button>',
      nextArrow: '<button type="button" class="slick-next"></button>',
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      centerMode: true,
      draggable: false,
      centerPadding: '0px',
      responsive: [
         {
            breakpoint: 992,
            settings: {
              slidesToShow: 3,
            }      
         },
         {
            breakpoint: 768,
            settings: {
               slidesToShow: 1,
            }      
         }
      ]
  });

   $(".doctors-carousel").owlCarousel({    
      nav: true,
      dots: false,
      loop: true,
      smartSpeed: 500,
      margin: 30,
      navText: ['', ''],
      responsive: {
         0: { items: 1, mouseDrag: false },
         480: { items: 2, mouseDrag: true },
         768: { items: 3 }
      },
   });

   $(".reviews-carousel").owlCarousel({    
      nav: true,
      dots: true,
      loop: true,
      smartSpeed: 500,
      margin: 30,
      navText: ['', ''],
      items: 1
   });

   $(".klinika-carousel").owlCarousel({    
      nav: true,
      dots: true,
      loop: true,
      smartSpeed: 500,
      margin: 30,
      navText: ['', ''],
      items: 1
   });

   $(".vopros-button").click( function() {
      $(this).parent().toggleClass("active");
   });

});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function checkInput($input) {
    if($input.val()) {
        if($input.attr('type') != 'email' || validateEmail($input.val())) {
            $input.removeClass('error');
            return true;
        }
    }
    return false;
}
    
function parseGET(url){
    var namekey = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    if(!url || url == '') url = decodeURI(document.location.search);
     
    if(url.indexOf('?') < 0) return Array(); 
    url = url.split('?'); 
    url = url[1]; 
    var GET = {}, params = [], key = []; 
     
    if(url.indexOf('#')!=-1){ 
        url = url.substr(0,url.indexOf('#')); 
    } 
    
    if(url.indexOf('&') > -1){ 
        params = url.split('&');
    } else {
        params[0] = url; 
    }
    
    for (var r=0; r < params.length; r++){
        for (var z=0; z < namekey.length; z++){ 
            if(params[r].indexOf(namekey[z]+'=') > -1){
                if(params[r].indexOf('=') > -1) {
                    key = params[r].split('=');
                    GET[key[0]]=key[1];
                }
            }
        }
    }

    return (GET);    
};