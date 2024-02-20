var MyObj = new Object();
MyObj.progressbar = "";
MyObj.progressText = "ProgressText";
MyObj.fCount = 0;

$(function() {

    // preventing page from redirecting

    $("html").on("dragenter dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    //$("html").on("drop", function(e) { e.preventDefault(); e.stopPropagation(); });

    // Drag enter|over|drop
	
    $("body").on("dragenter dragover",".upload-area", 
	  function(e){
        e.stopPropagation();
        e.preventDefault();
      }
	);

   
   /*	
   $("body").on("click",".upload-area",
	  function(e){
	   $("#file").trigger("click");
	  }
	);
	
	
	$("body").on("drop",".upload-area",
	  function(e){
	   TRIGGERFILE(e);
	  }
	);
	*/	
	
    // Drop
	
	$("body").on("drop","#file",
	 function(e){
	    var file = (e.dataTransfer.files) ? e.dataTransfer.files : document.getElementById("file").files[0];	//(this.files)		
		pview(file[0]); //e.originalEvent.dataTransfer.files
	 }
	);

    // file selected
	$("body").on("change","#file",
	 function(e){
		pview();	
	 }
	);	
	
    // Open file selector on div click	
	$("body").on("click","#uploadfile",
	  function(){
	   $("#file").trigger("click");//.click();
	  }	
	);	
	
	$("body").on("click","figure",
	 function(){
	   var Item = $(this).data("item");
	   var ELE = "#Selected_Item_"+Item;
	   var Chkd = $("#Selected_Item_"+Item).is(':checked');//.attr("checked");//.prop("checked");  || .is(':checked')
	   var Tgl = (Chkd) ? false : true;
	   var isChecked = (Tgl) ? "fa-check-square" : "fa-square-o";
	   
	   $("#Selected_Item_"+Item).attr("checked",Tgl).prop("checked",Tgl); 
	   if (Tgl==true) $(this).addClass("ITEMSELECTED");
	   else $(this).removeClass("ITEMSELECTED");	   
	   $(".chk_box_"+Item).removeClass("fa-check-square fa-square-o").addClass(isChecked);  // fa-check-square | fa-square-o chk_box_  
	   
	 }
	);
	
	$("body").on("click",".fa-close",
	  function(){
	    $(".pFileName,#INNERHTML").html("").attr("title","");
		$("#progress_bar").val(0);
	    $(".ProgressText").html("0%");
		$("#FPREVIEW").hide();
	  }
	);
	
	$("body").on("click","#bAction",
	 function(){		 
		 var actn = $(this).val().toLowerCase();
		 
		 switch (actn){
		   case "upload":		    
		    $("#_FACTION").val("~"+actn);
		   break;		 
		 }
		 
		 if ($("#_FACTION").val())  {
		   $(".container").hide();
		   $("#UlImg").show();		   
		   $("#fUpload").submit();
		 }
	 
	 }
	);
	
	
	
}); // end jq

//====
function TRIGGERFILE(e){
          e.stopPropagation();
          e.preventDefault();	
		  var fd = new FormData($("#fUpload")[0]); // GetFormdata ??
		  var reader = new FileReader();
		  var dT = new DataTransfer();		  
		  var file = (e.originalEvent.dataTransfer.files) ? e.originalEvent.dataTransfer.files : document.getElementById("file").files[0];
		  var ajaxData = new FormData($("#fUpload")[0]);
		  //DumpObject(fd); //  file = ev.dataTransfer.items[i].getAsFile(); ev.dataTransfer.files[i].name
		  //DumpObject(reader);
		  //DumpObject(e);
		  //DumpObject(file);
		  //alert("fn: "+e.originalEvent.dataTransfer.files[0]+" file.name: "+file.name);
//  if (droppedFiles) {
//    $.each( droppedFiles, function(i, file) {
      //ajaxData.append( "file", file  );
//    });
//  }		
/*
 $.ajax({
    url: $form.attr('action'),
    type: $form.attr('method'),
    data: ajaxData,
    dataType: 'json',
    cache: false,
    contentType: false,
    processData: false,
    complete: function() {
      //$form.removeClass('is-uploading');
    },
    success: function(data) {
      //$form.addClass( data.success == true ? 'is-success' : 'is-error' );
      if (!data.success) $errorMsg.text(data.error);
    },
    error: function() {
      // Log the error, show an alert, whatever works for you
    }
  });  
  
  $AJ.doAJAX();
  */
		  //fileInput.files = file.name;
		  dT.items.add(e.originalEvent.dataTransfer.files[0]); // file.name ??
		  //dT.items.add(e.originalEvent.dataTransfer.files[3]);
		  //fileInput.files = dT.files;
		  
		  //DumpObject(dT);
		  
		  //fd.append("file",file.name);	
		  //$("#file").trigger("change");	  	
		  //alert("file: "+file[0]);
	      //$("#file").trigger("drop");
		  pview(file[0],e);
}
/*
dropContainer.ondrop = function(evt) {
  // pretty simple -- but not for IE :(
  fileInput.files = evt.dataTransfer.files;

  // If you want to use some of the dropped files
  const dT = new DataTransfer();
  dT.items.add(evt.dataTransfer.files[0]);
  dT.items.add(evt.dataTransfer.files[3]);
  fileInput.files = dT.files;

  evt.preventDefault();
};
*/
//==================================================================================================================================================================
function pview(SelectedFiles,EVENT){
   var files = (SelectedFiles) ? SelectedFiles : document.getElementById("file").files[0]; //$('#file')[0].files[0];   // document.getElementById(ELE).files[0]
   var reader = new FileReader();
   var fExt = (files) ? files.name.replace(/.*\./ig,"").toLowerCase() : "";
   var validextentions = ($("#fUpload").data("validextentions")) ? $("#fUpload").data("validextentions") : "*.*";
   var MyRegEx = ($("#fUpload").data("regex")) ? $("#fUpload").data("regex") : "\w+";
   var RegEx = new RegExp(MyRegEx,"ig");
   var HTML = ulFile = ProgressBar = canvas = ctx = base_image = PHPFN = "";
   var isCanvas = 0;
   var fd = new FormData();
   var MyFileParts = files.name.split(/\./ig);
   var MyFileExt = "."+MyFileParts[ MyFileParts.length -1 ];   
   
   //alert("pview;  SelectedFiles: "+SelectedFiles+"   MyObj.fCount: "+MyObj.fCount);
   
   if (MyObj.fCount==0){
	   if (files.name && RegEx.test(MyFileExt)) {			
		   //if ( $("#FPREVIEW").length )  $("#FPREVIEW").remove();  			    
			//$("#uploadfile").append('');		   
		   ProgressBar = $(".percent"); // -- OOP Global obj variable.
	       reader.onprogress = updProgress;		   
		   reader.readAsDataURL(files);
		   reader.addEventListener("load", 
		      function(){
			   if (reader.result){
			       PHPFN = files.name.replace(/[^a-z0-9\.]+/ig,"-").toLowerCase();
				   $("#fn").html(PHPFN);
				   
				   switch (fExt){	   
				    case "mp4":
				    case "ogv":
				    case "webm":
					  HTML += '<video id="Preview_VID" width="300" data-height="80" poster="" type="'+files.type+'" preload="auto" preload="auto" data-type="mp4,ogv,webm" controls="controls" class="" title="'+PHPFN+'" class="fPreview fPreview2"><source id="Preview_VID_SRC" src="'+reader.result+'" type="'+files.type+'"></video>';
					break;	   
				    case "mp3":
				    case "ogg":
				    case "wav":
					  HTML += '<audio id="Preview_AUD" width="100" height="80" title="'+PHPFN+'" src="'+reader.result+'" type="'+files.type+'" preload="auto" controls="controls" controls="controls" class="fPreview fPreview2"><source id="Preview_AUD_SRC" src="'+reader.result+'" type='+files.type+'"></audio>';
					break;
					
					case "pdf":
					case "xbmp":
					 HTML = '<object id="Preview_OTHR" data="'+reader.result+'" width="90%" height="200" title="'+PHPFN+'" type="'+files.type+'" data-type="pdf|bmp|tiff" data-vt="video/mp4" data-mt="image/jpeg | image/png | image/gif | image/svg+xml | image/apng | image/x-icon | image/webp | application/pdf | .font/woff | font/ttf | font/otf | text/plain | text/csv | text/html" data-nfo="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types" class="fPreview fPreview2"></object>';
					break;
					
					case "rpng": //bpg
					 HTML += '<canvas id="Preview_Canvas" width="200" height="65" title="'+PHPFN+'" data-nfo="Do we NEED Canvas? since it\'s RARELY used?" data-preview="1" data-nfo="preview jpg,gif,png,bmp......" class="fPreview fPreview2"></canvas>';
	                 isCanvas = 1;
					break;
					
					default: // png,jpg,gif,bmp,webp
					  HTML += '<img id="Preview" src="'+reader.result+'" alt="'+PHPFN+'" title="'+PHPFN+'" class="fPreview fPreview2">';
					break;
				   
				   } // end case/ switch
				   
				   //HTML += '<div class="pFileName">File: '+PHPFN+'</div> </figure><!-- end fPreviewContainer -->';
				   
				   $(".pFileName").html(PHPFN).attr("title",PHPFN);
				   $("#INNERHTML").html(HTML).attr("title",PHPFN);
				   
				   $("#progress_bar").val(100);
	               $(".ProgressText").html("100%");
				   //$(".UPLOAD").hide();
				   $("#FPREVIEW").show();
				   $("#_FD").val(PHPFN+"\t"+files.type+"\t"+files.size); // reader.result
				   
				   if (isCanvas==1){
				     //img.width
					 //alert("fn: "+reader.result);			   
				     canvas = document.getElementById("Preview_Canvas");				 
					 ctx = canvas.getContext("2d"); //NewNode;				
	                 base_image = new Image();
	                 base_image.src = reader.result;
	                 base_image.onload = function() {
	                   ctx.drawImage(base_image,0,0);
					   canvas.width = base_image.width;
					   canvas.height = base_image.height;
					   $("#Preview_Canvas").attr("width",base_image.width).attr("height",base_image.height);
	                 } 			   
				   } // end ?? canvas
				   
				   
				   //fd.append('file',files);
	               //uploadData(fd);
				   
				   //
				   
			    } // end ??		   		   
			  } // end ??
		   );
		   
		   $("#bAction").removeClass("HIDDEN");
		   
	  }
	  else {
	   alert("ERROR:\n\n	File:\n\n		"+files.name+"\n\n	Is Not Supported.\n	"+ validextentions +" Only.\n\n");
	  }
  } // end MyObj.fCount == 0
  MyObj.fCount ++;
  
}
//==================================================================================================================================================================
// Sending AJAX request and upload file
function uploadData(formdata){
   var myData = "";
   $("form").each(function(i,ele) {
	      myData += jQuery(this).serialize(); // if
   });
   
    $.ajax({
        url: '_upload.php',
        type: 'post',
        data: myData,
		async: true,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function(response){
            //addThumbnail(response);
			console.log("Success!");
        },
		error: function(xhr,err){
		 console.log("MSG:\nreadyState: "+xhr.readyState+"\nStatus: "+xhr.status+"\nresponseText: "+xhr.responseText+"\nERR: "+err);
		},
		complete:function(){
		}
    });
	
}
//=========================================================================
function updProgress(evt) {  // evt is an ProgressEvent.
    var percentLoaded = 0;    
	var Remainder = evt.total - evt.loaded;
    $("#progress_bar").val(0);
    $(".ProgressText").html("0%");
    if (evt.lengthComputable) {
        percentLoaded = Math.round((evt.loaded / evt.total) * 100);
		$("#progress_bar").val(percentLoaded);
        $(".ProgressText").html(percentLoaded + "%");
    } 	
}

//=========================================================================
function DumpObject(obj,r) {
	var output = '';
	var xo=1;
	var rd = (r) ? r : "";
	for (var property in obj) {
	   if (typeof obj[property] === "object" && xo==1) {
	    DumpObject(obj[property],"\n\t");
	   }
	   else output += rd+property + ': ' + obj[property] + '; ' + "\n\n";
	}
	console.log(obj + ": " + output);
}
//=