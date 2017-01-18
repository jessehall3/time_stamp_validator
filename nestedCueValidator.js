var myCue = function(id, start, end, text, nestedCueChildren){
    this.id = id;
    this.start = start;
    this.end = end;
    this.text = text || "";
    this.nestedCueChildren = nestedCueChildren || [];
};

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
        return childCue.end <= rhsCueItem.time
    };
    
    var CueItem = function(cue, type){
        this.id = cue.id;
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
        if( currentCue.start >= currentCue.end){
            console.log(" ERROR: For cue ID# " + currentCue.id + ", start-time must come before end-time");
            return -1;
        }

        if( position == 0 ){
            lhs.push( new CueItem(currentCue, 'start' ) );
            rhs.push( new CueItem(currentCue, 'end' ) );
            
            nestedCues.push(currentCue);
            
            position++;
            continue;
        }
        
        // previousCueItem is now the last cueItem in the LHS (left-hand stack)
        var previousCueItem = lhs[lhs.length-1]
        var previousCueId = previousCueItem.id;

        // If previousCue is a start-time
        // Case #1
        if( currentCue.start < previousCueItem.time && previousCueItem.stampType == "start"){
            console.log(" ERROR: The start-time of cue ID# " + currentCue.id + 
                        " cannot come before its previous cue, ID# " + previousCueId + ".");
            return -1;
            
        }
        // Case #2
        if( currentCue.start == previousCueItem.time && previousCueItem.stampType == "start"){
            if( isValidNest( currentCue, rhs[rhs.length-1] ) ){
                if( rhs.length ){
                 parentIndex = rhs[rhs.length-1].id;
                 parentCue = cueList[parentIndex];
                 parentCue.nestedCueChildren.push(currentCue);
                }
                else{
                    nestedCues.push(currentCue);
                }
                
                lhs.push( new CueItem(currentCue, 'start' ) );
                rhs.push( new CueItem(currentCue, 'end' ) );
                
                position++;
                continue;
            }
            
            console.log(" ERROR: The end-time of cue ID# " + currentCue.id +
                        " extends beyond its parent cue, ID# " + previousCueId + ".");
            return -1;
        }
        // Case #3
        if( currentCue.start > previousCueItem.time && previousCueItem.stampType == "start"){
            if( isValidNest( currentCue, rhs[rhs.length-1] ) ){
                if( rhs.length ){
                 parentIndex = rhs[rhs.length-1].id;
                 parentCue = cueList[parentIndex];
                 parentCue.nestedCueChildren.push(currentCue);
                }
                else{
                    nestedCues.push(currentCue);
                }
                
                lhs.push( new CueItem(currentCue, 'start' ) );
                rhs.push( new CueItem(currentCue, 'end' ) );
                
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
        if( currentCue.start < previousCueItem.time && previousCueItem.stampType == "end"){
            console.log(" ERROR: The start-time of cue ID# " + currentCue.id +
                        " cannot come after its previous cue, ID# " + previousCueId + ".");
            return -1;
            
        }
        // Case #5 (and #6)
        if( currentCue.start >= previousCueItem.time && previousCueItem.stampType == "end"){
            if( isValidNest( currentCue, rhs[rhs.length-1] ) ){
                if( rhs.length ){
                 parentIndex = rhs[rhs.length-1].id;
                 parentCue = cueList[parentIndex];
                 parentCue.nestedCueChildren.push(currentCue);
                }
                else{
                    nestedCues.push(currentCue);
                }
                
                lhs.push( new CueItem(currentCue, 'start' ) );
                rhs.push( new CueItem(currentCue, 'end' ) );
                
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
