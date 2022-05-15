var link = 0
var rename_button_id = null

var url_access = "http://localhost:8080/projects/access/"

$(document).ready(function () {
	var delete_button_text = 'Delete it'
	var open_project_button_text = 'Open it'
	var access_button_text = 'Manage access'
	var rename_button_text = 'Rename it'

	//Display current time: 
	var today = new Date()
	var mon = today.getMonth()+1;
	var day = today.getDate();
	document.getElementById("currentTime").innerHTML = mon + "/" + day;

	// Load existing projects, update link
	$.ajax({
		type: "GET",
		url: "/loadProjects",
		contentType: "application/json"
	}).done(function(data){
		for(var i =0; i<data.length; i++){
			loadExistingProjects(data[i]['id'], data[i]['name'])
			link = Math.max(link, parseInt(data[i]['id']))
		}
		link = link + 1
	})


	$('#renameProject').on('show.bs.modal', function (event) {
		rename_button_id = event.relatedTarget.id
	});



	document.getElementById('create_clicked').addEventListener("click", createNewProject)
	function createNewProject(){ 
		var newProjectName = document.getElementById('project_name').value;
		var projects = document.getElementById('projects')

		// Container for each project entry:
		var project = document.createElement('li')
		var project_id = gererate_id(link, 'proj') //proj-0
		project.id = project_id
		project.className = 'd-flex justify-content-between linkdelete'

		// First div(project name): 
		var div_project_name = document.createElement('div')
		div_project_name.className = 'd-flex flex-row align-items-center'
		var project_name = document.createElement('h6')
		project_name.id = gererate_id(link, 'name') // name-0
		project_name.className = 'mb-0 ml-2 linkrename'
		project_name.textContent = newProjectName

		div_project_name.append(project_name)

		//Second div(dropdown menu): 
		var div_btn_group = document.createElement('div')
		div_btn_group.className = 'btn-group'
		var button = document.createElement('button')
		button.className = 'btn btn-light dropdown-toggle'
		button.setAttribute('type', 'button')
		button.setAttribute('data-toggle','dropdown')
		button.setAttribute('aria-haspopup', 'true')
		button.setAttribute('aria-expanded', 'false')
		div_btn_group.append(button)

		var div_options = document.createElement('div')
		div_options.className = 'dropdown-menu dropdown-menu-right'

		//Button that open a project:
		var button_open = document.createElement('button')
		button_open.className = 'dropdown-item'
		button_open.setAttribute('type', 'button')
		button_open.textContent = open_project_button_text
		div_options.append(button_open)

		//Rename button:
		var button_rename = document.createElement('button')
		button_rename.className = 'dropdown-item rename'
		button_rename.textContent = rename_button_text
		button_rename.id = gererate_id(link,'bnr') //bnr-0, button renames
		button_rename.setAttribute('type', 'button')
		button_rename.setAttribute('data-toggle', 'modal')
		button_rename.setAttribute('data-target', '#renameProject')
		div_options.append(button_rename)

		//Delete button:
		// https://stackoverflow.com/questions/4825295/onclick-to-get-the-id-of-the-clicked-button
		var button_delete = document.createElement('button')
		button_delete.className = 'dropdown-item delete'
		button_delete.id = gererate_id(link,'bnd')//bnd-0 button delete
		button_delete.onclick = function(){
			var id = this.id;
			var parsed_id = id.split('-')
			var num_id = parsed_id[1]
			var delete_proj_id = 'proj' + '-' + num_id
			
			// AJAX request to server:
			var project_info = {};
			project_info.id = num_id;
			$.ajax({
				type:"POST",
				url:"/deleteProject",
				contentType: "application/json",
				data: JSON.stringify(project_info),
				contentType: "application/json; charset=utf-8"
			})

			document.getElementById(delete_proj_id).remove();
		} ;
		button_delete.setAttribute('type', 'button')
		button_delete.textContent = delete_button_text
		div_options.append(button_delete)
		
		//Manage access link:
		var link_manage = document.createElement('a')
		link_manage.className = 'dropdown-item'

		var this_url_access = url_access + link
		link_manage.href = this_url_access
		link_manage.textContent = access_button_text
		div_options.append(link_manage)

		div_btn_group.append(div_options)

		project.append(div_project_name)
		project.append(div_btn_group)
		projects.append(project)

		//Close the modal: 
		$("#createProject .close").click()

		//Create project in firebase: 
        var project_info = {};
		project_info.name = newProjectName;
		project_info.id = link.toString();

		$.ajax({
			type:"POST",
			url:"/createProject",
			contentType: "application/json",
			data: JSON.stringify(project_info),
			contentType: "application/json; charset=utf-8"
		})
		//Update link:
		link = link + 1;

	}

	function loadExistingProjects(id, name){

		var projects = document.getElementById('projects')

		// Container for each project entry:
		var project = document.createElement('li')
		var project_id = gererate_id(id, 'proj') //proj-0
		project.id = project_id
		project.className = 'd-flex justify-content-between linkdelete'

		// First div(project name): 
		var div_project_name = document.createElement('div')
		div_project_name.className = 'd-flex flex-row align-items-center'
		var project_name = document.createElement('h6')
		project_name.id = gererate_id(id, 'name') // name-0
		project_name.className = 'mb-0 ml-2 linkrename'
		project_name.textContent = name

		div_project_name.append(project_name)

		//Second div(dropdown menu): 
		var div_btn_group = document.createElement('div')
		div_btn_group.className = 'btn-group'
		var button = document.createElement('button')
		button.className = 'btn btn-light dropdown-toggle'
		button.setAttribute('type', 'button')
		button.setAttribute('data-toggle','dropdown')
		button.setAttribute('aria-haspopup', 'true')
		button.setAttribute('aria-expanded', 'false')
		div_btn_group.append(button)

		var div_options = document.createElement('div')
		div_options.className = 'dropdown-menu dropdown-menu-right'

		//Button that open a project:
		var button_open = document.createElement('button')
		button_open.id = gererate_id(id,'openit')
		button_open.className = 'dropdown-item'
		button_open.setAttribute('type', 'button')
		button_open.textContent = open_project_button_text
		div_options.append(button_open)
		button_open.onclick = function () {
		 console.log('projectID',this.id)
		 window.location.replace("../html/search.html?projectid="+this.id.split("-")[1])
		}

		//Rename button:
		var button_rename = document.createElement('button')
		button_rename.className = 'dropdown-item rename'
		button_rename.textContent = rename_button_text
		button_rename.id = gererate_id(id,'bnr') //bnr-0, button renames
		button_rename.setAttribute('type', 'button')
		button_rename.setAttribute('data-toggle', 'modal')
		button_rename.setAttribute('data-target', '#renameProject')
		div_options.append(button_rename)

		//Delete button:
		// https://stackoverflow.com/questions/4825295/onclick-to-get-the-id-of-the-clicked-button
		var button_delete = document.createElement('button')
		button_delete.className = 'dropdown-item delete'
		button_delete.id = gererate_id(id,'bnd')//bnd-0 button delete
		button_delete.onclick = function(){
			var id = this.id;
			var num_id = id.split('-')[1]
			var delete_proj_id = 'proj' + '-' + num_id
			
			// AJAX request to server:
			var project_info = {};
			project_info.id = num_id;
			$.ajax({
				type:"POST",
				url:"/deleteProject",
				contentType: "application/json",
				data: JSON.stringify(project_info),
				contentType: "application/json; charset=utf-8"
			})

			document.getElementById(delete_proj_id).remove();
		};
		button_delete.setAttribute('type', 'button')
		button_delete.textContent = delete_button_text
		div_options.append(button_delete)
		
		//Manage access link:
		var link_manage = document.createElement('a')
		link_manage.className = 'dropdown-item'

		var this_url_access = url_access + id
		link_manage.href = this_url_access
		link_manage.textContent = access_button_text
		div_options.append(link_manage)

		div_btn_group.append(div_options)

		project.append(div_project_name)
		project.append(div_btn_group)
		projects.append(project)
		
	}

	document.getElementById('rename_clicked').addEventListener("click", renameProject)
	function renameProject(){
		var newProjectName = document.getElementById('rename_project').value;
		var parsed_id = rename_button_id.split('-')
		var num_id = parsed_id[1]
		var rename_h6_id = 'name' + '-' + num_id
		document.getElementById(rename_h6_id).textContent = newProjectName;

		var project_info = {};
		project_info.new_name = newProjectName;
		project_info.id = num_id;
		$.ajax({
			type:"POST",
			url:"/renameProject",
			contentType: "application/json",
			data: JSON.stringify(project_info),
			contentType: "application/json; charset=utf-8"
		})
		$("#renameProject .close").click()

	}


	function gererate_id(id, type){
		return type + "-" + id;
	}
	
});





	  
	  