'use strict';

/* cast to date if not a date */
sentinelfApp.filter('stringDate', function($filter)
{
    return function(dateSource, format)
    {
        if(dateSource == null){ return ""; }
        var _dateDateFormatted = new Date(dateSource);
        var _date = $filter('date')(_dateDateFormatted, format);
        return _date;
    };
})
