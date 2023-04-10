
alert("hello")

var url = '';
  
    // Making our request 
    fetch(url, { method: 'GET' })
        .then(Result => Result.json())
        .then(string => {
  
            // Printing our response 
            console.log(string);
              
            // Printing our field of our response
            console.log(`Title of our response :  ${string.title}`);
        })
        .catch(errorMsg => { console.log(errorMsg); });