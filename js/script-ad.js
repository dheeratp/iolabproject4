$(document).ready(function(){

    var viewportWidth = $(window).width();
    var viewportHeight = $(window).width();

    $('#infoWrapper').css({
        width: viewportWidth,
        height: viewportHeight,
    });

    $('#info').css({
        left:(viewportWidth-300)/2,
    });

    $('#infoWrapper').animate({
        opacity:1,
    },300);

    $('#info').animate({
        top:60,
        opacity:1,
    },300);

    $('#infoClose, #exploreButton').click(
        function(){
            $('#info').animate({
                top:-350,
                opacity:0,
            },300);
            $('#infoWrapper').animate({
                opacity:0,
                zIndex:70,
            },600);
        }
    );

    $('#marker').hover(
        function(){
            $('#trackHoverCard').css({
                display:'block',
            });
            $('#trackHoverCard').filter(':not(:animated)').animate({
                opacity:1,
            },100);
        },
        function() {
            $('#trackHoverCard').animate({
                opacity:0,
            },100);
            $('#trackHoverCard').css({
                display:'none',
            });
        }
    );

    $('#marker').click(
        function(){
            $('#metroChartModal').css({
                display:'block',
            });
            $('#metroChartModal').filter(':not(:animated)').animate({
                opacity:1,
            },100);
        }
    );

     $('#modalClose').click(
        function() {
            $('#metroChartModal').animate({
                opacity:0,
            },100);
            $('#metroChartModal').css({
                display:'none',
            });
        }
    );

});


