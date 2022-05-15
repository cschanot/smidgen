var link = 2;

$(document).ready(function () {
	// Load existing users for current project
	$.ajax({
		type: "GET",
		url: "/loadUsers",
		contentType: "application/json"
	}).done(function(data){
		for(var i =0; i<data.length; i++){
			loadUsers(data[i]['id'], data[i]['name'], data[i]['email'], data[i]['role'])
			link = Math.max(link, parseInt(data[i]['id']))
		}
		link = link + 1
	})
    
    // var config = {

    //     apiKey: "AIzaSyCNofoZNnXGBFMBLuqnZFuRdXo5hoHpPK8",
    //     authDomain: "smidgen-5f8b9.firebaseapp.com",
    //     databaseURL: "https://smidgen-5f8b9-default-rtdb.firebaseio.com",
    //     projectId: "smidgen-5f8b9",
    //     storageBucket: "smidgen-5f8b9.appspot.com",
    //     messagingSenderId: "818424523798",
    //     appId: "1:818424523798:web:633db26a153e5d682f5937",
    //     measurementId: "G-XT3XKCDV5C"

          
    // };
    // firebase.initializeApp(config);

    //Firestore part
    firebase.initializeApp({
        apiKey: '"AIzaSyCNofoZNnXGBFMBLuqnZFuRdXo5hoHpPK8',
        authDomain: 'smidgen-5f8b9.firebaseapp.com',
        projectId: 'smidgen-5f8b9'
      });

      var db = firebase.firestore();

    
 
	document.getElementById('add_clicked').addEventListener("click", addNewUser)
    function addNewUser(){
        console.log('clicked!')
        var newUserFullName = document.getElementById('user_name').value;
        var newUserEmail = document.getElementById('user_email').value;
        var selector = document.getElementById('select_role')
        var newUserRole = selector.options[selector.selectedIndex].text;
        // Update firebase
        var user_info = {}
        user_info.id = link
        user_info.fullName = newUserFullName
        user_info.email = newUserEmail
        user_info.role = newUserRole
        $.ajax({
           type:"POST",
           url:"/addUser",
           data: JSON.stringify(user_info),
           contentType: "application/json; charset=utf-8"
        })
        var tbody = document.getElementById('users')

        var trow = document.createElement('tr')
        trow.id = gererate_id(link,'tr') //tr-0
        tbody.append(trow)

        // User index:
        var td_user_id = document.createElement('td');
        td_user_id.className = 'pl-4'
        td_user_id.textContent = link;
        trow.append(td_user_id)

        // User full name:
        var td_user_name_container = document.createElement('td');
        trow.append(td_user_name_container)
        var user_name = document.createElement('h5')
        user_name.className = 'font-medium mb-0'
        user_name.textContent = newUserFullName
        td_user_name_container.append(user_name)

        // User email:
        var td_user_email_container = document.createElement('td')
        trow.append(td_user_email_container)
        var user_email = document.createElement('span')
        user_email.className = 'text-muted'
        user_email.textContent = newUserEmail
        td_user_email_container.append(user_email)

        // User role: 
        var td_user_role_container = document.createElement('td')
        trow.append(td_user_role_container)

        var role_select = document.createElement('select')
        role_select.className = 'form-control category-select'
        role_select.id = gererate_id(id, 's')//s-0
        td_user_role_container.append(role_select)

        var option_admin = document.createElement('option')
        option_admin.textContent = 'Admin'
        option_admin.setAttribute('value', 'Admin')
        role_select.append(option_admin)

        var option_user = document.createElement('option')
        option_user.textContent = 'User'
        option_user.setAttribute('value','User')
        role_select.append(option_user)

        $('#' + role_select.id).val(newUserRole)
        
        

        // Delete button:
        var td_delete_container = document.createElement('td')
        trow.append(td_delete_container)
        var delete_button = document.createElement('button')
        delete_button.className = 'btn btn-outline-danger btn-circle btn-lg btn-circle ml-2'
        delete_button.setAttribute('type', 'button')
        delete_button.id = gererate_id(link, 'bn') //bn-0
        delete_button.onclick = function(){
            var id = this.id;
			console.log('delete button clicked:', id)
			var parsed_id = id.split('-')
			var num_id = parsed_id[1]
			var delete_tr_id = 'tr' + '-' + num_id
			console.log("deleting: ", delete_tr_id)
			document.getElementById(delete_tr_id).remove();
            
            //Update firestore:
            var del_user = {}
            del_user.id = num_id
            $.ajax({
               type:"POST",
               url:"/delUser",
               data: JSON.stringify(del_user),
               contentType: "application/json; charset=utf-8"
            })

        }
        td_delete_container.append(delete_button)
        var delete_icon = document.createElement('i')
        delete_icon.className = 'fa fa-trash'
        delete_button.append(delete_icon)




        //Close the modal:
        $('#addUser .close').click()

        // Update delete id and select id:
        link = link + 1;


        var userdata={
            "user_num":user_num,
            "user_fullname":newUserFullName,
            "user_email":newUserEmail,
            "user_role":newUserRole
           };
          
           // AddDataToDataBase(newUserFullName,userdata,firebase);
           AddDataToDataBaseNew(newUserFullName,userdata)
    
        

    }
    function AddDataToDataBaseNew(Data_Index,Userdata){
        db.collection("projects").doc("1").collection("user").doc(Data_Index).set(Userdata)
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        
     
    }
    
    // function AddDataToDataBase(Data_Index,Userdata,FireBase){
    //     var ref = FireBase.database().ref(Data_Index);
    //     ref.set(Userdata);
    //
    // }
    // function DeleteDataToDataBase(Data_Index,FireBase){
    //     var ref = FireBase.database().ref(Data_Index);
    //     ref.remove();
    // }
    
    

    function loadUsers(id, name, email, role){

        var tbody = document.getElementById('users')

        var trow = document.createElement('tr')
        trow.id = gererate_id(id,'tr') //tr-0
        tbody.append(trow)

        // User index:
        var td_user_id = document.createElement('td');
        td_user_id.className = 'pl-4'
        td_user_id.textContent = id;
        trow.append(td_user_id)

        // User full name:
        var td_user_name_container = document.createElement('td');
        trow.append(td_user_name_container)
        var user_name = document.createElement('h5')
        user_name.className = 'font-medium mb-0'
        user_name.textContent = name
        td_user_name_container.append(user_name)

        // User email:
        var td_user_email_container = document.createElement('td')
        trow.append(td_user_email_container)
        var user_email = document.createElement('span')
        user_email.className = 'text-muted'
        user_email.textContent = email
        td_user_email_container.append(user_email)

        // User role: 
        var td_user_role_container = document.createElement('td')
        trow.append(td_user_role_container)

        var role_select = document.createElement('select')
        role_select.className = 'form-control category-select'
        role_select.id = gererate_id(id, 's')//s-0
        td_user_role_container.append(role_select)

        var option_admin = document.createElement('option')
        option_admin.textContent = 'Admin'
        option_admin.setAttribute('value', 'Admin')
        role_select.append(option_admin)

        var option_user = document.createElement('option')
        option_user.textContent = 'User'
        option_user.setAttribute('value','User')
        role_select.append(option_user)

        $('#' + role_select.id).val(role)
        role_select.onchange = function () {
            var role = role_select.options[role_select.selectedIndex].text
            var id = this.id
            var parsed_id = id.split('-')
            var num_id = parsed_id[1]
            console.log('change role:', num_id, role)
            var change_role = {
                id: num_id,
                role:role
            }

            $.ajax({
               type:"POST",
               url:"/changeUserRole",
               data: JSON.stringify(change_role),
               contentType: "application/json; charset=utf-8"
            })
        }

        // Delete button:
        var td_delete_container = document.createElement('td')
        trow.append(td_delete_container)
        var delete_button = document.createElement('button')
        delete_button.className = 'btn btn-outline-danger btn-circle btn-lg btn-circle ml-2'
        delete_button.setAttribute('type', 'button')
        delete_button.id = gererate_id(link, 'bn') //bn-0
        delete_button.onclick = function(){
            var id = this.id;
			console.log('delete button clicked:', id)
			var parsed_id = id.split('-')
			var num_id = parsed_id[1]
			var delete_tr_id = 'tr' + '-' + num_id
			console.log("deleting: ", delete_tr_id)
			document.getElementById(delete_tr_id).remove();
            
            //Update firestore:
            var del_user = {}
            del_user.id = num_id
            $.ajax({
               type:"POST",
               url:"/delUser",
               data: JSON.stringify(del_user),
               contentType: "application/json; charset=utf-8"
            })

        }
        td_delete_container.append(delete_button)
        var delete_icon = document.createElement('i')
        delete_icon.className = 'fa fa-trash'
        delete_button.append(delete_icon)


    }

    
	function gererate_id(num, type){
		return type + "-" + num;
	}

});





	  
	  