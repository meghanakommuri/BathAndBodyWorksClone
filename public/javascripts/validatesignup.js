window.onload = function(){

    var email = document.getElementById("email");
    var span1 = document.createElement("span");	

    var pwd = document.getElementById("pwd");
    var span2 = document.createElement("span");

    const isEmailValid = (emailID) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!emailPattern.test(emailID)){
            email.classList.add('error');
            span1.innerHTML = "Error: Email ID is not valid";
            span1.style.display = "block";
            email.parentNode.appendChild(span1);
        }
        return emailPattern.test(emailID);
    };

    const isPasswordValid = (password) => {
        const passwordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\+])(?=.{6,})");
        if(!passwordPattern.test(password)){
            pwd.classList.add('error');
            span2.innerHTML = "Error: You should enter at least 6 characters, one uppercase letter, one number and one special character (!,@,#,$,%,^,&,*,+)";
            span2.style.display = "block";
            pwd.parentNode.appendChild(span2);
        }
        return passwordPattern.test(password);
    };
    
    var form = document.getElementById("myForm");
    form.onsubmit = function(e){

        e.preventDefault();

        var emailVal = email.value;
        var passwordVal = pwd.value;
        
        let emailValid = isEmailValid(emailVal);
        let passwordValid = isPasswordValid(passwordVal);

        if(emailValid && passwordValid){
            document.getElementById('myForm').submit();
        }
    }
}

