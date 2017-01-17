var Cue = function(index, startTime, endTime, text, children){
    this.index = index;
    this.startTime = startTime;
    this.endTime = endTime;
    this.text = text || "";
    this.children = children || [];
}

var validate_and_return_array_of_nested_cues = function(cueList){
    
    if( cueList.length < 1 ){
        console.log("The cue list is empty.");
        return -1;
    }
    
    var isValidNest = function( childCue, rhsCueItem ){
        // rhsCueItem will always be the end-time of a parent cue
        if( rhsCueItem === undefined){
            // there are no open parent cues
            return true;
        }
        return childCue.endTime <= rhsCueItem.time
    };
    
    var CueItem = function(cue, type){
        this.index = cue.index;
        this.stampType = type;
        this.time = cue[type];
    }
    
    // left-hand stack
    var lhs = [];
    // right-hand stack
    var rhs = [];
    // final list of cues (with nest child cues) to return
    var nestedCues = [];
    
    var previousCue = null;
    var currentCue = null;
    var position = 0;
    
    while( position < cueList.length){
        currentCue = cueList[position]
        if( currentCue.startTime >= currentCue.endTime){
            console.log(" ERROR: For cue ID# " + String(currentCue.index + 1) + ", start-time must come before end-time");
            return -1;
        }

        if( position == 0 ){
            lhs.push( new CueItem(currentCue, 'startTime' ) );
            rhs.push( new CueItem(currentCue, 'endTime' ) );
            
            nestedCues.push(currentCue);
            
            position++;
            continue;
        }
        
        // previousCueItem is now the last cueItem in the LHS (left-hand stack)
        var previousCueItem = lhs[lhs.length-1]
        var previousCueIndex = previousCueItem.index;

        // If previousCue is a start-time
        // Case #1
        if( currentCue.startTime < previousCueItem.time && previousCueItem.stampType == "startTime"){
            console.log(" ERROR: The start-time of cue ID# " + String(currentCue.index + 1) + 
                        " cannot come before its previous cue, ID# " + String(previousCueIndex + 1) + ".");
            return -1;
            
        }
        // Case #2
        if( currentCue.startTime == previousCueItem.time && previousCueItem.stampType == "startTime"){
            if( isValidNest( currentCue, rhs[rhs.length-1] ) ){
                if( rhs.length ){
                 parentIndex = rhs[rhs.length-1].index;
                 parentCue = cueList[parentIndex];
                 parentCue.children.push(currentCue);
                }
                else{
                    nestedCues.push(currentCue);
                }
                
                lhs.push( new CueItem(currentCue, 'startTime' ) );
                rhs.push( new CueItem(currentCue, 'endTime' ) );
                
                position++;
                continue;
            }
            
            console.log(" ERROR: The end-time of cue ID# " + String(currentCue.index + 1) +
                        " extends beyond its parent cue, ID# " + String(previousCueIndex + 1) + ".");
            return -1;
        }
        // Case #3
        if( currentCue.startTime > previousCueItem.time && previousCueItem.stampType == "startTime"){
            if( isValidNest( currentCue, rhs[rhs.length-1] ) ){
                if( rhs.length ){
                 parentIndex = rhs[rhs.length-1].index;
                 parentCue = cueList[parentIndex];
                 parentCue.children.push(currentCue);
                }
                else{
                    nestedCues.push(currentCue);
                }
                
                lhs.push( new CueItem(currentCue, 'startTime' ) );
                rhs.push( new CueItem(currentCue, 'endTime' ) );
                
                position++;
                continue;
            }
            else {
                // close this parent cue
                lhs.push( rhs.pop() );
            }
            continue;
        }

        // If previousCue is an end-time
        // Case #4
        if( currentCue.startTime < previousCueItem.time && previousCueItem.stampType == "endTime"){
            console.log(" ERROR: The start-time of cue ID# " + String(currentCue.index + 1) +
                        " cannot come after its previous cue, ID# " + String(previousCueIndex + 1) + ".");
            return -1;
            
        }
        // Case #5 (and #6)
        if( currentCue.startTime >= previousCueItem.time && previousCueItem.stampType == "endTime"){
            if( isValidNest( currentCue, rhs[rhs.length-1] ) ){
                if( rhs.length ){
                 parentIndex = rhs[rhs.length-1].index;
                 parentCue = cueList[parentIndex];
                 parentCue.children.push(currentCue);
                }
                else{
                    nestedCues.push(currentCue);
                }
                
                lhs.push( new CueItem(currentCue, 'startTime' ) );
                rhs.push( new CueItem(currentCue, 'endTime' ) );
                
                position++;
                continue;
            }
            else {
                // close this parent cue
                lhs.push( rhs.pop() );
            }
            continue;
        }
    }

    return nestedCues
};
