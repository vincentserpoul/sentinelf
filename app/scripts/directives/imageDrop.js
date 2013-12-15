'use strict';

sentinelfApp
.directive("imageDrop",
  /* thx to https://github.com/Mischi/angularjs-imageupload-directive/blob/master/public/javascripts/imageupload.js */
    function($q) {

        var URL = window.URL || window.webkitURL;

        var fileToDataURL = function (file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            };
            reader.readAsDataURL(file);
            return deferred.promise;
        };


        return {
            restrict: 'EA',
            scope: {
                image: '=',
            },
            link: function postLink(scope, element, attrs, ctrl) {

                var applyScope = function(imageResult) {
                    scope.$apply(function() {
                        //console.log(imageResult);
                        if(attrs.multiple){
                            scope.image.push(imageResult);
                        }
                        else {
                            scope.image = imageResult;
                            scope.image.url
                        }
                    });
                };


                element.bind('change', function (evt) {
                    //when multiple always return an array of images
                    if(attrs.multiple)
                        scope.image = [];

                    var files = evt.target.files;
                    for(var i = 0; i < files.length; i++) {
                        //create a result object for each file in files
                        var imageResult = {
                            file: files[i],
                            url: URL.createObjectURL(files[i])
                        };

                        fileToDataURL(files[i]).then(function (dataURL) {
                            imageResult.dataURL = dataURL;
                        });

                        applyScope(imageResult);

                    }
                });
            }
        };
    });
