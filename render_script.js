let json_a = {
  };

let json_b = {
  };
    
    var state = 'state_a';
    function render() {
        let json;
        if (state === 'state_a')
            json = json_a;
        else
            json = json_b;
        return JSON.stringify(json);
    }
    function action(event) {
        if (event === 'click') 
            state = 'state_b';
        else
            state = 'state_a';
        return render();
    }
