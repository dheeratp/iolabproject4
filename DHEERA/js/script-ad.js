$(document).ready(function(){

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


