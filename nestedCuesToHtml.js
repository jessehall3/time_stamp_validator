var nestedCuesToHtml = function(nestedCues){
    var $mainArray = $('<ul></ul>');
    $mainArray.attr('id', 'mainArray');
    
    var traverse = function(arr, $ul){
        for(var i=0; i < arr.length; i++){
            var cue = arr[i];
            var $newLi = $('<li></li>')
            $newLi.attr('id', 'cueId-' + cue.index )
            $newLi.text( cue.text );
            $ul.append($newLi)
            
            if( cue.nestedCueChildren.length ){
                $newUl = $('<ul></ul>');
                $newUl.attr('class', 'children');
                $newLi.append($newUl);
                
                traverse(cue.nestedCueChildren, $newUl)
            }
        }
    }
    
    traverse(nestedCues, $mainArray);
    
    return $mainArray;
}
